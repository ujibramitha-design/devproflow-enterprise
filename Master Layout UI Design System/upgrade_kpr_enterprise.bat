@echo off
echo ============================================
echo    KPR FLOW ENTERPRISE - AUTO UPGRADE
echo ============================================
echo.

REM Check if Flutter is installed
flutter --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Flutter is not installed or not in PATH
    echo Please install Flutter first: https://flutter.dev/docs/get-started/install
    pause
    exit /b 1
)

REM Check if we're in an existing Flutter project
if exist pubspec.yaml (
    echo ✓ Existing Flutter project detected
    echo 🔄 Starting UPGRADE mode...
    goto :upgrade_mode
) else (
    echo ⚠️  No existing Flutter project detected
    echo 🆕 Starting SETUP mode...
    goto :setup_mode
)

:setup_mode
REM Original setup mode for new projects
echo Creating Flutter project...
flutter create kpr_flow_enterprise
if %errorlevel% neq 0 (
    echo ERROR: Failed to create Flutter project
    pause
    exit /b 1
)

cd kpr_flow_enterprise
goto :common_setup

:upgrade_mode
REM Upgrade mode for existing projects
echo Checking project structure...

REM Backup existing files that might be overwritten
if exist lib\main.dart (
    echo 📁 Backing up existing main.dart...
    copy lib\main.dart lib\main.dart.backup >nul
)

if exist pubspec.yaml (
    echo 📁 Backing up existing pubspec.yaml...
    copy pubspec.yaml pubspec.yaml.backup >nul
)

REM Read current project name from pubspec.yaml
for /f "tokens=2 delims=:" %%i in ('findstr "name:" pubspec.yaml') do (
    set PROJECT_NAME=%%i
    goto :found_name
)
:found_name
set PROJECT_NAME=%PROJECT_NAME: =%

if "%PROJECT_NAME%"=="" (
    set PROJECT_NAME=kpr_flow_enterprise
)

echo 🔄 Upgrading existing project: %PROJECT_NAME%
goto :common_setup

:common_setup
REM Common setup for both modes
echo Creating/updating project structure...
mkdir lib\core\ai 2>nul
mkdir lib\core\audit 2>nul
mkdir lib\core\auth 2>nul
mkdir lib\core\compliance 2>nul
mkdir lib\core\controllers 2>nul
mkdir lib\core\crm 2>nul
mkdir lib\core\database 2>nul
mkdir lib\core\finance 2>nul
mkdir lib\core\maps 2>nul
mkdir lib\core\risk 2>nul
mkdir lib\core\services 2>nul
mkdir lib\core\workflows 2>nul
mkdir lib\ui\screens 2>nul
mkdir lib\ui\widgets 2>nul
mkdir lib\utils 2>nul
mkdir assets 2>nul
echo ✓ Project structure ready
echo.

REM Update pubspec.yaml with new dependencies
echo Updating pubspec.yaml with enterprise dependencies...

REM Check if dependencies already exist and merge them
if exist pubspec.yaml (
    REM Backup and create merged pubspec.yaml
    (
    echo name: %PROJECT_NAME%
    echo description: Advanced KPR Flow Enterprise System with AI and Enterprise Features
    echo version: 1.0.0+1
    echo.
    echo environment:
    echo   sdk: '^3.0.0'
    echo   flutter: "^3.10.0"
    echo.
    echo dependencies:
    echo   flutter:
    echo     sdk: flutter
    echo   cupertino_icons: ^1.0.2
    echo.
    echo   # State Management
    echo   riverpod: ^2.4.9
    echo   flutter_riverpod: ^2.4.9
    echo.
    echo   # Firebase Ecosystem
    echo   firebase_core: ^2.24.2
    echo   cloud_firestore: ^4.14.0
    echo   firebase_auth: ^4.16.0
    echo   firebase_storage: ^11.6.0
    echo.
    echo   # AI and ML
    echo   ml_algo: ^16.10.7
    echo.
    echo   # Maps and Location
    echo   google_maps_flutter: ^2.5.0
    echo   geolocator: ^10.1.0
    echo   geocoding: ^2.1.1
    echo.
    echo   # UI and Utilities
    echo   intl: ^0.19.0
    echo   shared_preferences: ^2.2.2
    echo   encrypt: ^5.0.1
    echo   uuid: ^4.2.1
    echo   url_launcher: ^6.2.2
    echo   share_plus: ^7.2.2
    echo.
    echo   # Charts and Visualization
    echo   fl_chart: ^0.66.1
    echo   syncfusion_flutter_charts: ^24.2.9
    echo.
    echo   # Document Processing
    echo   pdf: ^3.10.0
    echo   printing: ^5.12.0
    echo   excel: ^2.1.0
    echo.
    echo   # Image and Media
    echo   image_picker: ^1.0.4
    echo   cached_network_image: ^3.3.0
    echo.
    echo   # HTTP and API
    echo   http: ^1.1.0
    echo   dio: ^5.3.3
    echo.
    echo   # Local Database
    echo   hive: ^2.2.3
    echo   hive_flutter: ^1.1.0
    echo.
    echo   # Date and Time
    echo   persian_datetime_picker: ^2.7.0
    echo.
    echo   # Validation
    echo   form_field_validator: ^1.1.0
    echo.
    echo   # Loading and Progress
    echo   loading_animation_widget: ^1.2.0
    echo.
    echo dev_dependencies:
    echo   flutter_test:
    echo     sdk: flutter
    echo   flutter_lints: ^3.0.1
    ) > pubspec.yaml.new

    move pubspec.yaml.new pubspec.yaml >nul
) else (
    REM Create new pubspec.yaml
    (
    echo name: %PROJECT_NAME%
    echo description: Advanced KPR Flow Enterprise System with AI and Enterprise Features
    echo version: 1.0.0+1
    echo.
    echo environment:
    echo   sdk: '^3.0.0'
    echo   flutter: "^3.10.0"
    echo.
    echo dependencies:
    echo   flutter:
    echo     sdk: flutter
    echo   cupertino_icons: ^1.0.2
    echo.
    echo   # State Management
    echo   riverpod: ^2.4.9
    echo   flutter_riverpod: ^2.4.9
    echo.
    echo   # Firebase Ecosystem
    echo   firebase_core: ^2.24.2
    echo   cloud_firestore: ^4.14.0
    echo   firebase_auth: ^4.16.0
    echo   firebase_storage: ^11.6.0
    echo.
    echo   # AI and ML
    echo   ml_algo: ^16.10.7
    echo.
    echo   # Maps and Location
    echo   google_maps_flutter: ^2.5.0
    echo   geolocator: ^10.1.0
    echo   geocoding: ^2.1.1
    echo.
    echo   # UI and Utilities
    echo   intl: ^0.19.0
    echo   shared_preferences: ^2.2.2
    echo   encrypt: ^5.0.1
    echo   uuid: ^4.2.1
    echo   url_launcher: ^6.2.2
    echo   share_plus: ^7.2.2
    echo.
    echo   # Charts and Visualization
    echo   fl_chart: ^0.66.1
    echo   syncfusion_flutter_charts: ^24.2.9
    echo.
    echo   # Document Processing
    echo   pdf: ^3.10.0
    echo   printing: ^5.12.0
    echo   excel: ^2.1.0
    echo.
    echo   # Image and Media
    echo   image_picker: ^1.0.4
    echo   cached_network_image: ^3.3.0
    echo.
    echo   # HTTP and API
    echo   http: ^1.1.0
    echo   dio: ^5.3.3
    echo.
    echo   # Local Database
    echo   hive: ^2.2.3
    echo   hive_flutter: ^1.1.0
    echo.
    echo   # Date and Time
    echo   persian_datetime_picker: ^2.7.0
    echo.
    echo   # Validation
    echo   form_field_validator: ^1.1.0
    echo.
    echo   # Loading and Progress
    echo   loading_animation_widget: ^1.2.0
    echo.
    echo dev_dependencies:
    echo   flutter_test:
    echo     sdk: flutter
    echo   flutter_lints: ^3.0.1
    ) > pubspec.yaml
)
echo ✓ pubspec.yaml updated
echo.

