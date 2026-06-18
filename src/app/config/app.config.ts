export const APP_CONFIG = {
  couple: {
    name1: 'Eleaz',
    name2: 'Mead',
    weddingDate: 'January 16, 2027',
    venue: 'Singapore',
    hashtag: '#EleazMead',
  },
  theme: {
    colorPrimary: '#E8C4B8',
    colorSecondary: '#C49A8A',
    colorAccent: '#D4A96A',
    colorBackground: '#FDF8F5',
    colorText: '#3B2F2F',
    colorMuted: '#9E7E78',
    fontDisplay: '"Cormorant Garamond", serif',
    fontBody: '"Jost", sans-serif',
  },
  sections: {
    hero: {
      headline: "We're getting married",
      subheadline: 'Join us as we celebrate our love',
      ctaLabel: 'RSVP Now',
    },
    ourStory: {
      heading: 'Our Story',
      body: "Placeholder story text. Replace with the couple's narrative.",
    },
    rsvp: {
      heading: 'RSVP',
      deadline: 'Please respond by August 31, 2027',
      formLabels: {
        name: 'Full Name',
        attendance: 'Will you attend?',
        guests: 'Number of guests',
        submit: 'Send RSVP',
        yes: 'Joyfully accepts',
        no: 'Regretfully declines',
      },
    },
    gallery: {
      heading: 'Our Moments',
    },
    footer: {
      message: 'Made with love',
    },
  },
  i18n: {
    defaultLocale: 'en',
    supportedLocales: ['en', 'fil'] as const,
  },
} as const;
