export interface IntegrityTokens {
  brand: Record<'50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | '950', string>
  accent: {
    DEFAULT: string
    hover: string
    light: string
    dark: string
    darkHover: string
  }
  status: {
    operational: string
    degraded: string
    down: string
    maintenance: string
  }
  surface: {
    light: Record<'primary' | 'secondary' | 'tertiary' | 'border' | 'borderLight' | 'textPrimary' | 'textSecondary' | 'textTertiary', string>
    dark: Record<'primary' | 'secondary' | 'tertiary' | 'border' | 'borderLight' | 'textPrimary' | 'textSecondary' | 'textTertiary', string>
  }
  sidebar: {
    light: Record<'bg' | 'foreground' | 'primary' | 'primaryForeground' | 'accent' | 'accentForeground' | 'border', string>
    dark: Record<'bg' | 'foreground' | 'primary' | 'primaryForeground' | 'accent' | 'accentForeground' | 'border', string>
  }
  typography: {
    sans: string[]
    mono: string[]
  }
  radii: Record<'sm' | 'DEFAULT' | 'lg' | 'xl', string>
  shadows: Record<'sm' | 'md' | 'lg', string>
}

export declare const integrityTokens: IntegrityTokens
export default integrityTokens
