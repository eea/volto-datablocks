const IframeSchema = {
  title: 'Data-connected embed',

  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: [
        'baseUrl',
        'align',
        'height',
        'privacy_statement',
        'privacy_cookie_key',
        'enabled',
      ],
    },
  ],

  properties: {
    baseUrl: {
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
    privacy_statement: {
      title: 'Privacy statement',
      description: 'Short notification text',
      widget: 'cktext',
    },
    privacy_cookie_key: {
      title: 'Privacy cookie key',
      description: 'Identifies similar external content',
    },
    enabled: {
      title: 'Use privacy screen?',
      description: 'Enable/disable the privacy protection',
      type: 'boolean',
    },
  },

  required: ['baseUrl'],
};

export default IframeSchema;
