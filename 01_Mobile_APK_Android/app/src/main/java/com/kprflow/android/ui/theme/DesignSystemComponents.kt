package com.kprflow.android.ui.theme

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Shape
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

// Design System Button - From 05_UI_Design_System
@Composable
fun DesignSystemButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    variant: DesignSystemButtonVariant = DesignSystemButtonVariant.Primary,
    size: DesignSystemButtonSize = DesignSystemButtonSize.Medium,
    enabled: Boolean = true,
    loading: Boolean = false,
    icon: @Composable (() -> Unit)? = null
) {
    val buttonModifier = modifier
        .then(getButtonSizeModifier(size))
        .then(getButtonVariantModifier(variant))
        .shadow(
            elevation = if (variant == DesignSystemButtonVariant.Primary) 4.dp else 0.dp,
            shape = RoundedCornerShape(DesignSystemSpacing.borderRadiusMd)
        )
        .clip(RoundedCornerShape(DesignSystemSpacing.borderRadiusMd))
        .background(
            color = if (enabled) {
                getButtonBackgroundColor(variant)
            } else {
                DesignSystemColors.muted
            }
        )
        .border(
            width = if (variant == DesignSystemButtonVariant.Outline) 2.dp else 0.dp,
            color = if (enabled) {
                DesignSystemColors.primary
            } else {
                DesignSystemColors.border
            }
        )
    
    Button(
        onClick = onClick,
        modifier = buttonModifier,
        enabled = enabled && !loading,
        colors = ButtonDefaults.buttonColors(
            containerColor = Color.Transparent,
            contentColor = Color.Transparent
        ),
        elevation = ButtonDefaults.buttonElevation(0.dp)
    ) {
        if (loading) {
            CircularProgressIndicator(
                modifier = Modifier.size(16.dp),
                color = getButtonContentColor(variant)
            )
        } else {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.Center
            ) {
                icon?.invoke()
                if (icon != null) {
                    Spacer(modifier = Modifier.width(DesignSystemSpacing.xs.dp))
                }
                Text(
                    text = text,
                    fontSize = getButtonFontSize(size),
                    fontWeight = FontWeight.SemiBold,
                    color = getButtonContentColor(variant),
                    textAlign = TextAlign.Center
                )
            }
        }
    }
}

// Design System Card - From 05_UI_Design_System
@Composable
fun DesignSystemCard(
    modifier: Modifier = Modifier,
    variant: DesignSystemCardVariant = DesignSystemCardVariant.Elevated,
    padding: DesignSystemCardPadding = DesignSystemCardPadding.Medium,
    onClick: (() -> Unit)? = null,
    content: @Composable ColumnScope.() -> Unit
) {
    val cardModifier = modifier
        .then(getCardPaddingModifier(padding))
        .shadow(
            elevation = if (variant == DesignSystemCardVariant.Elevated) 4.dp else 0.dp,
            shape = RoundedCornerShape(DesignSystemSpacing.borderRadiusLg)
        )
        .clip(RoundedCornerShape(DesignSystemSpacing.borderRadiusLg))
        .background(
            color = when (variant) {
                DesignSystemCardVariant.Primary -> DesignSystemColors.primary
                DesignSystemCardVariant.Secondary -> DesignSystemColors.secondary
                DesignSystemCardVariant.Outline -> Color.Transparent
                DesignSystemCardVariant.Elevated -> DesignSystemColors.surface
            }
        )
        .then(
            if (variant == DesignSystemCardVariant.Outline) {
                Modifier.border(
                    width = 2.dp,
                    color = DesignSystemColors.border
                )
            } else {
                Modifier
            }
        )
    
    if (onClick != null) {
        androidx.compose.foundation.layout.Box(
            modifier = cardModifier
        ) {
            Column(
                content = content
            )
        }
    } else {
        Column(
            modifier = cardModifier,
            content = content
        )
    }
}