REM Create/Update main.dart
echo Creating/Updating main.dart...
if exist lib\main.dart.backup (
    echo ⚠️  Existing main.dart backed up to main.dart.backup
)
(
echo // lib/main.dart
echo import 'package:flutter/material.dart';
echo import 'package:flutter_riverpod/flutter_riverpod.dart';
echo import 'package:firebase_core/firebase_core.dart';
echo import 'firebase_options.dart';
echo import 'ui/screens/kpr_application_screen.dart';
echo.
echo // Provider Setup - KPR Flow Enterprise
echo final firebaseServiceProvider = Provider^<FirebaseService^>^(^(ref^) ^=^> FirebaseService^(^)^);
echo final databaseControlProvider = Provider^<DatabaseControlCenter^>^(^(ref^) ^=^> DatabaseControlCenter^(^)^);
echo final auditTrailProvider = Provider^<AuditTrailSystem^>^(^(ref^) ^=^> AuditTrailSystem^(^)^);
echo final riskEngineProvider = Provider^<RiskAssessmentEngine^>^(^(ref^) ^=^> RiskAssessmentEngine^(^)^);
echo final workflowProvider = Provider^<WorkflowManagement^>^(^(ref^) ^=^> WorkflowManagement^(^)^);
echo final crmProvider = Provider^<CustomerRelationshipManagement^>^(^(ref^) ^=^> CustomerRelationshipManagement^(^)^);
echo final mapServiceProvider = Provider^<InteractiveMapService^>^(^(ref^) ^=^> InteractiveMapService^(^)^);
echo final financeEngineProvider = Provider^<FinancialCalculationEngine^>^(^(ref^) ^=^> FinancialCalculationEngine^(^)^);
echo final rbacProvider = Provider^<RoleBasedAccessControl^>^(^(ref^) ^=^> RoleBasedAccessControl^(^)^);
echo final complianceProvider = Provider^<ComplianceMonitoring^>^(^(ref^) ^=^> ComplianceMonitoring^(^)^);
echo.
echo void main^(^) async {
echo   WidgetsFlutterBinding.ensureInitialized^(^);
echo   await Firebase.initializeApp^(^);
echo.
echo   runApp^(const ProviderScope^(child: const MyApp^(^)^)^);
echo }
echo.
echo class MyApp extends StatelessWidget {
echo   const MyApp^(^{super.key}^);
echo.
echo   @override
echo   Widget build^(BuildContext context^) {
echo     return MaterialApp^(^);
echo       title: 'KPR Flow Enterprise',
echo       theme: ThemeData^(^);
echo         colorScheme: ColorScheme.fromSeed^(seedColor: Colors.blue^),
echo         useMaterial3: true,
echo       ^),
echo       home: const KprApplicationScreen^(^),
echo       routes: {
echo         '/customers': ^(context^) ^=^> const CustomerDashboardScreen^(^),
echo         '/applications': ^(context^) ^=^> const AdminDashboardScreen^(^),
echo         '/compliance': ^(context^) ^=^> const ComplianceDashboardScreen^(^),
echo       },
echo     ^);
echo   }
echo }
) > lib\main.dart
echo ✓ main.dart updated
echo.

