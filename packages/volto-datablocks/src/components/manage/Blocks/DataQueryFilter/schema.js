import messages from '@eeacms/volto-datablocks/messages';

const Schema = (intl) => ({
  title: intl.formatMessage(messages.editDataQueryFilterTitle),

  fieldsets: [
    {
      id: 'default',
      title: intl.formatMessage(messages.defaultFieldsetTitle),
      fields: ['placeholder', 'provider_url', 'align', 'select_field'],
    },
  ],

  properties: {
    placeholder: {
      title: intl.formatMessage(messages.placeholderValueTitle),
    },
    provider_url: {
      widget: 'internal_url',
      title: intl.formatMessage(messages.dataProviderTitle),
    },
    align: {
      title: intl.formatMessage(messages.alignmentTitle),
      widget: 'align',
      type: 'string',
    },
    select_field: {
      title: intl.formatMessage(messages.autoqueryFieldTitle),
      choices: [],
    },
  },

  required: ['provider_url'],
});

export default Schema;
