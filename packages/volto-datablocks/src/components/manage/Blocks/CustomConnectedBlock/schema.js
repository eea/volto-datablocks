import messages from '@eeacms/volto-datablocks/messages';

const SourceSchema = (intl) => ({
  title: intl.formatMessage(messages.source),

  fieldsets: [
    {
      id: 'default',
      title: intl.formatMessage(messages.defaultFieldsetTitle),
      fields: ['source', 'source_link'],
    },
  ],

  properties: {
    source: {
      type: 'string',
      title: intl.formatMessage(messages.source),
    },
    source_link: {
      type: 'string',
      title: intl.formatMessage(messages.sourceLink),
    },
  },

  required: ['source'],
});

const getSchema = (props, config, templateSchema = {}, intl) => {
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
    title: intl.formatMessage(messages.editCustomBlockTitle),
    fieldsets: [
      {
        id: 'default',
        title: intl.formatMessage(messages.defaultFieldsetTitle),
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
        title: intl.formatMessage(messages.sources),
        fields: ['sources'],
      },
    ],

    properties: {
      provider_url: {
        title: intl.formatMessage(messages.dataProviderTitle),
        widget: 'internal_url',
      },
      allowedParams: {
        title: intl.formatMessage(messages.allowedParams),
        type: 'array',
        creatable: true,
        items: {
          choices: [],
        },
      },
      placeholder: {
        title: intl.formatMessage(messages.placeholder),
        widget: 'textarea',
      },
      type: {
        title: intl.formatMessage(messages.blockType),
        type: 'array',
        choices: [...blocks],
      },
      sources: {
        widget: 'object_list',
        title: intl.formatMessage(messages.sources),
        schema: SourceSchema(intl),
      },
      ...(templateSchema.properties || {}),
    },

    required: ['url', ...(templateSchema.required || [])],
  };
};

export default getSchema;