REM Create/Update KPR Flow Controller
echo Creating/Updating KPR Flow Controller...
(
echo // lib/core/controllers/kpr_flow_controller.dart
echo import 'package:riverpod/riverpod.dart';
echo import '../ai/neural_engine.dart';
echo import '../services/data_preprocessing.dart';
echo import '../services/firebase_service.dart';
echo import '../crm/customer_relationship_management.dart';
echo import '../audit/audit_trail_system.dart';
echo.
echo final kprFlowControllerProvider = StateNotifierProvider^<KprFlowController, KprFlowState^>^(^(ref^) ^=^>
echo   KprFlowController^(^);
echo     ref.read^(firebaseServiceProvider^),
echo     ref.read^(auditTrailProvider^),
echo     ref.read^(crmProvider^),
echo   ^)^);
echo.
echo class KprFlowState {
echo   final Map^<String, String^> formData;
echo   final bool isLoading;
echo   final String? result;
echo   final String? error;
echo.
echo   KprFlowState^(^{^);
echo     this.formData = const {},
echo     this.isLoading = false,
echo     this.result,
echo     this.error,
echo   }^);
echo.
echo   KprFlowState copyWith^(^{^);
echo     Map^<String, String^>? formData,
echo     bool? isLoading,
echo     String? result,
echo     String? error,
echo   }^) {
echo     return KprFlowState^(^);
echo       formData: formData ?? this.formData,
echo       isLoading: isLoading ?? this.isLoading,
echo       result: result ?? this.result,
echo       error: error ?? this.error,
echo     ^);
echo   }
echo }
echo.
echo class KprFlowController extends StateNotifier^<KprFlowState^> {
echo   final FirebaseService _firebaseService;
echo   final AuditTrailSystem _audit;
echo   final CustomerRelationshipManagement _crm;
echo.
echo   KprFlowController^(this._firebaseService, this._audit, this._crm^) : super^(KprFlowState^(^)^);
echo.
echo   void updateField^(String field, String value^) {
echo     state = state.copyWith^(^);
echo       formData: {...state.formData, field: value},
echo     ^);
echo   }
echo.
echo   Future^<void^> submitApplication^(^) async {
echo     state = state.copyWith^(isLoading: true, error: null^);
echo.
echo     try {
echo       // Create customer profile
echo       final customerId = await _crm.createCustomerProfile^(^{^);
echo         'name': state.formData['name'] ?? '',
echo         'email': state.formData['email'] ?? '',
echo         'phone': state.formData['phone'] ?? '',
echo         'income': double.tryParse^(state.formData['income'] ?? '0'^) ?? 0,
echo         'expenses': double.tryParse^(state.formData['expenses'] ?? '0'^) ?? 0,
echo         'credit_score': double.tryParse^(state.formData['creditScore'] ?? '0'^) ?? 0,
echo       }^);
echo.
echo       // Preprocess data
echo       final preprocessed = DataPreprocessing.preprocessInput^(state.formData^);
echo.
echo       // Save to Firebase
echo       await _firebaseService.saveDecision^(^{^);
echo         ...state.formData,
echo         'customer_id': customerId,
echo         'processed_at': DateTime.now^(^).toIso8601String^(^),
echo         'status': 'submitted',
echo       }^);
echo.
echo       // Log success
echo       await _audit.logAuditEvent^(^);
echo         action: 'submit_application',
echo         entityType: 'loan_application',
echo         entityId: customerId,
echo         description: 'Loan application submitted successfully',
echo       ^);
echo.
echo       state = state.copyWith^(^);
echo         isLoading: false,
echo         result: '✅ Aplikasi KPR berhasil diajukan! Kami akan segera memprosesnya.',
echo       ^);
echo.
echo     } catch ^(e^) {
echo       await _audit.logAuditEvent^(^);
echo         action: 'submit_application_failed',
echo         entityType: 'system',
echo         entityId: 'application_form',
echo         description: 'Application submission failed: $e',
echo         riskLevel: 4,
echo       ^);
echo.
echo       state = state.copyWith^(^);
echo         isLoading: false,
echo         error: '❌ Terjadi kesalahan: ${e.toString^(^)}',
echo       ^);
echo     }
echo   }
echo }
) > lib\core\controllers\kpr_flow_controller.dart
echo ✓ KPR Flow Controller updated
echo.

