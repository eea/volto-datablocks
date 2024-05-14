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
        fields: ['show_name', 'show_flag', 'show_dropdown', 'render_as'], // title
      },
      {
        id: 'dropdownItems',
        title: 'Dropdown items',
        fields: ['querystring'],
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
      show_dropdown: {
        title: 'Show dropdown',
        type: 'boolean',
      },
      querystring: {
        title: 'Criteria',
        widget: 'querystring',
      },
    },

    required: ['country_name'],
  };
};

export default CountryFlagSchema;
