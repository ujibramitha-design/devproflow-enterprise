/**
 * Design Tokens - Desktop Platform (Electron)
 * 
 * Desktop reuses Web implementation via Electron
 * This file re-exports Web tokens for consistency
 */

// Desktop inherits from Web implementation
// Electron can use the same Tailwind config as Web
export { default as webConfig } from '../../../05_UI_Design_System/Implementation/Web/tailwind.config.tokens';

// Also provide direct token access if needed
import tokens from '../../../05_UI_Design_System/Shared/Design_Tokens.json';

export const DesignTokens = tokens;

/**
 * Usage in Electron:
 * 
 * 1. For Renderer Process (Web-based UI):
 *    - Use Tailwind classes directly (same as Web)
 *    - Import webConfig for Tailwind configuration
 * 
 * 2. For Main Process (Node.js):
 *    - Import DesignTokens for direct access
 *    - Use for window configuration, tray icons, etc.
 * 
 * Example (Main Process):
 * import { DesignTokens } from './theme/tokens';
 * 
 * const mainWindow = new BrowserWindow({
 *   backgroundColor: DesignTokens.colors.light.background.value,
 *   width: 1280,
 *   height: 800,
 * });
 */

export default {
  webConfig,
  DesignTokens,
};
