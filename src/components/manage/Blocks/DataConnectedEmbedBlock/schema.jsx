import messages from '@eeacms/volto-datablocks/messages';

const IframeSchema = (intl) => ({
  title: intl.formatMessage(messages.iframeTitle),

  fieldsets: [
    {
      id: 'default',
      title: intl.formatMessage(messages.defaultFieldsetTitle),
      fields: ['url', 'align', 'height', 'zoom'],
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
    zoom: {
      title: intl.formatMessage(messages.zoom),
      description: intl.formatMessage(messages.zoomDescription),
      type: 'string',
      default: '1',
    },
  },

  required: ['url'],
});

export default IframeSchema;
