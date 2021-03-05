import config from '@plone/volto/registry';

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

const getSchema = () => ({
  title: 'Edit chart',

  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['provider_url', 'type'],
    },
    {
      id: 'sources',
      title: 'Sources',
      fields: ['sources'],
    },
  ],

  properties: {
    provider_url: {
      widget: 'pick_provider',
      title: 'Data provider',
    },
    type: {
      title: 'Select block type',
      type: 'array',
      choices: [
        ...Object.keys(
          config.blocks.blocksConfig.custom_connected_block?.blocks || {},
        )?.map((block) => [block, block]),
      ],
    },
    sources: {
      widget: 'objectlist',
      title: 'Sources',
      schema: SourceSchema,
    },
  },

  required: ['url'],
});

export default getSchema;
