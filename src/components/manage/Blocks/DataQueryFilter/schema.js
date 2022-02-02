const Schema = {
  title: 'Edit DataQuery Filter',

  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['placeholder', 'provider_url', 'align', 'select_field'],
    },
  ],

  properties: {
    placeholder: {
      title: 'Placeholder value',
    },
    provider_url: {
      widget: 'object_by_path',
      title: 'Data provider',
    },
    align: {
      title: 'Alignment',
      widget: 'align',
      type: 'string',
    },
    select_field: {
      title: 'Autoquery field',
      choices: [],
    },
  },

  required: ['provider_url'],
};

export default Schema;
