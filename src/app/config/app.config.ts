export const APP_CONFIG = {
  couple: {
    name1: 'Eleaz',
    name2: 'Mead',
    weddingDate: 'January 17, 2027',
    venue: 'The Lighthouse Fullerton, Singapore',
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
      images: [] as readonly string[], // Add image URLs here to show in the Our Story section
    },
    rsvp: {
      heading: 'RSVP',
      deadline: 'Please respond by August 31, 2026',
      formLabels: {
        name: 'Full Name',
        attendance: 'Will you attend?',
        guests: 'Number of guests',
        submit: 'Send RSVP',
        yes: 'Joyfully accepts',
        no: 'Regretfully declines',
        rsvpFor: 'RSVP for',
        confirmHeading: 'Review your RSVP',
        confirmBody: 'Please review before submitting. Responses cannot be edited after submission.',
      },
      search: {
        label: 'Enter your first and last name to find your invitation',
        placeholder: 'e.g. Eleazer',
        buttonLabel: 'Find Me',
        notFound: 'We could not find your name on the guest list. Please check your spelling or contact us.',
        searching: 'Searching...',
      },
      related: {
        promptHeading: 'We also found these guests in your group',
        promptBody: 'Would you like to RSVP for them as well?',
        include: 'Include',
        exclude: 'Exclude',
      },
      alreadyRsvped: {
        message: 'This guest has already RSVP-ed by {initiator} on {date}.',
        notEditable: 'RSVP responses cannot be changed once submitted. Please contact us if you need to make an update.',
      },
      submitting: 'Submitting your RSVP...',
      errorMessage: 'Something went wrong. Please try again or contact us directly.',
      successMessage: "Thank you! We can't wait to celebrate with you.",
      submitAnother: 'Submit another response',
      goBack: 'Go back',
    },
    mainCourse: {
      heading: 'Select your main course',
      options: [
        {
          id: 'beef' as const,
          label: 'Wagyu Beef Striploin',
          description: 'Confit potato, chanterelle mushroom, seasonal vegetables, red wine reduction',
        },
        {
          id: 'fish' as const,
          label: 'St John Temasek Seabass',
          description: 'Fennel-potato puree, seasonal vegetables, chablis cream, truffle butter seared',
        },
      ],
      required: 'Please select a main course for all attending guests.',
    },
    gallery: {
      heading: 'Our Moments',
    },
    footer: {
      message: 'Made with love',
    },
  },
  contacts: {
    whatsappUrl: 'https://wa.me/6582974687',
  },
  i18n: {
    defaultLocale: 'en',
    supportedLocales: ['en', 'fil'] as const,
  },
} as const;
