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
      description: 'Add suffix/prefix to text. Use {} for value placeholder',
    },
    textAlign: {
      title: 'Align',
      widget: 'simple_text_align',
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
          ...(child.component === 'link' ? ['column_link'] : []),
          'title',
          'component',
          ...(child.component === 'link' ? ['target', 'linkTemplate'] : []),
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

const SimpleDataTableSchema = () => ({
  title: 'DataConnected Table',

  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['description'], // title
    },
    {
      id: 'source',
      title: 'Data source',
      fields: ['provider_url', 'max_count', 'columns'],
    },
    {
      id: 'styling',
      title: 'Styling',
      fields: [
        'show_header',
        'underline',
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
      widget: 'object_list_inline',
    },

    description: {
      title: 'Description',
      widget: 'slate_richtext',
      description: 'Allows rich text formatting',
    },
    provider_url: {
      widget: 'pick_provider',
      title: 'Data provider',
    },
    max_count: {
      title: 'Max results',
      widget: 'number',
      defaultValue: 5,
    },
    show_header: {
      title: 'Show header?',
      type: 'boolean',
    },
    striped: {
      title: 'Color alternate rows',
      type: 'boolean',
    },
    bordered: {
      title: 'Remove table border',
      type: 'boolean',
    },
    compact_table: {
      title: 'Compact table',
      type: 'boolean',
    },
    underline: {
      title: 'Title underline',
      type: 'boolean',
    },
  },

  required: ['provider_url'],
});

export default SimpleDataTableSchema;
