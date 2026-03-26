package com.kprflow.android.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.kprflow.android.shared.ApplicationController
import com.kprflow.android.shared.ApplicationData
import com.kprflow.android.shared.ApplicationListResponse
import com.kprflow.android.ui.theme.DesignSystemTheme
import com.kprflow.android.ui.theme.DesignSystemButton
import com.kprflow.android.ui.theme.DesignSystemCard
import com.kprflow.android.ui.theme.DesignSystemColors
import com.kprflow.android.ui.theme.DesignSystemTypography
import com.kprflow.android.ui.theme.DesignSystemSpacing

@Composable
fun HomeScreen(
    onNavigateToApplications: () -> Unit = {},
    onNavigateToCustomers: () -> Unit = {},
    onNavigateToReports: () -> Unit = {},
    onNavigateToSettings: () -> Unit = {}
) {
    val applicationController = ApplicationController.getInstance()
    var applications by remember { mutableStateOf<List<ApplicationData>>(emptyList()) }
    var isLoading by remember { mutableStateOf(false) }
    var refreshing by remember { mutableStateOf(false) }
    var errorMessage by remember { mutableStateOf<String?>(null) }
    
    // Load applications on launch
    LaunchedEffect {
        loadApplications()
    }
    
    // Real-time updates
    LaunchedEffect {
        applicationController.observeApplicationUpdates()
            .collect { application ->
                applications = applications.map { if (it.id == application.id) application else it }
            }
    }
    
    // Load applications
    suspend fun loadApplications() {
        isLoading = true
        errorMessage = null
        
        try {
            val result = applicationController.getAllApplications()
            if (result.success) {
                applications = result.data
            } else {
                errorMessage = result.error
            }
        } catch (e: Exception) {
            errorMessage = "Error loading applications: ${e.message}"
        } finally {
            isLoading = false
        }
    }
    
    // Refresh function
    suspend fun refreshApplications() {
        refreshing = true
        loadApplications()
        refreshing = false
    }
    
    // Calculate statistics
    val stats = remember(applications) {
        calculateApplicationStats(applications)
    }
    
    DesignSystemTheme {
        Scaffold(
            topBar = {
                TopAppBar(
                    title = {
                        Text(
                            text = "KPRFlow Enterprise",
                            fontSize = DesignSystemTypography.h1FontSize.sp,
                            fontWeight = FontWeight.Bold,
                            color = DesignSystemColors.onPrimary
                        )
                    },
                    colors = TopAppBarDefaults.topAppBarColors(
                        containerColor = DesignSystemColors.primary
                    )
                )
            }
        ) { padding ->
            if (errorMessage != null) {
                DesignSystemCard(
                    variant = DesignSystemCardVariant.Destructive,
                    padding = DesignSystemCardPadding.Medium
                ) {
                    Text(
                        text = "Error: $errorMessage",
                        color = DesignSystemColors.destructiveForeground,
                        modifier = Modifier.fillMaxWidth()
                    )
                    
                    Spacer(modifier = Modifier.height(DesignSystemSpacing.sm.dp))
                    
                    DesignSystemButton(
                        text = "Retry",
                        onClick = { loadApplications() },
                        variant = DesignSystemButtonVariant.Outline
                    )
                }
            }
            
            if (isLoading && applications.isEmpty()) {
                Column(
                    modifier = Modifier
                        .fillMaxSize(),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    CircularProgressIndicator(
                        modifier = Modifier.size(48.dp),
                        color = DesignSystemColors.primary
                    )
                    Spacer(modifier = Modifier.height(DesignSystemSpacing.md.dp))
                    Text(
                        text = "Loading applications...",
                        fontSize = DesignSystemTypography.body2FontSize.sp,
                        color = DesignSystemColors.onBackground
                    )
                }
            }
            
            // Stats Section
            if (applications.isNotEmpty()) {
                StatsSection(stats = stats)
                
                Spacer(modifier = Modifier.height(DesignSystemSpacing.lg.dp))
            }
            
            // Quick Actions Section
            QuickActionsSection(
                onNavigateToApplications = onNavigateToApplications,
                onNavigateToCustomers = onNavigateToCustomers,
                onNavigateToReports = onNavigateToReports,
                onNavigateToSettings = onNavigateToSettings
            )
            
            Spacer(modifier = Modifier.height(DesignSystemSpacing.lg.dp))
            
            // Recent Applications Section
            RecentApplicationsSection(
                applications = applications,
                onRefresh = { refreshApplications() },
                refreshing = refreshing
            )
        }
    }
}

