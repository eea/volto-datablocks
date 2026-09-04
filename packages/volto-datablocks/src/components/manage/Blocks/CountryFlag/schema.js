import messages from '@eeacms/volto-datablocks/messages';

const CountryFlagSchema = (intl) => {
  return {
    title: intl.formatMessage(messages.countryFlagTitle),

    fieldsets: [
      {
        id: 'default',
        title: intl.formatMessage(messages.defaultFieldsetTitle),
        fields: ['country_name'],
      },
      {
        id: 'settings',
        title: intl.formatMessage(messages.settingsFieldsetTitle),
        fields: ['show_name', 'show_flag', 'show_dropdown', 'render_as'],
      },
      {
        id: 'dropdownItems',
        title: intl.formatMessage(messages.dropdownItemsFieldsetTitle),
        fields: ['querystring'],
      },
    ],

    properties: {
      country_name: {
        title: intl.formatMessage(messages.countryNameTitle),
        description: intl.formatMessage(messages.countryNameDescription),
        choices: [],
      },
      render_as: {
        title: intl.formatMessage(messages.htmlTagTitle),
      },
      show_name: {
        title: intl.formatMessage(messages.showNameTitle),
        description: intl.formatMessage(messages.showNameDescription),
        type: 'boolean',
      },
      show_flag: {
        title: intl.formatMessage(messages.showFlagTitle),
        description: intl.formatMessage(messages.showFlagDescription),
        type: 'boolean',
      },
      show_dropdown: {
        title: intl.formatMessage(messages.showDropdownTitle),
        description: intl.formatMessage(messages.showDropdownDescription),
        type: 'boolean',
      },
      querystring: {
        title: intl.formatMessage(messages.querystringTitle),
        widget: 'querystring',
      },
    },

    required: ['country_name'],
  };
};

export default CountryFlagSchema;
