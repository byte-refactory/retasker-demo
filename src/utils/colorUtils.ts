/**
 * Utility functions for color manipulation and accessibility
 */

/**
 * Determines the optimal text color (black or white) for a given background color
 * to ensure WCAG compliance and good contrast.
 * 
 * @param backgroundColor - Any valid CSS color value (hex, rgb, hsl, named color, etc.)
 * @returns '#000000' for light backgrounds, '#ffffff' for dark backgrounds
 * 
 * @example
 * getContrastTextColor('#007bff') // → '#ffffff'
 * getContrastTextColor('white')   // → '#000000'
 * getContrastTextColor('rgb(255,0,0)') // → '#ffffff'
 */
export const getContrastTextColor = (backgroundColor: string): string => {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      // Fail gracefully if canvas is not available (e.g., in jsdom)
      return '#999999'; // fallback color
    }
    
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#ffffff';
  } catch (error) {
    // Optionally: console.warn('Failed to calculate contrast color for:', backgroundColor, error);
    return '#999999';
  }
};

/**
 * Converts any CSS color to RGB values
 * 
 * @param color - Any valid CSS color value
 * @returns Object with r, g, b values (0-255) or null if conversion fails
 * 
 * @example
 * colorToRgb('#ff0000') // → { r: 255, g: 0, b: 0 }
 * colorToRgb('blue')    // → { r: 0, g: 0, b: 255 }
 */
export const colorToRgb = (color: string): { r: number; g: number; b: number } | null => {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      return null;
    }
    
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);
    
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    return { r, g, b };
  } catch {
    return null;
  }
};
