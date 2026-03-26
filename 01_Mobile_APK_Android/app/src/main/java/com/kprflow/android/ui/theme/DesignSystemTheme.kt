package com.kprflow.android.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.ColorScheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

// Design System Colors from 05_UI_Design_System
object DesignSystemColors {
    // Primary Colors
    val primary = Color(0xFF2563EB)            // Blue-600
    val primaryVariant = Color(0xFF1D4ED8)       // Blue-700
    val onPrimary = Color(0xFFFFFFFF)            // White
    
    // Secondary Colors
    val secondary = Color(0xFF10B981)           // Emerald-600
    val secondaryVariant = Color(0xFF059669)     // Emerald-700
    val onSecondary = Color(0xFFFFFFFF)          // White
    
    // Background Colors
    val background = Color(0xFFFAFAFA)          // Gray-50
    val onBackground = Color(0xFF111827)        // Gray-900
    val surface = Color(0xFFFFFFFF)             // White
    val onSurface = Color(0xFF111827)           // Gray-900
    
    // Border Colors
    val border = Color(0xFFE5E7EB)              // Gray-200
    val input = Color(0xFFFFFFFF)               // White
    val ring = Color(0xFF2563EB)                 // Primary
    
    // Muted Colors
    val muted = Color(0xFFF3F4F6)                // Gray-100
    val onMuted = Color(0xFF6B7280)              // Gray-500
    
    // Accent Colors
    val accent = Color(0xFFF3F4F6)               // Gray-100
    val onAccent = Color(0xFF111827)             // Gray-900
    
    // Destructive Colors
    val destructive = Color(0xFFEF4444)          // Red-500
    val destructiveForeground = Color(0xFFFFFFFF) // White
    
    // Status Colors
    val status = StatusColors
    
    // SLA Colors
    val sla = SLAColors
    
    // Dark Mode Colors
    val dark = DarkColors
}

object StatusColors {
    val pending = Color(0xFFF59E0B)              // Amber-500
    val inProgress = Color(0xFF3B82F6)           // Blue-500
    val completed = Color(0xFF10B981)           // Emerald-500
    val failed = Color(0xFFEF4444)              // Red-500
    val cancelled = Color(0xFF6B7280)           // Gray-500
}

object SLAColors {
    val onTrack = Color(0xFF10B981)             // Emerald-500
    val warning = Color(0xFFF59E0B)               // Amber-500
    val overdue = Color(0xFFEF4444)              // Red-500
    val critical = Color(0xFFDC2626)            // Red-600
}

object DarkColors {
    val background = Color(0xFF111827)          // Gray-900
    val foreground = Color(0xFFFAFAFA)          // Gray-50
    val surface = Color(0xFF1F2937)             // Gray-800
    val card = Color(0xFF1F2937)                // Gray-800
    val border = Color(0xFF374151)              // Gray-700
    val input = Color(0xFF1F2937)               // Gray-800
    val muted = Color(0xFF374151)               // Gray-700
    val accent = Color(0xFF374151)             // Gray-700
}

// Design System Typography
object DesignSystemTypography {
    const val h1FontSize = 32
    const val h2FontSize = 24
    const val h3FontSize = 20
    const val h4FontSize = 18
    const val h5FontSize = 16
    const val h6FontSize = 14
    
    const val body1FontSize = 16
    const val body2FontSize = 14
    const val body3FontSize = 12
    
    const val caption1FontSize = 12
    const val caption2FontSize = 11
    const val caption3FontSize = 10
    
    const val buttonFontSize = 14
    const val buttonLargeFontSize = 16
    const val buttonSmallFontSize = 12
    
    const val labelFontSize = 12
    const val inputFontSize = 16
}

// Design System Spacing
object DesignSystemSpacing {
    const val unit = 8
    
    const val xs = 4
    const val sm = 8
    const val md = 16
    const val lg = 24
    val val xl = 32
    const val xxl = 48
    const val xxxl = 64
    
    // Component spacing
    const val componentPaddingXs = 8
    const val componentPaddingSm = 12
    const val componentPaddingMd = 16
    const val componentPaddingLg = 20
    const val componentPaddingXl = 24
    
    // Touch targets
    const val touchTargetMin = 44
    const val touchTargetComfortable = 48
    const val touchTargetLarge = 56
    