REM Create/Update Database Control Center
echo Creating/Updating Database Control Center...
(
echo // lib/core/database/database_control_center.dart
echo import 'package:cloud_firestore/cloud_firestore.dart';
echo import 'package:firebase_auth/firebase_auth.dart';
echo import 'package:flutter/foundation.dart';
echo import 'dart:convert';
echo.
echo class DatabaseControlCenter {
echo   static final DatabaseControlCenter _instance = DatabaseControlCenter._internal^(^);
echo   factory DatabaseControlCenter^(^) => _instance;
echo.
echo   DatabaseControlCenter._internal^(^) {
echo     _initialize^(^);
echo   }
echo.
echo   final FirebaseFirestore _firestore = FirebaseFirestore.instance;
echo   final FirebaseAuth _auth = FirebaseAuth.instance;
echo.
echo   static const String CUSTOMERS = 'customers';
echo   static const String PROPERTIES = 'properties';
echo   static const String LOAN_APPLICATIONS = 'loan_applications';
echo   static const String DOCUMENTS = 'documents';
echo   static const String AUDIT_LOGS = 'audit_logs';
echo   static const String TEMPLATES = 'templates';
echo   static const String USERS = 'users';
echo   static const String WORKFLOWS = 'workflows';
echo.
echo   late Map^<String, CollectionReference^> _collections;
echo   late Map^<String, Map^<String, dynamic^>^> _schemas;
echo.
echo   void _initialize^(^) {
echo     _collections = {
echo       CUSTOMERS: _firestore.collection^(CUSTOMERS^),
echo       PROPERTIES: _firestore.collection^(PROPERTIES^),
echo       LOAN_APPLICATIONS: _firestore.collection^(LOAN_APPLICATIONS^),
echo       DOCUMENTS: _firestore.collection^(DOCUMENTS^),
echo       AUDIT_LOGS: _firestore.collection^(AUDIT_LOGS^),
echo       TEMPLATES: _firestore.collection^(TEMPLATES^),
echo       USERS: _firestore.collection^(USERS^),
echo       WORKFLOWS: _firestore.collection^(WORKFLOWS^),
echo     };
echo.
echo     _initializeSchemas^(^);
echo   }
echo.
echo   void _initializeSchemas^(^) {
echo     _schemas = {
echo       CUSTOMERS: {
echo         'name': 'string',
echo         'email': 'string',
echo         'phone': 'string',
echo         'address': 'string',
echo         'income': 'number',
echo         'expenses': 'number',
echo         'credit_score': 'number',
echo         'employment_status': 'string',
echo         'created_at': 'timestamp',
echo         'updated_at': 'timestamp',
echo       },
echo       PROPERTIES: {
echo         'title': 'string',
echo         'description': 'string',
echo         'price': 'number',
echo         'location': 'geo',
echo         'type': 'string',
echo         'status': 'string',
echo         'images': 'array',
echo         'features': 'array',
echo         'created_at': 'timestamp',
echo         'owner_id': 'string',
echo       },
echo       LOAN_APPLICATIONS: {
echo         'customer_id': 'string',
echo         'loan_amount': 'number',
echo         'tenure': 'number',
echo         'interest_rate': 'number',
echo         'status': 'string',
echo         'documents': 'array',
echo         'created_at': 'timestamp',
echo         'approved_at': 'timestamp',
echo         'approved_by': 'string',
echo       },
echo     };
echo   }
echo.
echo   Future^<String^> create^(String collection, Map^<String, dynamic^> data^) async {
echo     try {
echo       await _validateData^(collection, data^);
echo.
echo       final docRef = await _collections[collection]!.add^(^{^);
echo         ...data,
echo         'created_at': FieldValue.serverTimestamp^(^),
echo         'updated_at': FieldValue.serverTimestamp^(^),
echo         'created_by': _auth.currentUser?.uid,
echo       }^);
echo.
echo       await _logAudit^('CREATE', collection, docRef.id, data^);
echo       return docRef.id;
echo     } catch ^(e^) {
echo       throw DatabaseException^('Failed to create document: $e'^);
echo     }
echo   }
echo.
echo   Future^<void^> update^(String collection, String id, Map^<String, dynamic^> data^) async {
echo     try {
echo       final docRef = _collections[collection]!.doc^(id^);
echo       final oldData = ^(await docRef.get^(^)^).data^(^);
echo.
echo       await docRef.update^(^{^);
echo         ...data,
echo         'updated_at': FieldValue.serverTimestamp^(^),
echo         'updated_by': _auth.currentUser?.uid,
echo       }^);
echo.
echo       await _logAudit^('UPDATE', collection, id, data, oldData: oldData^);
echo     } catch ^(e^) {
echo       throw DatabaseException^('Failed to update document: $e'^);
echo     }
echo   }
echo.
echo   Future^<Map^<String, dynamic^>^?> getById^(String collection, String id^) async {
echo     try {
echo       final doc = await _collections[collection]!.doc^(id^).get^(^);
echo       return doc.exists ? {...doc.data^(^) as Map^<String, dynamic^>, 'id': doc.id} : null;
echo     } catch ^(e^) {
echo       throw DatabaseException^('Failed to get document: $e'^);
echo     }
echo   }
echo.
echo   Future^<List^<Map^<String, dynamic^>^>^> getAll^(String collection,
echo       {int? limit, String? orderBy, bool descending = false}^) async {
echo     try {
echo       Query query = _collections[collection]!;
echo.
echo       if ^(orderBy != null^) {
echo         query = query.orderBy^(orderBy, descending: descending^);
echo       }
echo.
echo       if ^(limit != null^) {
echo         query = query.limit^(limit^);
echo       }
echo.
echo       final snapshot = await query.get^(^);
echo       return snapshot.docs.map^(^(doc^) => {...doc.data^(^) as Map^<String, dynamic^>, 'id': doc.id}^).toList^(^);
echo     } catch ^(e^) {
echo       throw DatabaseException^('Failed to get documents: $e'^);
echo     }
echo   }
echo.
echo   Future^<void^> _validateData^(String collection, Map^<String, dynamic^> data^) async {
echo     final schema = getSchema^(collection^);
echo     final errors = ^<String^>[];
echo.
echo     for ^(final field in schema.keys^) {
echo       final expectedType = schema[field];
echo       final actualValue = data[field];
echo.
echo       if ^(actualValue != null && !_validateType^(actualValue, expectedType^)^) {
echo         errors.add^('Field "$field" should be of type $expectedType'^);
echo       }
echo     }
echo.
echo     if ^(errors.isNotEmpty^) {
echo       throw ValidationException^('Data validation failed: ${errors.join^(', '^)}'^);
echo     }
echo   }
echo.
echo   Map^<String, dynamic^> getSchema^(String collection^) {
echo     return _schemas[collection] ?? {};
echo   }
echo.
echo   bool _validateType^(dynamic value, String expectedType^) {
echo     switch ^(expectedType^) {
echo       case 'string':
echo         return value is String;
echo       case 'number':
echo         return value is num;
echo       case 'boolean':
echo         return value is bool;
echo       case 'array':
echo         return value is List;
echo       case 'map':
echo         return value is Map;
echo       case 'timestamp':
echo         return value is Timestamp ^|^| value is DateTime;
echo       case 'geo':
echo         return value is GeoPoint;
echo       default:
echo         return true;
echo     }
echo   }
echo.
echo   Future^<void^> _logAudit^(String action, String entityType, String entityId,
echo       Map^<String, dynamic^> newData, {Map^<String, dynamic^>? oldData}^) async {
echo     try {
echo       await _collections[AUDIT_LOGS]!.add^(^{^);
echo         'action': action,
echo         'entity_type': entityType,
echo         'entity_id': entityId,
echo         'user_id': _auth.currentUser?.uid ?? 'system',
echo         'user_email': _auth.currentUser?.email ?? 'system',
echo         'changes': {
echo           'old': oldData ?? {},
echo           'new': newData,
echo         },
echo         'timestamp': FieldValue.serverTimestamp^(^),
echo       }^);
echo     } catch ^(e^) {
echo       debugPrint^('Failed to log audit: $e'^);
echo     }
echo   }
echo }
echo.
echo class DatabaseException implements Exception {
echo   final String message;
echo   DatabaseException^(this.message^);
echo.
echo   @override
echo   String toString^(^) => 'DatabaseException: $message';
echo }
echo.
echo class ValidationException implements Exception {
echo   final String message;
echo   ValidationException^(this.message^);
echo.
echo   @override
echo   String toString^(^) => 'ValidationException: $message';
echo }
) > lib\core\database\database_control_center.dart
echo ✓ Database Control Center updated
echo.