@Composable
private fun StatsSection(stats: ApplicationStats) {
    Row(
        modifier = Modifier
            .fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(DesignSystemSpacing.sm.dp)
    ) {
        DesignSystemCard(
            variant = DesignSystemCardVariant.Primary,
            padding = DesignSystemCardPadding.Medium,
            modifier = Modifier
                .weight(1f)
        ) {
            Text(
                text = "Total Applications",
                fontSize = DesignSystemTypography.caption1FontSize.sp,
                color = DesignSystemColors.onPrimary,
                textAlign = TextAlign.Center,
                modifier = Modifier.fillMaxWidth()
            )
            Spacer(modifier = Modifier.height(DesignSystemSpacing.xs.dp))
            Text(
                text = "${stats.total}",
                fontSize = DesignSystemTypography.h2FontSize.sp,
                fontWeight = FontWeight.Bold,
                color = DesignSystemColors.onPrimary,
                textAlign = TextAlign.Center,
                modifier = Modifier.fillMaxWidth()
            )
        }
        
        DesignSystemCard(
            variant = DesignSystemCardVariant.Secondary,
            padding = DesignSystemCardPadding.Medium,
            modifier =
                .weight(1f)
        ) {
            Text(
                text = "Pending",
                fontSize = DesignSystemTypography.caption1FontSize.sp,
                color = DesignSystemColors.onSecondary,
                textAlign = TextAlign.Center,
                modifier = Modifier.fillMaxWidth()
            )
            Spacer(modifier = Modifier.height(DesignSystem.xs.dp))
            Text(
                text = "${stats.pending}",
                fontSize = DesignSystemTypography.h2FontSize.sp,
                fontWeight = FontWeight.Bold,
                color = DesignSystemColors.onSecondary,
                textAlign = TextAlign.Center,
                modifier = Modifier.fillMaxWidth()
            )
        }
        
        DesignSystemCard(
            variant = DesignSystemCardVariant.Outline,
            padding = DesignSystemCardPadding.Medium,
            modifier = Modifier
                .weight(1f)
        ) {
            Text(
                text = "Approved",
                fontSize = DesignSystemTypography.caption1FontSize.sp,
                color = DesignSystemColors.onBackground,
                textAlign = TextAlign.Center,
                modifier = Modifier.fillMaxWidth()
            )
            Spacer(modifier = Modifier.height(DesignSystem.xs.dp))
            Text(
                text = "${stats.approved}",
                fontSize = DesignSystemTypography.h2FontSize.sp,
                fontWeight = FontWeight.Bold,
                color = DesignSystemColors.onBackground,
                textAlign = TextAlign.Center,
                modifier = Modifier.fillMaxWidth()
            )
        }
    }
    
    Row(
        modifier = Modifier
            .fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(DesignSystemSpacing.sm.dp)
    ) {
        DesignSystemCard(
            variant = DesignSystemCardVariant.Outline,
            padding = DesignSystemCardPadding.Medium,
            modifier = Modifier
                .weight(1f)
        ) {
            Text(
                text = "Rejected",
                fontSize = DesignSystemTypography.caption1FontSize.sp,
                color = DesignSystemColors.onBackground,
                textAlign = TextAlign = Center,
                modifier = Modifier.fillMaxWidth()
            )
            Spacer(modifier = Modifier.height(DesignSystem.xs.dp))
            Text(
                text = "${stats.rejected}",
                fontSize = DesignSystemTypography.h2FontSize.sp,
                fontWeight = FontWeight.Bold,
                color = DesignSystemColors.onBackground,
                textAlign = TextAlign.Center,
                modifier = Modifier.fillMaxWidth()
            )
        }
        
        DesignSystemCard(
            variant = DesignSystemCardVariant.Outline,
            padding = DesignSystemCardPadding.Medium,
            modifier = Modifier
                .weight(1f)
        ) {
            Text(
                text = "Completed",
                fontSize = DesignSystemTypography.caption1FontSize.sp,
                color = DesignSystemColors.onBackground,
                textAlign = Center,
                modifier = Modifier.fillMaxWidth()
            )
            Spacer(modifier = Modifier.height(DesignSystem.xs.dp))
            Text(
                text = "${stats.completed}",
                fontSize = DesignSystemTypography.h2FontSize.sp,
                fontWeight = FontWeight.Bold,
                color = DesignSystemColors.onBackground,
                textAlign = Center,
                modifier = Modifier.fillMaxWidth()
            )
        }
    }
}

