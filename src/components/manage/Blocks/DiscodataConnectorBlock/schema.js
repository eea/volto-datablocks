import { dataFormatChoices } from '../../../../format';
import {
  getConnectedDataParametersForProvider,
  getConnectedDataParametersForContext,
} from '../../../../helpers';

const makeChoices = (keys) => keys && keys.map((k) => [k, k]);

const dataParameters = (props) => {
  return (
    getConnectedDataParametersForProvider(
      props.connected_data_parameters,
      '',
    ) ||
    getConnectedDataParametersForContext(
      props.connected_data_parameters,
      props.content['@id'],
    )
  );
};

const getDataProvidersIds = (data_providers = [], child = {}) => {
  const ids = data_providers
    .map((data_provider) => data_provider.id)
    .filter((id) => id && id !== child.id);
  return makeChoices(ids);
};

const dataProviderSchemaExtender = (schema, child = {}, props) => {
  const data_providers = props.data.data_providers || [];
  return {
    ...schema,
    fieldsets: [
      {
        ...schema.fieldsets[0],
      },
      {
        id: 'properties',
        title: 'Properties',
        fields: ['measurmentUnit', 'additionalText', 'className'],
      },
      ...(child.hasDiscodataConnector
        ? [
            {
              id: 'Discodata connector',
              title: 'Discodata connector',
              fields: ['path', 'displayColumn', 'displayFormat'],
            },
          ]
        : []),
      ...(child.hasParent
        ? [
            {
              id: 'parent',
              title: 'Parent',
              fields: ['parent'],
            },
          ]
        : []),
      ...(child.hasQueryParameters
        ? [
            {
              id: 'query_parameter',
              title: 'Query parameter',
              fields: ['queryParameterColumn', 'queryParameterValue'],
            },
          ]
        : []),
    ],
    properties: {
      ...schema.properties,
      displayColumn: {
        ...schema.properties.displayColumn,
        choices: makeChoices(
          Object.keys(
            props.data_providers?.data?.[`${child.path}/@connector-data`] || {},
          ),
        ),
      },
      parent: {
        ...schema.properties.parent,
        choices: getDataProvidersIds(data_providers, child),
      },
      queryParameterColumn: {
        ...schema.properties.queryParameterColumn,
        choices: child.path
          ? [
              ...(dataParameters(props)?.[0]?.i
                ? [
                    dataParameters(props)[0].i,
                    `${dataParameters(props)[0].i} (default value)`,
                  ]
                : []),
              ...makeChoices(
                Object.keys(
                  props.data_providers?.data?.[
                    `${child.path}/@connector-data`
                  ] || {},
                ),
              ),
            ]
          : [
              ...(dataParameters(props)?.[0]?.i
                ? [
                    dataParameters(props)[0].i,
                    `${dataParameters(props)[0].i} (default value)`,
                  ]
                : []),
            ],
      },
    },
  };
};

const dataProviderSchema = {
  title: 'Data provider',
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: [
        'title',
        'id',
        'hasDiscodataConnector',
        'hasParent',
        'hasQueryParameters',
        'wrapperClassName',
      ],
    },
    {
      id: 'advanced',
      title: 'Advanced',
      fields: [
        'path',
        'displayColumn',
        'displayFormat',
        'measurmentUnit',
        'additionalText',
        'className',
        'parent',
        'wrapperClassName',
        'queryParameterColumn',
        'queryParameterValue',
      ],
    },
  ],
  properties: {
    title: {
      type: 'text',
      title: 'Title',
    },
    id: {
      type: 'text',
      title: 'Id',
    },
    hasDiscodataConnector: {
      type: 'boolean',
      title: 'Has discodata connector',
    },
    hasParent: {
      type: 'boolean',
      title: 'Has parent',
    },
    hasQueryParameters: {
      type: 'boolean',
      title: 'Has query parameters',
    },
    path: {
      widget: 'pick_provider',
      title: 'Discodata connector',
    },
    displayColumn: {
      type: 'select',
      title: 'Display column',
      choices: [],
    },
    displayFormat: {
      type: 'select',
      title: 'Display format',
      choices: dataFormatChoices.map((option) => [option.id, option.label]),
    },
    measurmentUnit: {
      type: 'text',
      title: 'Measurment unit',
    },
    additionalText: {
      type: 'text',
      title: 'Additional text',
    },

    className: {
      type: 'select',
      title: 'Class name',
      choices: [
        ['data', 'Data'],
        ['data-content', 'Data content'],
      ],
    },
    parent: {
      type: 'select',
      title: 'Parent',
      choices: [],
    },
    wrapperClassName: {
      type: 'select',
      title: 'Wrapper class name',
      choices: [
        ['data-wrapper brown', 'Brown wrapper'],
        ['data-wrapper green', 'Green wrapper'],
        ['data-wrapper blue', 'Blue wrapper'],
        ['data-wrapper purple', 'Purple wrapper'],
      ],
    },

    queryParameterColumn: {
      type: 'select',
      title: 'Query parameter column',
      choices: [],
    },
    queryParameterValue: {
      type: 'array',
      title: 'Query parameter value',
    },
  },
  required: ['title', 'id'],
};

const SourceSchema = {
  title: 'Source',

  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['chart_source', 'chart_source_link'],
    },
  ],

  properties: {
    chart_source: {
      type: 'string',
      title: 'Source',
    },
    chart_source_link: {
      type: 'string',
      title: 'Link',
    },
  },

  required: ['source'],
};

export const getSchema = (props) => ({
  title: 'Discodata connector block',
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['block_title', 'download_button'],
    },
    {
      id: 'advanced',
      title: 'Advanced',
      fields: ['data_providers'],
    },
    {
      id: 'sources',
      title: 'Sources',
      fields: ['chartSources', 'download_button'],
    },
  ],
  properties: {
    block_title: {
      title: 'Title',
      widget: 'textarea',
    },
    download_button: {
      title: 'Download button',
      type: 'boolean',
    },
    chartSources: {
      widget: 'objectlist',
      title: 'Sources',
      // this is an invention, should confront with dexterity serializer
      schema: SourceSchema,
    },
    data_providers: {
      title: 'Data providers',
      widget: 'object_list_inline',
      schema: dataProviderSchema,
      schemaExtender: (schema, child) =>
        dataProviderSchemaExtender(schema, child, props),
      defaultData: {
        hasDiscodataConnector: true,
        hasParent: false,
        hasQueryParameters: true,
        queryParameterColumn: dataParameters(props)?.[0]?.i,
        queryParameterValue: dataParameters(props)?.[0]?.v,
      },
    },
  },
  required: [],
});