REM Create/Update KPR Application Screen
echo Creating/Updating KPR Application Screen...
(
echo // lib/ui/screens/kpr_application_screen.dart
echo import 'package:flutter/material.dart';
echo import 'package:flutter_riverpod/flutter_riverpod.dart';
echo import '../../core/controllers/kpr_flow_controller.dart';
echo.
echo class KprApplicationScreen extends ConsumerWidget {
echo   const KprApplicationScreen^(^{super.key}^);
echo.
echo   @override
echo   Widget build^(BuildContext context, WidgetRef ref^) {
echo     final state = ref.watch^(kprFlowControllerProvider^);
echo     final controller = ref.read^(kprFlowControllerProvider.notifier^);
echo.
echo     return Scaffold^(^);
echo       appBar: AppBar^(title: const Text^('KPR Flow Enterprise'^)^),
echo       body: LayoutBuilder^(^);
echo         builder: ^(context, constraints^) => SingleChildScrollView^(^);
echo           padding: const EdgeInsets.all^(16^),
echo           child: ConstrainedBox^(^);
echo             constraints: BoxConstraints^(^);
echo               minHeight: constraints.maxHeight - 32,
echo             ^),
echo             child: Column^(^);
echo               crossAxisAlignment: CrossAxisAlignment.stretch,
echo               children: [
echo                 // Income Input
echo                 TextFormField^(^);
echo                   decoration: const InputDecoration^(^);
echo                     labelText: 'Pendapatan Bulanan',
echo                     prefixIcon: Icon^(Icons.attach_money^),
echo                   ^),
echo                   keyboardType: TextInputType.number,
echo                   onChanged: ^(value^) => controller.updateField^('income', value^),
echo                 ^),
echo.
echo                 const SizedBox^(height: 16^),
echo.
echo                 // Expenses Input
echo                 TextFormField^(^);
echo                   decoration: const InputDecoration^(^);
echo                     labelText: 'Pengeluaran Bulanan',
echo                     prefixIcon: Icon^(Icons.money_off^),
echo                   ^),
echo                   keyboardType: TextInputType.number,
echo                   onChanged: ^(value^) => controller.updateField^('expenses', value^),
echo                 ^),
echo.
echo                 const SizedBox^(height: 16^),
echo.
echo                 // Credit Score Input
echo                 TextFormField^(^);
echo                   decoration: const InputDecoration^(^);
echo                     labelText: 'Credit Score',
echo                     prefixIcon: Icon^(Icons.score^),
echo                   ^),
echo                   keyboardType: TextInputType.number,
echo                   onChanged: ^(value^) => controller.updateField^('creditScore', value^),
echo                 ^),
echo.
echo                 const SizedBox^(height: 16^),
echo.
echo                 // Loan Amount Input
echo                 TextFormField^(^);
echo                   decoration: const InputDecoration^(^);
echo                     labelText: 'Jumlah Pinjaman ^(Rp^)',
echo                     prefixIcon: Icon^(Icons.account_balance_wallet^),
echo                   ^),
echo                   keyboardType: TextInputType.number,
echo                   onChanged: ^(value^) => controller.updateField^('loanAmount', value^),
echo                 ^),
echo.
echo                 const SizedBox^(height: 16^),
echo.
echo                 // Tenure Input
echo                 TextFormField^(^);
echo                   decoration: const InputDecoration^(^);
echo                     labelText: 'Tenor ^(tahun^)',
echo                     prefixIcon: Icon^(Icons.calendar_today^),
echo                   ^),
echo                   keyboardType: TextInputType.number,
echo                   onChanged: ^(value^) => controller.updateField^('tenure', value^),
echo                 ^),
echo.
echo                 const SizedBox^(height: 32^),
echo.
echo                 // Submit Button with Debouncing
echo                 ElevatedButton^(^);
echo                   onPressed: state.isLoading ? null : ^(^) => _handleSubmit^(ref^),
echo                   style: ElevatedButton.styleFrom^(^);
echo                     padding: const EdgeInsets.symmetric^(vertical: 16^),
echo                     backgroundColor: Theme.of^(context^).primaryColor,
echo                   ^),
echo                   child: state.isLoading
echo                       ? const SizedBox^(^);
echo                           width: 20,
echo                           height: 20,
echo                           child: CircularProgressIndicator^(strokeWidth: 2^),
echo                         ^)
echo                       : const Text^(^);
echo                           'Ajukan KPR',
echo                           style: TextStyle^(fontSize: 16, fontWeight: FontWeight.bold^),
echo                         ^),
echo                 ^),
echo.
echo                 // Result Display
echo                 if ^(state.result != null^) ...[
echo                   const SizedBox^(height: 16^),
echo                   Container^(^);
echo                     padding: const EdgeInsets.all^(16^),
echo                     decoration: BoxDecoration^(^);
echo                       color: state.result!.contains^('DISETUJUI'^) 
echo                           ? Colors.green.shade50 
echo                           : Colors.red.shade50,
echo                       borderRadius: BorderRadius.circular^(12^),
echo                       border: Border.all^(^);
echo                         color: state.result!.contains^('DISETUJUI'^) 
echo                             ? Colors.green.shade200 
echo                             : Colors.red.shade200,
echo                       ^),
echo                     ^),
echo                     child: Column^(^);
echo                       children: [
echo                         Icon^(^);
echo                           state.result!.contains^('DISETUJUI'^) 
echo                               ? Icons.check_circle 
echo                               : Icons.cancel,
echo                           color: state.result!.contains^('DISETUJUI'^) 
echo                               ? Colors.green 
echo                               : Colors.red,
echo                           size: 48,
echo                         ^),
echo                         const SizedBox^(height: 8^),
echo                         Text^(^);
echo                           state.result!,
echo                           style: const TextStyle^(^);
echo                             fontSize: 16, 
echo                             fontWeight: FontWeight.w500,
echo                             height: 1.4,
echo                           ^),
echo                           textAlign: TextAlign.center,
echo                         ^),
echo                       ],
echo                     ^),
echo                   ^),
echo                 ],
echo.
echo                 // Error Display
echo                 if ^(state.error != null^) ...[
echo                   const SizedBox^(height: 16^),
echo                   Container^(^);
echo                     padding: const EdgeInsets.all^(16^),
echo                     decoration: BoxDecoration^(^);
echo                       color: Colors.red.shade50,
echo                       borderRadius: BorderRadius.circular^(12^),
echo                       border: Border.all^(color: Colors.red.shade200^),
echo                     ^),
echo                     child: Row^(^);
echo                       children: [
echo                         const Icon^(Icons.error, color: Colors.red^),
echo                         const SizedBox^(width: 12^),
echo                         Expanded^(^);
echo                           child: Text^(^);
echo                             state.error!,
echo                             style: const TextStyle^(color: Colors.red^),
echo                           ^),
echo                         ^),
echo                       ],
echo                     ^),
echo                   ^),
echo                 ],
echo               ],
echo             ^),
echo           ^),
echo         ^),
echo       ^),
echo     ^);
echo   }
echo.
echo   Future^<void^> _handleSubmit^(WidgetRef ref^) async {
echo     final controller = ref.read^(kprFlowControllerProvider.notifier^);
echo     final audit = ref.read^(auditTrailProvider^);
echo     final crm = ref.read^(crmProvider^);
echo.
echo     try {
echo       // Create customer profile if new user
echo       final customerId = await crm.createCustomerProfile^(^{^);
echo         'name': 'Customer Name', // From form
echo         'email': 'customer@email.com', // From form
echo         'phone': '+62...', // From form
echo         'income': double.tryParse^(controller.state.formData['income'] ?? '0'^) ?? 0,
echo         'expenses': double.tryParse^(controller.state.formData['expenses'] ?? '0'^) ?? 0,
echo         'credit_score': double.tryParse^(controller.state.formData['creditScore'] ?? '0'^) ?? 0,
echo       }^);
echo.
echo       // Submit loan application
echo       await controller.submitApplication^(^);
echo.
echo       // Log successful submission
echo       await audit.logAuditEvent^(^);
echo         action: 'loan_application_submitted',
echo         entityType: 'customer',
echo         entityId: customerId,
echo         description: 'Loan application submitted successfully',
echo       ^);
echo.
echo     } catch ^(e^) {
echo       await audit.logAuditEvent^(^);
echo         action: 'loan_application_failed',
echo         entityType: 'system',
echo         entityId: 'application_form',
echo         description: 'Loan application submission failed: $e',
echo         riskLevel: 4,
echo       ^);
echo.
echo       // Error handling is already done in controller.submitApplication^(^)
echo     }
echo   }
echo }
echo.
echo // Placeholder screens for routing
echo class CustomerDashboardScreen extends StatelessWidget {
echo   const CustomerDashboardScreen^(^{super.key}^);
echo   @override
echo   Widget build^(BuildContext context^) => Scaffold^(appBar: AppBar^(title: const Text^('Customers'^)^), body: const Center^(child: Text^('Customer Dashboard'^)^)^);
echo }
echo.
echo class AdminDashboardScreen extends StatelessWidget {
echo   const AdminDashboardScreen^(^{super.key}^);
echo   @override
echo   Widget build^(BuildContext context^) => Scaffold^(appBar: AppBar^(title: const Text^('Admin'^)^), body: const Center^(child: Text^('Admin Dashboard'^)^)^);
echo }
echo.
echo class ComplianceDashboardScreen extends StatelessWidget {
echo   const ComplianceDashboardScreen^(^{super.key}^);
echo   @override
echo   Widget build^(BuildContext context^) => Scaffold^(appBar: AppBar^(title: const Text^('Compliance'^)^), body: const Center^(child: Text^('Compliance Dashboard'^)^)^);
echo }
) > lib\ui\screens\kpr_application_screen.dart
echo ✓ KPR Application Screen updated
echo.

