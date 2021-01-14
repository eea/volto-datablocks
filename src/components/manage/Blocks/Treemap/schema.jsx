const TreemapSchema = {
  title: 'Treemap Chart',

  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['description'], // title
    },
    {
      id: 'source',
      title: 'Data source',
      fields: ['provider_url', 'size_column', 'label_column', 'parent_column'],
    },
  ],

  properties: {
    description: {
      title: 'Description',
      widget: 'slate_richtext',
    },
    provider_url: {
      widget: 'pick_provider',
      title: 'Data provider',
    },
    size_column: {
      title: 'Size column',
      choices: [],
    },
    label_column: {
      title: 'Label column',
      choices: [],
    },
    parent_column: {
      title: 'Parent column',
      choices: [],
    },
  },

  required: ['provider_url'],
};

export default TreemapSchema;