// Design System Input Field
@Composable
fun DesignSystemInput(
    value: String,
    onValueChange: (String) -> Unit,
    modifier: Modifier = Modifier,
    label: String? = null,
    placeholder: String = "",
    keyboardType: KeyboardType = KeyboardType.Text,
    isError: Boolean = false,
    errorMessage: String? = null,
    leadingIcon: @Composable (() -> Unit)? = null,
    trailingIcon: @Composable (() -> Unit)? = null,
    singleLine: Boolean = true,
    maxLines: Int = 1
) {
    Column(modifier = modifier) {
        label?.let {
            Text(
                text = it,
                fontSize = DesignSystemTypography.labelFontSize.sp,
                fontWeight = FontWeight.Medium,
                color = DesignSystemColors.onBackground,
                modifier = Modifier.padding(bottom = DesignSystemSpacing.xs.dp)
            )
        }
        
        OutlinedTextField(
            value = value,
            onValueChange = onValueChange,
            label = null,
            placeholder = { Text(placeholder) },
            keyboardOptions = KeyboardOptions(keyboardType = keyboardType),
            singleLine = singleLine,
            maxLines = maxLines,
            isError = isError,
            leadingIcon = leadingIcon,
            trailingIcon = trailingIcon,
            modifier = Modifier
                .fillMaxWidth()
                .background(
                    color = DesignSystemColors.surface,
                    shape = RoundedCornerShape(DesignSystemSpacing.borderRadiusMd)
                )
                .border(
                    width = 1.dp,
                    color = if (isError) {
                        DesignSystemColors.destructive
                    } else {
                        DesignSystemColors.border
                    },
                    shape = RoundedCornerShape(DesignSystemSpacing.borderRadiusMd)
                ),
            colors = OutlinedTextFieldDefaults.colors(
                unfocusedContainerColor = Color.Transparent,
                focusedContainerColor = Color.Transparent,
                unfocusedBorderColor = Color.Transparent,
                focusedBorderColor = Color.Transparent,
                unfocusedTextColor = DesignSystemColors.onBackground,
                focusedTextColor = DesignSystemColors.onBackground,
                cursorColor = DesignSystemColors.primary,
                errorBorderColor = DesignSystemColors.destructive,
                errorTextColor = DesignSystemColors.destructive
            )
        )
        
        errorMessage?.let {
            if (isError) {
                Text(
                    text = it,
                    fontSize = DesignSystemTypography.caption2FontSize.sp,
                    color = DesignSystemColors.destructive,
                    modifier = Modifier.padding(top = DesignSystemSpacing.xs.dp)
                )
            }
        }
    }
}

// Button Variants
enum class DesignSystemButtonVariant {
    Primary,
    Secondary,
    Outline,
    Ghost,
    Destructive
}

// Button Sizes
enum class DesignSystemButtonSize {
    Small,
    Medium,
    Large
}

// Card Variants
enum class DesignSystemCardVariant {
    Primary,
    Secondary,
    Outline,
    Elevated
}

// Card Padding
enum class DesignSystemCardPadding {
    Small,
    Medium,
    Large,
    ExtraLarge
}

// Helper functions
private fun getButtonBackgroundColor(variant: DesignSystemButtonVariant): Color {
    return when (variant) {
        DesignSystemButtonVariant.Primary -> DesignSystemColors.primary
        DesignSystemButtonVariant.Secondary -> DesignSystemColors.secondary
        DesignSystemButtonVariant.Outline -> Color.Transparent
        DesignSystemButtonVariant.Ghost -> DesignSystemColors.muted
        DesignSystemButtonVariant.Destructive -> DesignSystemColors.destructive
    }
}

private fun getButtonContentColor(variant: DesignSystemButtonVariant): Color {
    return when (variant) {
        DesignSystemButtonVariant.Primary -> DesignSystemColors.onPrimary
        DesignSystemButtonVariant.Secondary -> DesignSystemColors.onSecondary
        DesignSystemButtonVariant.Outline -> DesignSystemColors.primary
        DesignSystemButtonVariant.Ghost -> DesignSystemColors.onBackground
        DesignSystemButtonVariant.Destructive -> DesignSystemColors.destructiveForeground
    }
}

private fun getButtonSizeModifier(size: DesignSystemButtonSize): Modifier {
    return when (size) {
        DesignSystemButtonSize.Small -> Modifier.height(DesignSystemSpacing.touchTargetMin.dp)
        DesignSystemButtonSize.Medium -> Modifier.height(DesignSystemSpacing.touchTargetComfortable.dp)
        DesignSystemButtonSize.Large -> Modifier.height(DesignSystemSpacing.touchTargetLarge.dp)
    }
}

private fun getButtonVariantModifier(variant: DesignSystemButtonVariant): Modifier {
    return when (variant) {
        DesignSystemButtonVariant.Primary -> Modifier
        DesignSystemButtonVariant.Secondary -> Modifier
        DesignSystemButtonVariant.Outline -> Modifier
        DesignSystemButtonVariant.Ghost -> Modifier
        DesignSystemButtonVariant.Destructive -> Modifier
    }
}

private fun getButtonFontSize(size: DesignSystemButtonSize): Int {
    return when (size) {
        DesignSystemButtonSize.Small -> DesignSystemTypography.buttonSmallFontSize
        DesignSystemButtonSize.Medium -> DesignSystemTypography.buttonFontSize
        DesignSystemButtonSize.Large -> DesignSystemTypography.buttonLargeFontSize
    }
}

private fun getCardPaddingModifier(padding: DesignSystemCardPadding): Modifier {
    return when (padding) {
        DesignSystemCardPadding.Small -> Modifier.padding(DesignSystemSpacing.sm.dp)
        DesignSystemCardPadding.Medium -> Modifier.padding(DesignSystemSpacing.md.dp)
        DesignSystemCardPadding.Large -> Modifier.padding(DesignSystemSpacing.lg.dp)
        DesignSystemCardPadding.ExtraLarge -> Modifier.padding(DesignSystemSpacing.xl.dp)
    }
}