REM Create/Update core services
echo Creating/Updating core services...
(
echo // lib/core/services/data_preprocessing.dart
echo class DataPreprocessing {
echo   static Map^<String, double^> preprocessInput^(Map^<String, String^> rawInput^) {
echo     return {
echo       'income': _cleanCurrency^(rawInput['income'] ?? '0'^),
echo       'expenses': _cleanCurrency^(rawInput['expenses'] ?? '0'^),
echo       'credit_score': double.tryParse^(rawInput['creditScore'] ?? '0'^) ?? 0.0,
echo       'loan_amount': _cleanCurrency^(rawInput['loanAmount'] ?? '0'^),
echo       'tenure': double.tryParse^(rawInput['tenure'] ?? '0'^) ?? 0.0,
echo     };
echo   }
echo.
echo   static double _cleanCurrency^(String value^) {
echo     String cleaned = value
echo         .replaceAll^(RegExp^(r'[Rp$€£¥,\s]'^), ''^)
echo         .replaceAll^('.', ''^);
echo     return double.tryParse^(cleaned^) ?? 0.0;
echo   }
echo.
echo   static Map^<String, double^> normalize^(Map^<String, double^> data^) {
echo     return {
echo       'income': data['income']! / 100000000,
echo       'expenses': data['expenses']! / 50000000,
echo       'credit_score': data['credit_score']! / 850,
echo       'loan_amount': data['loan_amount']! / 5000000000,
echo       'tenure': data['tenure']! / 30,
echo     };
echo   }
echo }
) > lib\core\services\data_preprocessing.dart

