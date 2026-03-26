{
  "version": "1.0.0",
  "last_updated": "2026-03-21",
  "source": "bramsray3_database_validation",
  "description": "Complete database validation configuration for KPRFlow Enterprise",
  
  "validation_queries": [
    {
      "query_id": "data_completeness_check",
      "name": "Data Completeness Check",
      "description": "Check for missing or incomplete data across all tables",
      "category": "data_quality",
      "enabled": true,
      "sql": "
        SELECT 
          'customers' as table_name,
          COUNT(*) as total_records,
          COUNT(CASE WHEN name IS NULL OR name = '' THEN 1 END) as missing_name,
          COUNT(CASE WHEN email IS NULL OR email = '' THEN 1 END) as missing_email,
          COUNT(CASE WHEN phone IS NULL OR phone = '' THEN 1 END) as missing_phone,
          COUNT(CASE WHEN nik IS NULL OR nik = '' THEN 1 END) as missing_nik,
          ROUND((COUNT(*) - COUNT(CASE WHEN name IS NULL OR name = '' THEN 1 END)) * 100.0 / COUNT(*), 2) as completeness_percentage
        FROM customers
        
        UNION ALL
        
        SELECT 
          'properties' as table_name,
          COUNT(*) as total_records,
          COUNT(CASE WHEN property_name IS NULL OR property_name = '' THEN 1 END) as missing_name,
          COUNT(CASE WHEN property_type IS NULL OR property_type = '' THEN 1 END) as missing_type,
          COUNT(CASE WHEN location IS NULL OR location = '' THEN 1 END) as missing_location,
          COUNT(CASE WHEN price IS NULL OR price <= 0 THEN 1 END) as missing_price,
          ROUND((COUNT(*) - COUNT(CASE WHEN property_name IS NULL OR property_name = '' THEN 1 END)) * 100.0 / COUNT(*), 2) as completeness_percentage
        FROM properties
        
        UNION ALL
        
        SELECT 
          'applications' as table_name,
          COUNT(*) as total_records,
          COUNT(CASE WHEN customer_id IS NULL THEN 1 END) as missing_customer,
          COUNT(CASE WHEN property_id IS NULL THEN 1 END) as missing_property,
          COUNT(CASE WHEN application_date IS NULL THEN 1 END) as missing_date,
          COUNT(CASE WHEN status IS NULL OR status = '' THEN 1 END) as missing_status,
          ROUND((COUNT(*) - COUNT(CASE WHEN customer_id IS NULL THEN 1 END)) * 100.0 / COUNT(*), 2) as completeness_percentage
        FROM applications
      ",
      "expected_results": {
        "completeness_percentage": {
          "min": 95.0,
          "target": 98.0,
          "max": 100.0
        }
      }
    },
    {
      "query_id": "relationship_integrity_check",
      "name": "Relationship Integrity Check",
      "description": "Validate foreign key relationships and data consistency",
      "category": "data_integrity",
      "enabled": true,
      "sql": "
        -- Check applications with invalid customer references
        SELECT 
          'applications_customer_fk' as relationship_type,
          COUNT(*) as total_applications,
          COUNT(CASE WHEN c.id IS NULL THEN 1 END) as orphaned_applications,
          ROUND((COUNT(*) - COUNT(CASE WHEN c.id IS NULL THEN 1 END)) * 100.0 / COUNT(*), 2) as integrity_percentage
        FROM applications a
        LEFT JOIN customers c ON a.customer_id = c.id
        
        UNION ALL
        
        -- Check applications with invalid property references
        SELECT 
          'applications_property_fk' as relationship_type,
          COUNT(*) as total_applications,
          COUNT(CASE WHEN p.id IS NULL THEN 1 END) as orphaned_applications,
          ROUND((COUNT(*) - COUNT(CASE WHEN p.id IS NULL THEN 1 END)) * 100.0 / COUNT(*), 2) as integrity_percentage
        FROM applications a
        LEFT JOIN properties p ON a.property_id = p.id
        
        UNION ALL
        
        -- Check documents with invalid application references
        SELECT 
          'documents_application_fk' as relationship_type,
          COUNT(*) as total_documents,
          COUNT(CASE WHEN a.id IS NULL THEN 1 END) as orphaned_documents,
          ROUND((COUNT(*) - COUNT(CASE WHEN a.id IS NULL THEN 1 END)) * 100.0 / COUNT(*), 2) as integrity_percentage
        FROM documents d
        LEFT JOIN applications a ON d.application_id = a.id
      ",
      "expected_results": {
        "integrity_percentage": {
          "min": 99.0,
          "target": 100.0,
          "max": 100.0
        }
      }
    },
    {
      "query_id": "business_rule_validation",
      "name": "Business Rule Validation",
      "description": "Validate business rules and data constraints",
      "category": "business_rules",
      "enabled": true,
      "sql": "
        -- Check loan amount vs property price ratio
        SELECT 
          'loan_to_value_ratio' as rule_type,
          COUNT(*) as total_applications,
          COUNT(CASE WHEN a.loan_amount > (p.price * 0.8) THEN 1 END) as violations,
          ROUND((COUNT(*) - COUNT(CASE WHEN a.loan_amount > (p.price * 0.8) THEN 1 END)) * 100.0 / COUNT(*), 2) as compliance_percentage
        FROM applications a
        JOIN properties p ON a.property_id = p.id
        WHERE a.status IN ('approved', 'completed')
        
        UNION ALL
        
        -- Check customer age for loan eligibility
        SELECT 
          'customer_age_validation' as rule_type,
          COUNT(*) as total_customers,
          COUNT(CASE WHEN AGE(birth_date) < 21 OR AGE(birth_date) > 65 THEN 1 END) as violations,
          ROUND((COUNT(*) - COUNT(CASE WHEN AGE(birth_date) < 21 OR AGE(birth_date) > 65 THEN 1 END)) * 100.0 / COUNT(*), 2) as compliance_percentage
        FROM customers
        WHERE birth_date IS NOT NULL
        
        UNION ALL
        
        -- Check phone number format
        SELECT 
          'phone_format_validation' as rule_type,
          COUNT(*) as total_customers,
          COUNT(CASE WHEN phone !~ '^\\+62[0-9]{9,12}$' THEN 1 END) as violations,
          ROUND((COUNT(*) - COUNT(CASE WHEN phone !~ '^\\+62[0-9]{9,12}$' THEN 1 END)) * 100.0 / COUNT(*), 2) as compliance_percentage
        FROM customers
        WHERE phone IS NOT NULL
        
        UNION ALL
        
        -- Check email format
        SELECT 
          'email_format_validation' as rule_type,
          COUNT(*) as total_customers,
          COUNT(CASE WHEN email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$' THEN 1 END) as violations,
          ROUND((COUNT(*) - COUNT(CASE WHEN email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$' THEN 1 END)) * 100.0 / COUNT(*), 2) as compliance_percentage
        FROM customers
        WHERE email IS NOT NULL
      ",
      "expected_results": {
        "compliance_percentage": {
          "min": 95.0,
          "target": 98.0,
          "max": 100.0
        }
      }
    },
    {
      "query_id": "performance_optimization",
      "name": "Performance Optimization Check",
      "description": "Check database performance and optimization opportunities",
      "category": "performance",
      "enabled": true,
      "sql": "
        -- Check table sizes and row counts
        SELECT 
          schemaname,
          tablename,
          n_tup_ins as inserts,
          n_tup_upd as updates,
          n_tup_del as deletes,
          n_live_tup as live_rows,
          n_dead_tup as dead_rows,
          last_vacuum,
          last_analyze,
          last_autovacuum,
          last_autoanalyze
        FROM pg_stat_user_tables
        ORDER BY n_live_tup DESC
        
        UNION ALL
        
        -- Check index usage
        SELECT 
          schemaname,
          tablename,
          indexname,
          idx_tup_read as index_reads,
          idx_tup_fetch as index_fetches,
          idx_scan as index_scans
        FROM pg_stat_user_indexes
        WHERE idx_scan > 0
        ORDER BY idx_scan DESC
        
        UNION ALL
        
        -- Check slow queries
        SELECT 
          query,
          calls,
          total_time,
          mean_time,
          rows,
          100.0 * shared_blks_hit / nullif(shared_blks_hit + shared_blks_read, 0) AS hit_percent
        FROM pg_stat_statements
        WHERE mean_time > 1000
        ORDER BY mean_time DESC
        LIMIT 10
      ",
      "expected_results": {
        "hit_percent": {
          "min": 95.0,
          "target": 98.0,
          "max": 100.0
        },
        "mean_time": {
          "max": 1000.0,
          "target": 500.0,
          "min": 0.0
        }
      }
    },
    {
      "query_id": "data_consistency_check",
      "name": "Data Consistency Check",
      "description": "Check for data consistency and duplicates",
      "category": "data_consistency",
      "enabled": true,
      "sql": "
        -- Check duplicate customers by email
        SELECT 
          'duplicate_customers_email' as duplicate_type,
          COUNT(*) as total_duplicates,
          COUNT(DISTINCT email) as unique_emails,
          ROUND(COUNT(*) * 100.0 / COUNT(DISTINCT email), 2) as duplicate_ratio
        FROM customers
        WHERE email IS NOT NULL AND email != ''
        GROUP BY email
        HAVING COUNT(*) > 1
        
        UNION ALL
        
        -- Check duplicate customers by phone
        SELECT 
          'duplicate_customers_phone' as duplicate_type,
          COUNT(*) as total_duplicates,
          COUNT(DISTINCT phone) as unique_phones,
          ROUND(COUNT(*) * 100.0 / COUNT(DISTINCT phone), 2) as duplicate_ratio
        FROM customers
        WHERE phone IS NOT NULL AND phone != ''
        GROUP BY phone
        HAVING COUNT(*) > 1
        
        UNION ALL
        
        -- Check duplicate customers by NIK
        SELECT 
          'duplicate_customers_nik' as duplicate_type,
          COUNT(*) as total_duplicates,
          COUNT(DISTINCT nik) as unique_niks,
          ROUND(COUNT(*) * 100.0 / COUNT(DISTINCT nik), 2) as duplicate_ratio
        FROM customers
        WHERE nik IS NOT NULL AND nik != ''
        GROUP BY nik
        HAVING COUNT(*) > 1
        
        UNION ALL
        
        -- Check inconsistent application statuses
        SELECT 
          'inconsistent_application_status' as inconsistency_type,
          COUNT(*) as total_inconsistent,
          COUNT(DISTINCT id) as unique_applications,
          ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM applications), 2) as inconsistency_ratio
        FROM applications
        WHERE status NOT IN ('pending', 'approved', 'rejected', 'completed', 'cancelled')
      ",
      "expected_results": {
        "duplicate_ratio": {
          "max": 5.0,
          "target": 1.0,
          "min": 0.0
        },
        "inconsistency_ratio": {
          "max": 2.0,
          "target": 0.0,
          "min": 0.0
        }
      }
    }
  ],
  
  "validation_reports": [
    {
      "report_id": "data_quality_report",
      "name": "Data Quality Report",
      "description": "Comprehensive data quality assessment",
      "category": "data_quality",
      "enabled": true,
      "frequency": "daily",
      "recipients": ["data_team", "management"],
      "format": "html",
      "sections": [
        "data_completeness",
        "data_integrity",
        "business_rule_compliance",
        "data_consistency",
        "performance_metrics"
      ]
    },
    {
      "report_id": "validation_error_report",
      "name": "Validation Error Report",
      "description": "Detailed report of validation errors and issues",
      "category": "error_reporting",
      "enabled": true,
      "frequency": "daily",
      "recipients": ["data_team", "dev_team"],
      "format": "json",
      "sections": [
        "validation_failures",
        "error_details",
        "affected_records",
        "recommended_actions"
      ]
    },
    {
      "report_id": "performance_report",
      "name": "Database Performance Report",
      "description": "Database performance and optimization report",
      "category": "performance",
      "enabled": true,
      "frequency": "weekly",
      "recipients": ["db_team", "management"],
      "format": "html",
      "sections": [
        "query_performance",
        "index_usage",
        "table_statistics",
        "optimization_recommendations"
      ]
    }
  ],
  
  "validation_settings": {
    "execution_settings": {
      "max_execution_time_seconds": 300,
      "parallel_execution": true,
      "max_parallel_queries": 5,
      "retry_on_failure": true,
      "max_retry_attempts": 3
    },
    "threshold_settings": {
      "warning_threshold": 90.0,
      "critical_threshold": 80.0,
      "alert_on_warning": true,
      "alert_on_critical": true
    },
    "logging_settings": {
      "log_all_queries": true,
      "log_query_performance": true,
      "log_validation_results": true,
      "log_level": "INFO"
    }
  },
  
  "alerting_settings": {
    "enabled": true,
    "alert_channels": ["email", "internal_notification"],
    "alert_recipients": {
      "data_team": ["data.manager@kprflow.com"],
      "dev_team": ["dev.lead@kprflow.com"],
      "management": ["management@kprflow.com"]
    },
    "alert_conditions": {
      "data_quality_below_threshold": true,
      "validation_errors_above_threshold": true,
      "performance_degradation": true,
      "integrity_violations": true
    }
  },
  
  "integration_settings": {
    "data_quality_integration": {
      "enabled": true,
      "sync_with_data_cleaning": true,
      "update_quality_metrics": true,
      "trigger_cleaning_workflows": true
    },
    "workflow_tracking_integration": {
      "enabled": true,
      "update_workflow_status": true,
      "trigger_workflow_actions": true,
      "log_validation_results": true
    },
    "notification_system_integration": {
      "enabled": true,
      "send_validation_notifications": true,
      "update_notification_preferences": true,
      "track_validation_progress": true
    }
  },
  
  "metadata": {
    "created_date": "2026-03-21",
    "last_modified": "2026-03-21",
    "version": "1.0.0",
    "author": "KPRFlow Enterprise",
    "description": "Complete database validation configuration for KPRFlow Enterprise",
    "total_queries": 5,
    "total_reports": 3,
    "validation_categories": 5,
    "data_sources": [
      "bramsray3/database/CIRUAS_LAND_VALIDATION_REPORT.sql"
    ],
    "data_quality": "enterprise",
    "validation_status": "verified",
    "integration_ready": true
  }
}
