import React from 'react';

const dataProviderSchemaExtender = (schema = {}, child = {}, props) => {
  const title = child.title || child.url;
  if (!title || !props.providers_data) return schema;
  const provider_data = props.providers_data[title] || {};
  const columns = Array.from(
    new Set(Object.keys(provider_data || {})),
  ).map((n) => [n, n]);
  const rows =
    child.column && provider_data[child.column]
      ? provider_data[child.column].map((value, index) => [index, value])
      : [];

  return {
    ...schema,
    properties: {
      ...schema.properties,
      column: {
        title: 'Column',
        choices: columns,
      },
      row: {
        title: 'Row',
        choices: rows,
      },
    },
  };
};

const dataProviderSchema = {
  title: 'Data provider',
  fieldsets: [
    {
      id: 'default',
      title: 'Properties',
      fields: [
        'title',
        'url',
        'column',
        'row',
        'specifier',
        'textTemplate',
        'placeholder',
      ],
    },
    {
      id: 'advanced',
      title: 'Advanced',
      fields: ['className', 'wrapperClassName', 'data_query'],
    },
  ],
  properties: {
    title: {
      type: 'text',
      title: 'Title',
    },
    url: {
      widget: 'object_by_path',
      title: 'Data provider',
    },
    column: {
      title: 'Column',
      choices: [],
    },
    row: {
      title: 'Row',
      default: 0,
      choices: [],
    },
    specifier: {
      title: 'Format specifier',
      description: (
        <>
          See{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/d3/d3-3.x-api-reference/blob/master/Formatting.md#d3_format"
          >
            D3 format documentation
          </a>
        </>
      ),
    },
    textTemplate: {
      title: 'Text template',
      widget: 'textarea',
      description: 'Add suffix/prefix to text. Use {} for value placeholder',
    },
    placeholder: {
      title: 'Placeholder',
    },
    className: {
      type: 'select',
      title: 'Class name',
      choices: [
        ['data', 'Data'],
        ['data-content', 'Data content'],
      ],
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
    data_query: {
      title: 'Data query',
      widget: 'data_query',
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

export default (props) => ({
  title: 'Discodata connector block',
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['block_title'],
    },
    {
      id: 'advanced',
      title: 'Advanced',
      fields: ['providers'],
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
    chartSources: {
      widget: 'object_list',
      title: 'Sources',
      schema: SourceSchema,
    },
    download_button: {
      title: 'Download button',
      type: 'boolean',
      defaultValue: true,
    },
    providers: {
      title: 'Data providers',
      widget: 'object_list',
      schema: dataProviderSchema,
      schemaExtender: (schema, child) =>
        dataProviderSchemaExtender(schema, child, props),
    },
  },
  required: [],
});
