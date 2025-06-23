// Theme color definitions
export const lightTheme = {
    name: 'Light Theme',
    // Background colors
    background: {
        primary: '#ffffff',
        secondary: '#f8f9fa',
        tertiary: '#e9ecef',
        elevated: '#ffffff',
    },

    // Text colors
    text: {
        primary: '#212529',
        secondary: '#6c757d',
        tertiary: '#adb5bd',
        inverse: '#ffffff',
    },

    // Border colors
    border: {
        light: '#dee2e6',
        medium: '#ced4da',
        dark: '#6c757d',
    },

    // Task card colors
    taskCard: {
        background: '#ffffff',
        border: '#dee2e6',
        shadow: 'rgba(0, 0, 0, 0.1)',
        shadowHover: 'rgba(0, 0, 0, 0.15)',
    },

    // Task board colors
    taskBoard: {
        background: '#f8f9fa',
        columnBackground: '#eeeeee',
        columnBorder: '#dee2e6',
    },

    // Interactive elements
    interactive: {
        primary: '#007bff',
        primaryHover: '#0056b3',
        secondary: '#6c757d',
        secondaryHover: '#5a6268',
        success: '#28a745',
        warning: '#ffc107',
        danger: '#dc3545',
        dangerHover: '#c82333',
    },

    // Icons
    icon: {
        primary: '#6c757d',
        secondary: '#adb5bd',
        interactive: '#007bff',
    },

    // Attribution
    attribution: {
        background: 'rgba(255, 255, 255, 0.9)',
        border: 'rgba(0, 0, 0, 0.1)',
        shadow: 'rgba(0, 0, 0, 0.1)',
    },
};

export const darkTheme = {
    name: 'Dark Theme',
    // Background colors
    background: {
        primary: '#1a1a1a',
        secondary: '#2d2d2d',
        tertiary: '#404040',
        elevated: '#2d2d2d',
    },

    // Text colors
    text: {
        primary: '#ffffff',
        secondary: '#b3b3b3',
        tertiary: '#808080',
        inverse: '#1a1a1a',
    },

    // Border colors
    border: {
        light: '#404040',
        medium: '#595959',
        dark: '#808080',
    },

    // Task card colors
    taskCard: {
        background: '#2d2d2d',
        border: '#404040',
        shadow: 'rgba(0, 0, 0, 0.3)',
        shadowHover: 'rgba(0, 0, 0, 0.4)',
    },

    // Task board colors
    taskBoard: {
        background: '#1a1a1a',
        columnBackground: '#2d2d2d',
        columnBorder: '#404040',
    },

    // Interactive elements
    interactive: {
        primary: '#4da6ff',
        primaryHover: '#3399ff',
        secondary: '#b3b3b3',
        secondaryHover: '#cccccc',
        success: '#4caf50',
        warning: '#ff9800',
        danger: '#f44336',
        dangerHover: '#d32f2f',
    },

    // Icons
    icon: {
        primary: '#b3b3b3',
        secondary: '#808080',
        interactive: '#4da6ff',
    },

    // Attribution
    attribution: {
        background: 'rgba(45, 45, 45, 0.9)',
        border: 'rgba(255, 255, 255, 0.1)',
        shadow: 'rgba(0, 0, 0, 0.3)',
    },
};

export const themes = {
    light: lightTheme,
    dark: darkTheme,
};

export type Theme = typeof lightTheme | typeof darkTheme;
