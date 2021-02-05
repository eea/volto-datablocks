const getSchema = () => ({
  title: 'Router data parameter',

  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['param', 'defaultValue'],
    },
  ],

  properties: {
    param: {
      title: 'Parameter',
      type: 'title',
    },
    defaultValue: {
      title: 'Default value',
      type: 'title',
    },
  },

  required: [''],
});

export default getSchema;
