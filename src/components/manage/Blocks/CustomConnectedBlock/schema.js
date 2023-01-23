const SourceSchema = {
  title: 'Source',

  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['source', 'source_link'],
    },
  ],

  properties: {
    source: {
      type: 'string',
      title: 'Source',
    },
    source_link: {
      type: 'string',
      title: 'Link',
    },
  },

  required: ['source'],
};

const getSchema = (config, templateSchema = {}) => {
  const blocksConfig =
    config.blocks.blocksConfig.custom_connected_block?.blocks || {};
  const blocks = Object.keys(blocksConfig).map((block) => [
    block,
    blocksConfig[block].title || block,
  ]);
  const defaultFieldset =
    templateSchema.fieldsets?.filter(
      (fieldset) => fieldset.id === 'default',
    )[0] || {};

  return {
    title: templateSchema.title || 'Edit custom connected block',
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: [
          'provider_url',
          'allowedParams',
          'placeholder',
          'type',
          ...(defaultFieldset?.fields || []),
        ],
      },
      ...(templateSchema.fieldsets?.filter(
        (fieldset) => fieldset.id !== 'default',
      ) || []),
      {
        id: 'sources',
        title: 'Sources',
        fields: ['sources'],
      },
    ],

    properties: {
      provider_url: {
        title: 'Data provider',
        widget: 'object_by_path',
      },
      allowedParams: {
        title: 'Allowed params',
        type: 'array',
        items: {
          choices: [],
        },
      },
      placeholder: {
        title: 'Placeholder',
        widget: 'textarea',
      },
      type: {
        title: 'Select block type',
        type: 'array',
        choices: [...blocks],
      },
      sources: {
        widget: 'object_list',
        title: 'Sources',
        schema: SourceSchema,
      },
      ...(templateSchema.properties || {}),
    },

    required: ['url', ...(templateSchema.required || [])],
  };
};

export default getSchema;