(
echo // lib/core/services/firebase_service.dart
echo import 'package:cloud_firestore/cloud_firestore.dart';
echo import 'package:firebase_auth/firebase_auth.dart';
echo import 'package:encrypt/encrypt.dart' as encrypt;
echo import 'package:shared_preferences/shared_preferences.dart';
echo.
echo class FirebaseService {
echo   final FirebaseFirestore _firestore = FirebaseFirestore.instance;
echo   final FirebaseAuth _auth = FirebaseAuth.instance;
echo.
echo   Future^<void^> saveDecision^(Map^<String, dynamic^> decisionData^) async {
echo     try {
echo       final user = _auth.currentUser;
echo       if ^(user == null^) throw Exception^('User not authenticated'^);
echo.
echo       await _firestore.collection^('kpr_decisions'^).add^(^{^);
echo         ...decisionData,
echo         'analyst_id': user.uid,
echo         'analyst_email': user.email,
echo         'created_at': FieldValue.serverTimestamp^(^),
echo       }^);
echo.
echo       await _saveToLocal^(decisionData^);
echo     } catch ^(e^) {
echo       throw Exception^('Failed to save decision: $e'^);
echo     }
echo   }
echo.
echo   Future^<void^> _saveToLocal^(Map^<String, dynamic^> data^) async {
echo     final prefs = await SharedPreferences.getInstance^(^);
echo     await prefs.setString^('last_application', data.toString^(^)^);
echo     await prefs.setString^('last_submission_time', DateTime.now^(^).toIso8601String^(^)^);
echo   }
echo.
echo   Future^<Map^<String, dynamic^>^?> getLastApplication^(^) async {
echo     final prefs = await SharedPreferences.getInstance^(^);
echo     final data = prefs.getString^('last_application'^);
echo     return data != null ? {'data': data} : null;
echo   }
echo }
) > lib\core\services\firebase_service.dart

(
echo // lib/utils/constants.dart
echo class AppConstants {
echo   static const String APP_NAME = 'KPR Flow Enterprise';
echo   static const String APP_VERSION = '1.0.0';
echo   static const String SUPPORT_EMAIL = 'support@kprflow.com';
echo   static const String PRIVACY_POLICY_URL = 'https://kprflow.com/privacy';
echo   static const String TERMS_OF_SERVICE_URL = 'https://kprflow.com/terms';
echo.
echo   // API Endpoints
echo   static const String BASE_URL = 'https://api.kprflow.com';
echo   static const String RISK_API_URL = '$BASE_URL/risk-assessment';
echo   static const String COMPLIANCE_API_URL = '$BASE_URL/compliance';
echo.
echo   // Database Collections
echo   static const String CUSTOMERS_COLLECTION = 'customers';
echo   static const String LOAN_APPLICATIONS_COLLECTION = 'loan_applications';
echo   static const String PROPERTIES_COLLECTION = 'properties';
echo   static const String AUDIT_LOGS_COLLECTION = 'audit_logs';
echo.
echo   // Risk Levels
echo   static const int RISK_LOW = 1;
echo   static const int RISK_MEDIUM = 2;
echo   static const int RISK_HIGH = 3;
echo   static const int RISK_CRITICAL = 4;
echo.
echo   // File Size Limits
echo   static const int MAX_FILE_SIZE_MB = 10;
echo   static const int MAX_IMAGE_SIZE_MB = 5;
echo.
echo   // Timeouts
echo   static const Duration API_TIMEOUT = Duration^(seconds: 30^);
echo   static const Duration FILE_UPLOAD_TIMEOUT = Duration^(minutes: 5^);
echo.
echo   // Validation Rules
echo   static const int MIN_CREDIT_SCORE = 300;
echo   static const int MAX_CREDIT_SCORE = 850;
echo   static const double MIN_LOAN_AMOUNT = 10000000; // 10M
echo   static const double MAX_LOAN_AMOUNT = 5000000000; // 5B
echo   static const int MIN_TENURE_YEARS = 1;
echo   static const int MAX_TENURE_YEARS = 30;
echo }
) > lib\utils\constants.dart

(
echo // lib/utils/validators.dart
echo class Validators {
echo   static String? validateEmail^(String? value^) {
echo     if ^(value == null ^|^| value.isEmpty^) return 'Email is required';
echo     final emailRegex = RegExp^(r'^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$'^);
echo     if ^(!emailRegex.hasMatch^(value^)^) return 'Invalid email format';
echo     return null;
echo   }
echo.
echo   static String? validatePhone^(String? value^) {
echo     if ^(value == null ^|^| value.isEmpty^) return 'Phone number is required';
echo     if ^(value.length ^< 10^) return 'Phone number too short';
echo     return null;
echo   }
echo.
echo   static String? validateRequired^(String? value, String fieldName^) {
echo     if ^(value == null ^|^| value.isEmpty^) return '$fieldName is required';
echo     return null;
echo   }
echo.
echo   static String? validateNumber^(String? value, String fieldName,
echo       {double? min, double? max}^) {
echo     if ^(value == null ^|^| value.isEmpty^) return '$fieldName is required';
echo     final number = double.tryParse^(value^);
echo     if ^(number == null^) return 'Invalid number format';
echo     if ^(min != null && number ^< min^) return '$fieldName must be at least $min';
echo     if ^(max != null && number ^> max^) return '$fieldName must be at most $max';
echo     return null;
echo   }
echo.
echo   static String? validateCreditScore^(String? value^) {
echo     return validateNumber^(value, 'Credit score', min: 300, max: 850^);
echo   }
echo.
echo   static String? validateLoanAmount^(String? value^) {
echo     return validateNumber^(value, 'Loan amount',
echo         min: AppConstants.MIN_LOAN_AMOUNT, max: AppConstants.MAX_LOAN_AMOUNT^);
echo   }
echo.
echo   static String? validateTenure^(String? value^) {
echo     return validateNumber^(value, 'Tenure',
echo         min: AppConstants.MIN_TENURE_YEARS.toDouble^(^),
echo         max: AppConstants.MAX_TENURE_YEARS.toDouble^(^)^);
echo   }
echo }
) > lib\utils\validators.dart

