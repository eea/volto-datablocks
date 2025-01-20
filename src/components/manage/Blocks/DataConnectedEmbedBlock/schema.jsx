import messages from '@eeacms/volto-datablocks/messages';

const IframeSchema = (intl) => ({
  title: intl.formatMessage(messages.iframeTitle),

  fieldsets: [
    {
      id: 'default',
      title: intl.formatMessage(messages.defaultFieldsetTitle),
      fields: ['url', 'align', 'height'],
    },
  ],

  properties: {
    url: {
      title: intl.formatMessage(messages.embedUrl),
    },
    align: {
      title: intl.formatMessage(messages.alignmentTitle),
      widget: 'align',
      type: 'string',
    },
    height: {
      title: intl.formatMessage(messages.height),
      description: intl.formatMessage(messages.heightDescription),
      type: 'integer',
      default: 200,
    },
  },

  required: ['url'],
});

export default IframeSchema;
