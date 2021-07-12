const IframeSchema = {
  title: 'Data-connected embed',

  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['url', 'align', 'height'],
    },
  ],

  properties: {
    url: {
      title: 'Embed URL',
    },
    align: {
      title: 'Alignment',
      widget: 'align',
      type: 'string',
    },
    height: {
      title: 'Height',
      description: 'Map height',
      type: 'integer',
    },
  },

  required: ['url'],
};

export default IframeSchema;
