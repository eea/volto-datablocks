const getSchema = () => ({
  title: 'Route parameter',

  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['parameterKey', 'defaultValue'],
    },
  ],

  properties: {
    parameterKey: {
      title: 'Parameter key',
      type: 'title',
    },
    defaultValue: {
      title: 'Default value',
      type: 'title',
    },
  },

  required: ['parameterKey', 'defaultValue'],
});

export default getSchema;
