export const APP = {
  name: "Caffinity",
  tagline: "Study smarter",
  supportEmail: "support@beetastic.com",
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
} as const;