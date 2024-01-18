import React from 'react';

const columnSchema = {
  title: 'Column',
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: [
        'column',
        'title',
        'component',
        'render_as',
        'textTemplate',
        'placeholder',
        'specifier',
        'textAlign',
      ],
    },
  ],
  properties: {
    title: {
      title: 'Header',
    },
    component: {
      title: 'Component type',
      choices: [
        ['text', 'Text'],
        ['link', 'Link'],
      ],
      defaultValue: 'text',
    },
    target: {
      title: 'Target',
      choices: [
        ['_blank', 'New window'],
        ['_self', 'Same window'],
      ],
    },
    external: {
      title: 'External link',
      type: 'boolean',
    },
    linkTemplate: {
      title: 'Link template',
      description: 'Add suffix/prefix to text. Use {} for value placeholder',
    },
    render_as: {
      title: 'HTML tag',
    },
    specifier: {
      title: 'Format specifier',
      description: (
        <>
          See{' '}
          <a
            target="_blank"
            rel="noopener"
            href="https://github.com/d3/d3-3.x-api-reference/blob/master/Formatting.md#d3_format"
          >
            D3 format documentation
          </a>
        </>
      ),
    },
    textTemplate: {
      title: 'Text template',
      description: 'Add suffix/prefix to text. Use {} for value placeholder',
    },
    placeholder: {
      title: 'Placeholder',
    },
    textAlign: {
      title: 'Align',
      widget: 'align',
      type: 'string',
    },
    column: {
      title: 'Data column',
      choices: [],
    },
    column_link: {
      title: 'Data column link',
      choices: [],
    },
  },
  required: ['column'],
};

const getColumnSchema = (schema, child) => {
  return {
    ...columnSchema,
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: [
          'column',
          ...(child?.component === 'link' ? ['column_link'] : []),
          'title',
          'component',
          ...(child?.component === 'link'
            ? ['target', 'external', 'linkTemplate']
            : []),
          'render_as',
          'textTemplate',
          'specifier',
          'textAlign',
        ],
      },
    ],
    required: ['column', 'column_link'],
  };
};

export const SimpleDataTableSchema = (config, templateSchema = {}) => {
  const templatesConfig =
    config.blocks.blocksConfig.simpleDataConnectedTable.templates;

  const templates = Object.keys(templatesConfig).map((template) => [
    template,
    templatesConfig[template].title || template,
  ]);
  const defaultFieldset = templateSchema.fieldsets.filter((fieldset) => {
    return fieldset.id === 'default';
  })[0];

  return {
    title: 'DataConnected Table',

    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: [
          'description',
          'placeholder',
          'template',
          ...(defaultFieldset?.fields || {}),
        ], // title
      },
      {
        id: 'source',
        title: 'Data source',
        fields: ['provider_url', 'allowedParams', 'max_count', 'columns'],
      },
      {
        id: 'data_query',
        title: 'Data query',
        fields: ['data_query'],
      },
      {
        id: 'styling',
        title: 'Styling',
        fields: [
          'has_pagination',
          'show_header',
          'celled',
          'striped',
          'bordered',
          'compact_table',
        ],
      },
    ],

    properties: {
      // columns: {
      //   title: 'Columns',
      //   description: 'Leave empty to show all columns',
      //   isMulti: true,
      //   choices: [],
      //   widget: 'multi_select',
      // },
      columns: {
        title: 'Columns',
        description: 'Leave empty to show all columns',
        schema: columnSchema,
        schemaExtender: (schema, child) => getColumnSchema(schema, child),
        widget: 'object_list',
      },
      description: {
        title: 'Description',
        widget: 'slate_richtext',
        description: 'Allows rich text formatting',
      },
      provider_url: {
        title: 'Data provider',
        widget: 'internal_url',
      },
      allowedParams: {
        title: 'Allowed url params',
        type: 'array',
        creatable: true,
        items: {
          choices: [],
        },
      },
      data_query: {
        title: 'Data query',
        widget: 'data_query',
      },
      max_count: {
        title: 'Max results',
        widget: 'number',
        defaultValue: 5,
      },
      placeholder: {
        title: 'Placeholder',
        widget: 'textarea',
        default: 'No results',
      },
      template: {
        title: 'Template',
        choices: [...templates],
        default: 'default',
      },
      has_pagination: {
        title: 'Pagination',
        type: 'boolean',
        default: false,
      },
      show_header: {
        title: 'Show header',
        type: 'boolean',
      },
      striped: {
        title: 'Stripe alternate rows with color',
        type: 'boolean',
      },
      bordered: {
        title: 'Remove table border',
        type: 'boolean',
      },
      compact_table: {
        title: 'Make the table compact',
        type: 'boolean',
      },
      celled: {
        title: 'Divide each row into separate cells',
        type: 'boolean',
      },
      ...(templateSchema.properties || {}),
    },

    required: ['provider_url', ...(templateSchema.required || [])],
  };
};
