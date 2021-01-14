const Schema = {
  title: 'Edit DataQuery Filter',

  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['label', 'placeholder', 'provider_url', 'align', 'select_field'],
    },
  ],

  properties: {
    label: {
      title: 'Field label',
    },
    placeholder: {
      title: 'Placeholder value',
    },
    provider_url: {
      widget: 'pick_provider',
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
