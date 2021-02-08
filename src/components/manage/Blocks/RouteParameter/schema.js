const getSchema = () => ({
  title: 'Route parameter',

  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['providerUrl', 'parameterKey', 'defaultValue'],
    },
  ],

  properties: {
    providerUrl: {
      title: 'Data provider',
      widget: 'pick_provider',
    },
    parameterKey: {
      title: 'Parameter key',
      type: 'title',
    },
    defaultValue: {
      title: 'Default value',
      type: 'title',
    },
  },

  required: ['providerUrl', 'parameterKey', 'defaultValue'],
});

export default getSchema;