@Composable
private fun QuickActionsSection(
    onNavigateToApplications: () -> Unit,
    onNavigateToCustomers: () -> Unit,
    onNavigateToReports: () -> Unit,
    onNavigateToSettings: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
    ) {
        Text(
            text = "Quick Actions",
            fontSize = DesignSystemTypography.h3FontSize.sp,
            fontWeight = FontWeight.Bold,
            color = DesignSystemColors.onBackground,
            modifier = Modifier
                .padding(horizontal = DesignSystemSpacing.md.dp)
        )
        
        Spacer(modifier = Modifier.height(DesignSystemSpacing.sm.dp))
        
        Row(
            modifier = Modifier
                .fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(DesignSystemSpacing.sm.dp)
        ) {
            DesignSystemButton(
                text = "Applications",
                onClick = onNavigateToApplications,
                size = DesignSystemButtonSize.Medium,
                modifier = Modifier
                    .weight(1f)
            )
            
            DesignSystemButton(
                text = "Customers",
                onClick = onNavigateToCustomers,
                size = DesignSystemButtonSize.Medium,
                variant = DesignSystemButtonVariant.Secondary,
                modifier = Modifier
                    .weight(1f)
            )
        }
        
        Row(
            modifier = Modifier
                .fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(DesignSystemSpacing.sm.dp)
        ) {
            DesignSystemButton(
                text = "Reports",
                onClick = onNavigateToReports,
                size = DesignSystemButtonSize.Medium,
                variant = DesignSystemButtonVariant.Outline,
                modifier = Modifier
                    .weight(1f)
            )
            
            DesignSystemButton(
                text = "Settings",
                onClick = onNavigateToSettings,
                size = DesignSystemButtonSize.Medium,
                variant = DesignSystemButtonVariant.Ghost,
                modifier = 
                    .weight(1f)
            )
        }
    }
}

@Composable
private fun RecentApplicationsSection(
    applications: List<ApplicationData>,
    onRefresh: () -> Unit,
    refreshing: Boolean
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
    ) {
        Text(
            text = "Recent Applications",
            fontSize = DesignSystemTypography.h3FontSize.sp,
            fontWeight = FontWeight.Bold,
            color = DesignSystemColors.onBackground,
            modifier = Modifier
                .padding(horizontal = DesignSystemSpacing.md.dp)
        )
        
        Spacer(modifier = Modifier.height(DesignSystemSpacing.sm.dp))
        
        LazyColumn(
            modifier = Modifier
                .fillMaxWidth(),
            verticalArrangement = Arrangement.spacedBy(DesignSystemSpacing.md.dp)
        ) {
            items(applications.take(10)) { application ->
                ApplicationCard(
                    application = application,
                    onClick = { /* Navigate to details */ }
                )
            }
            
            if (applications.size > 10) {
                item {
                    DesignSystemButton(
                        text = "View All Applications",
                        onClick = { /* Navigate to applications list */ },
                        modifier = Modifier
                            .fillMaxWidth()
                    )
                }
            }
        }
    }
}

