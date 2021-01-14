const CountryFlagSchema = () => {
  return {
    title: 'Country Flag',

    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: ['country_name'],
      },
      {
        id: 'settings',
        title: 'Settings',
        fields: ['show_name', 'show_flag', 'render_as'], // title
      },
    ],

    properties: {
      country_name: {
        title: 'Country name',
        choices: [],
      },
      render_as: {
        title: 'HTML tag',
      },
      show_name: {
        title: 'Show country name',
        type: 'boolean',
      },
      show_flag: {
        title: 'Show country flag',
        type: 'boolean',
      },
    },

    required: ['country_name'],
  };
};

export default CountryFlagSchema;