    // Border radius
    const val borderRadiusNone = 0
    const val borderRadiusXs = 2
    const val borderRadiusSm = 4
    const val borderRadiusMd = 6
    const val borderRadiusLg = 8
    const val borderRadiusXl = 12
    const val borderRadiusXxl = 16
    const val borderRadiusFull = 9999
}

// Light Color Scheme
private val LightColorScheme = lightColorScheme(
    primary = DesignSystemColors.primary,
    onPrimary = DesignSystemColors.onPrimary,
    primaryContainer = DesignSystemColors.primary,
    onPrimaryContainer = DesignSystemColors.onPrimary,
    
    secondary = DesignSystemColors.secondary,
    onSecondary = DesignSystemColors.onSecondary,
    secondaryContainer = DesignSystemColors.secondary,
    onSecondaryContainer = DesignSystemColors.onSecondary,
    
    tertiary = DesignSystemColors.accent,
    onTertiary = DesignSystemColors.onAccent,
    
    background = DesignSystemColors.background,
    onBackground = DesignSystemColors.onBackground,
    
    surface = DesignSystemColors.surface,
    onSurface = DesignSystemColors.onSurface,
    
    error = DesignSystemColors.destructive,
    onError = DesignSystemColors.destructiveForeground,
    
    outline = DesignSystemColors.border,
    outlineVariant = DesignSystemColors.border,
    
    surfaceVariant = DesignSystemColors.muted,
    onSurfaceVariant = DesignSystemColors.onMuted,
    
    inverseSurface = DesignSystemColors.dark.background,
    inverseOnSurface = DesignSystemColors.dark.foreground,
    
    surfaceTint = DesignSystemColors.primary,
    scrim = Color(0xFF000000)
)

// Dark Color Scheme
private val DarkColorScheme = darkColorScheme(
    primary = DesignSystemColors.primary,
    onPrimary = DesignSystemColors.onPrimary,
    primaryContainer = DesignSystemColors.primaryVariant,
    onPrimaryContainer = DesignSystemColors.onPrimary,
    
    secondary = DesignSystemColors.secondary,
    onSecondary = DesignSystemColors.onSecondary,
    secondaryContainer = DesignSystemColors.secondaryVariant,
    onSecondaryContainer = DesignSystemColors.onSecondary,
    
    tertiary = DesignSystemColors.accent,
    onTertiary = DesignSystemColors.onAccent,
    
    background = DesignSystemColors.dark.background,
    onBackground = DesignSystemColors.dark.foreground,
    
    surface = DesignSystemColors.dark.surface,
    onSurface = DesignSystemColors.dark.foreground,
    
    error = DesignSystemColors.destructive,
    onError = DesignSystemColors.destructiveForeground,
    
    outline = DesignSystemColors.dark.border,
    outlineVariant = DesignSystemColors.dark.border,
    
    surfaceVariant = DesignSystemColors.dark.muted,
    onSurfaceVariant = DesignSystemColors.onMuted,
    
    inverseSurface = DesignSystemColors.background,
    inverseOnSurface = DesignSystemColors.onBackground,
    
    surfaceTint = DesignSystemColors.primary,
    scrim = Color(0xFF000000)
)

@Composable
fun KPRFlowTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) {
        DarkColorScheme
    } else {
        LightColorScheme
    }
    
    androidx.compose.material3.MaterialTheme(
        colorScheme = colorScheme,
        typography = androidx.compose.material3.Typography(),
        content = content
    )
}

// Design System Color Extensions
fun ColorScheme.getStatusColor(status: String): Color {
    return when (status) {
        "pending" -> StatusColors.pending
        "in_progress" -> StatusColors.inProgress
        "completed" -> StatusColors.completed
        "failed" -> StatusColors.failed
        "cancelled" -> StatusColors.cancelled
        else -> StatusColors.pending
    }
}

fun ColorScheme.getSLAColor(slaStatus: String): Color {
    return when (slaStatus) {
        "on_track" -> SLAColors.onTrack
        "warning" -> SLAColors.warning
        "overdue" -> SLAColors.overdue
        "critical" -> SLAColors.critical
        else -> SLAColors.warning
    }
}
