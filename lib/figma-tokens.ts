// Design tokens extracted directly from Figma file Y972VugHKmG7IGi5jqbRhj (Node 0:1 / 2003:3001)

export const figmaTokens = {
  colors: {
    primary: {
      solid: '#0F766E', // Hero Brand Color (Teal 700)
      hover: '#0D5C56', // Interactions
      light: '#14B8A6', // Secondary / Accent (Teal 500)
      mint: '#CCFBF1', // Soft Tag Fill (Teal 100)
      soft: '#F0FDFA', // Light Accent Area (Teal 50)
    },
    neutral: {
      50: '#FAF9F6', // Canvas / Paper Background
      100: '#F5F3EF', // Table headers / Soft Card BG
      200: '#EAE6E1', // Dividers / Borders
      500: '#968A80', // Muted Subtext
      900: '#1C1A16', // Dominant Body Text
      white: '#FFFFFF',
      altBorder: '#E4E2DC',
      altMuted: '#6B6E6E',
      altText: '#1F2222',
      altBg: '#FAF9F5',
    },
    semantic: {
      success: {
        solid: '#10B981',
        light: '#DCFCE7',
        text: '#15803D',
        label: 'Confirmed / Selesai',
      },
      warning: {
        solid: '#F59E0B',
        light: '#FEF3C7',
        text: '#D97706',
        label: 'Pending alert / Menunggu',
      },
      error: {
        solid: '#EF4444',
        light: '#FEE2E2',
        text: '#B91C1C',
        label: 'Failure / Denied / Batal',
      },
      info: {
        solid: '#3B82F6',
        light: '#DBEAFE',
        text: '#1D4ED8',
        label: 'System notification / Info',
      },
      whatsapp: '#25D366',
    },
  },
  typography: {
    fontFamily: 'Figtree, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    scale: {
      displayLarge: {
        fontSize: '36px',
        lineHeight: '43px',
        fontWeight: '700',
        letterSpacing: '-0.02em',
      },
      heading1: {
        fontSize: '28px',
        lineHeight: '34px',
        fontWeight: '700',
        letterSpacing: '-0.015em',
      },
      heading2: {
        fontSize: '24px',
        lineHeight: '29px',
        fontWeight: '600',
        letterSpacing: '-0.01em',
      },
      heading3: {
        fontSize: '20px',
        lineHeight: '24px',
        fontWeight: '600',
      },
      bodyLarge: {
        fontSize: '16px',
        lineHeight: '24px',
        fontWeight: '400',
      },
      bodyBase: {
        fontSize: '14px',
        lineHeight: '20px',
        fontWeight: '400',
      },
      bodySemiBold: {
        fontSize: '14px',
        lineHeight: '20px',
        fontWeight: '600',
      },
      caption: {
        fontSize: '12px',
        lineHeight: '16px',
        fontWeight: '500',
      },
      overline: {
        fontSize: '11px',
        lineHeight: '14px',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
      },
    },
  },
  spacing: {
    4: '4px',
    8: '8px',
    12: '12px',
    16: '16px',
    20: '20px',
    24: '24px',
    32: '32px',
    40: '40px',
    48: '48px',
    64: '64px',
    80: '80px',
  },
  borderRadius: {
    sm: '8px',
    md: '10px',
    lg: '12px',
    xl: '14px',
    '2xl': '16px',
    full: '9999px',
  },
  shadows: {
    card: '0 1px 3px rgba(28, 26, 22, 0.05), 0 1px 2px rgba(28, 26, 22, 0.03)',
    hover: '0 10px 25px -5px rgba(15, 118, 110, 0.1), 0 8px 10px -6px rgba(15, 118, 110, 0.06)',
    modal: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  },
} as const;