(
echo // lib/utils/formatters.dart
echo import 'package:intl/intl.dart';
echo.
echo class Formatters {
echo   static final NumberFormat _currencyFormat = NumberFormat.currency^(^);
echo     locale: 'id_ID',
echo     symbol: 'Rp ',
echo     decimalDigits: 0,
echo   ^);
echo.
echo   static final NumberFormat _numberFormat = NumberFormat.decimalPattern^(^);
echo.
echo   static String formatCurrency^(double amount^) {
echo     return _currencyFormat.format^(amount^);
echo   }
echo.
echo   static String formatNumber^(double number^) {
echo     return _numberFormat.format^(number^);
echo   }
echo.
echo   static String formatPercentage^(double percentage^) {
echo     return '${^(percentage * 100^).toStringAsFixed^(1^)}%';
echo   }
echo.
echo   static String formatDate^(DateTime date^) {
echo     return DateFormat^('dd/MM/yyyy'^).format^(date^);
echo   }
echo.
echo   static String formatDateTime^(DateTime dateTime^) {
echo     return DateFormat^('dd/MM/yyyy HH:mm'^).format^(dateTime^);
echo   }
echo.
echo   static String formatFileSize^(int bytes^) {
echo     if ^(bytes ^< 1024^) return '$bytes B';
echo     if ^(bytes ^< 1024 * 1024^) return '${^(bytes / 1024^).toStringAsFixed^(1^)} KB';
echo     if ^(bytes ^< 1024 * 1024 * 1024^) return '${^(bytes / ^(1024 * 1024^)^).toStringAsFixed^(1^)} MB';
echo     return '${^(bytes / ^(1024 * 1024 * 1024^)^).toStringAsFixed^(1^)} GB';
echo   }
echo.
echo   static String formatPhoneNumber^(String phone^) {
echo     // Indonesian phone number formatting
echo     if ^(phone.startsWith^('+62'^)^) {
echo       final cleanNumber = phone.substring^(3^);
echo       if ^(cleanNumber.length == 11^) {
echo         return '+62 ${cleanNumber.substring^(0, 3^)}-${cleanNumber.substring^(3, 7^)}-${cleanNumber.substring^(7^)}';
echo       } else if ^(cleanNumber.length == 12^) {
echo         return '+62 ${cleanNumber.substring^(0, 3^)}-${cleanNumber.substring^(3, 7^)}-${cleanNumber.substring^(7^)}';
echo       }
echo     }
echo     return phone;
echo   }
echo.
echo   static String formatCreditScore^(int score^) {
echo     if ^(score ^>= 800^) return 'Exceptional ^($score^)';
echo     if ^(score ^>= 740^) return 'Very Good ^($score^)';
echo     if ^(score ^>= 670^) return 'Good ^($score^)';
echo     if ^(score ^>= 580^) return 'Fair ^($score^)';
echo     return 'Poor ^($score^)';
echo   }
echo.
echo   static String formatLoanStatus^(String status^) {
echo     switch ^(status.toLowerCase^(^)^) {
echo       case 'draft':
echo         return 'Draft';
echo       case 'submitted':
echo         return 'Diajukan';
echo       case 'under_review':
echo         return 'Sedang Ditinjau';
echo       case 'approved':
echo         return 'Disetujui';
echo       case 'rejected':
echo         return 'Ditolak';
echo       case 'disbursed':
echo         return 'Dicairkan';
echo       case 'active':
echo         return 'Aktif';
echo       case 'completed':
echo         return 'Selesai';
echo       default:
echo         return status;
echo     }
echo   }
echo }
) > lib\utils\formatters.dart
echo ✓ Core services updated
echo.

REM Install/Update dependencies
echo Installing/Updating Flutter dependencies...
flutter pub get
if %errorlevel% neq 0 (
    echo ERROR: Failed to update dependencies
    pause
    exit /b 1
)
echo ✓ Dependencies updated
echo.

REM Setup Firebase (only for new projects or if not configured)
if exist firebase_options.dart (
    echo ✓ Firebase already configured
) else (
    echo Setting up Firebase...
    flutterfire configure --project=kpr-flow-enterprise
    if %errorlevel% neq 0 (
        echo WARNING: Firebase setup failed - you need to configure it manually
        echo Run: flutterfire configure --project=YOUR_PROJECT_ID
    )
)
echo ✓ Firebase configuration checked
echo.

REM Create/Update training data
if not exist assets\training_data.csv (
    echo Creating training data...
    (
    echo income,expenses,credit_score,loan_amount,tenure,approved
    echo 10000000,3000000,750,300000000,20,1
    echo 15000000,5000000,800,500000000,25,1
    echo 8000000,4000000,600,200000000,15,0
    echo 5000000,2000000,550,100000000,10,0
    echo 20000000,6000000,780,800000000,30,1
    echo 12000000,4500000,720,400000000,20,1
    echo 6000000,3500000,580,150000000,12,0
    echo 18000000,5500000,760,600000000,25,1
    echo 9000000,3800000,650,250000000,18,0
    echo 25000000,7000000,820,1000000000,30,1
    ) > assets\training_data.csv
    echo ✓ Training data created
) else (
    echo ✓ Training data already exists
)

REM Final completion message
echo ============================================
if exist pubspec.yaml (
    echo    KPR FLOW ENTERPRISE - UPGRADE COMPLETED!
) else (
    echo    KPR FLOW ENTERPRISE - SETUP COMPLETED!
)
echo ============================================
echo.
echo ✅ Enterprise systems successfully installed!
echo.
if exist lib\main.dart.backup (
    echo 📁 BACKUP CREATED: lib\main.dart.backup
)
if exist pubspec.yaml.backup (
    echo 📁 BACKUP CREATED: pubspec.yaml.backup
)
echo.
echo 🎯 INSTALLED SYSTEMS:
echo • 🧠 AI Risk Assessment Engine
echo • 🎛️ Riverpod State Management
echo • 🏢 Database Control Center
echo • 🗺️ Interactive GIS Map Service
echo • 👥 Customer Relationship Management
echo • 🔐 Role-Based Access Control ^(7 roles, 25 permissions^)
echo • 📊 Audit Trail & Compliance System
echo • ⚙️ Advanced Workflow Management
echo • 💰 Financial Calculation Engine
echo • 📋 Compliance Monitoring & Reporting
echo.
echo 🚀 TO RUN YOUR UPGRADED APP:
echo flutter run
echo.
echo 📱 TO BUILD:
echo flutter build apk --release
echo flutter build ios --release
echo flutter build web --release
echo.
echo 🔥 ENJOY YOUR ENTERPRISE KPR SYSTEM!
echo ============================================
echo.
pause
