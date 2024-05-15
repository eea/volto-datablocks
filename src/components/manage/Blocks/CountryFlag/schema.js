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
        description: 'Select the country to be displayed.',
        choices: [],
      },
      render_as: {
        title: 'HTML tag',
      },
      show_name: {
        title: 'Show country name',
        description:
          'Enable it to display the name of the selected country. Disable it to display the title of the page.',
        type: 'boolean',
      },
      show_flag: {
        title: 'Show country flag',
        description:
          'Enable it to display the flag of the selected country. Disable it to display the preview image of the current page. If the page has no preview image set, it will display nothing.',
        type: 'boolean',
      },
      show_dropdown: {
        title: 'Show dropdown',
        description:
          'Enable the dropdown select to navigate to other pages. In the "Dropdown items" section you can set the criterias to filter the items displayed in the dropdown. If no criterias are set, the siblings of the current page are displayed in the dropdown.',
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