@Composable
private fun ApplicationCard(
    application: ApplicationData,
    onClick: () -> Unit
) {
    DesignSystemCard(
        variant = DesignSystemCardVariant.Elevated,
        padding = DesignSystemCardPadding.Medium,
        onClick = onClick,
        modifier = Modifier
            .fillMaxWidth()
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
        ) {
            // Header
            Row(
                modifier = Modifier
                    .fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.Top
            ) {
                Column(
                    modifier = Modifier
                        .weight(1f)
                ) {
                    Text(
                        text = application.customerName,
                        fontSize = DesignSystemTypography.h5FontSize.sp,
                        fontWeight = FontWeight.Bold,
                        color = DesignSystemColors.onSurface,
                        modifier = Modifier
                            .fillMaxWidth()
                    )
                    
                    Text(
                        text = "${application.unitBlock}-${application.unitNumber}",
                        fontSize = DesignSystemTypography.body2FontSize.sp,
                        color = DesignSystemColors.onSurface,
                        modifier = Modifier
                            .fillMaxWidth()
                    )
                }
                
                Column(
                    horizontalAlignment = Alignment.End
                ) {
                    Text(
                        text = application.status,
                        fontSize = DesignSystemTypography.caption1FontSize.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = getStatusColor(application.status),
                        textAlign = TextAlign.End
                    )
                    
                    Text(
                        text = "Day ${application.aging_days}",
                        fontSize = DesignSystemTypography.caption2FontSize.sp,
                        color = DesignSystemColors.muted,
                        textAlign = End
                    )
                }
            }
            
            Spacer(modifier = Modifier.height(DesignSystemSpacing.sm.dp))
            
            // Details
            Column(
                verticalArrangement = Arrangement.spacedBy(DesignSystemSpacing.xs.dp)
            ) {
                if (application.bankId != null) {
                    Text(
                        text = "Bank: ${application.bankId}",
                        fontSize = DesignSystemTypography.body2FontSize.sp,
                        color = DesignSystemColors.onSurface
                    )
                }
                
                if (application.notes != null) {
                    Text(
                        text = "Notes: ${application.notes}",
                        fontSize = DesignSystemTypography.body2FontSize.sp,
                        color = DesignSystemColors.onSurface
                    )
                }
                
                Text(
                    text = "Created: ${formatDate(application.created_at)}",
                    fontSize = DesignSystemTypography.body2FontSize.sp,
                    color = DesignSystemColors.muted
                )
                
                Text(
                    text = "SLA Status: ${application.sla_status}",
                    fontSize = DesignSystemTypography.body2FontSize.sp,
                    color = getSLAColor(application.sla_status)
                )
            }
        }
    }
}

// Helper functions
private fun calculateApplicationStats(applications: List<ApplicationData>): ApplicationStats {
    val statusCounts = applications.groupBy { it.status }
    
    return ApplicationStats(
        total = applications.size,
        pending = statusCounts["PENDING"]?.size ?: 0,
        approved = statusCounts["APPROVED"]?.size ?: 0,
        rejected = statusCounts["REJECTED"]?.size ?: 0,
        completed = statusCounts["COMPLETED"]?.size ?: 0
    )
}

private fun getStatusColor(status: String): Color {
    return when (status) {
        "PENDING" -> DesignSystemColors.status.pending
        "DOCUMENT_COLLECTION" -> DesignSystemColors.status.inProgress
        "BANK_SUBMISSION" -> DesignSystemColors.status.inProgress
        "BANK_VERIFICATION" -> DesignSystemColors.status.inProgress
        "BANK_APPROVAL" -> DesignSystemColors.status.inProgress
        "APPROVED" -> DesignSystemColors.status.completed
        "COMPLETED" -> DesignSystemColors.status.completed
        "BAST_COMPLETED" -> DesignSystemColors.status.completed
        "REJECTED" -> DesignSystemColors.status.failed
        "CANCELLED" -> DesignSystemColors.status.cancelled
        else -> DesignSystemColors.status.pending
    }
}

private fun getSLAColor(slaStatus: String): Color {
    return when (slaStatus) {
        "on_track" -> DesignSystemColors.sla.onTrack
        "warning" -> DesignSystemColors.sla.warning
        "overdue" -> DesignSystemColors.sla.overdue
        "critical" -> DesignSystemCards.status.critical
        else -> DesignSystemColors.sla.warning
    }
}

private fun formatDate(dateString: String): String {
    return try {
        val instant = java.time.Instant.parse(dateString)
        val formatter = java.time.format.DateTimeFormatter.ofPattern("dd MMM yyyy")
        formatter.format(instant)
    } catch (e: Exception) {
        dateString
    }
}

// Data classes
data class ApplicationStats(
    val total: Int,
    val pending: Int,
    val approved: Int,
    val rejected: Int,
    val completed: Int
)
