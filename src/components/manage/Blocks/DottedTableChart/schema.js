import React from 'react';
import config from '@plone/volto/registry';

export const DottedTableChartSchema = () => ({
  title: 'Dotted Table Chart',

  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['description'], // title, 'underline'
    },
    {
      id: 'source',
      title: 'Data source',
      fields: [
        'provider_url',
        'column_data',
        'row_data',
        'size_data',
        'max_dot_count',
        'specifier',
        'text_template',
      ],
    },
    {
      id: 'styling',
      title: 'Styling',
      fields: ['row_colors'],
    },
  ],

  properties: {
    description: {
      title: 'Description',
      widget: 'slate_richtext',
    },
    provider_url: {
      widget: 'object_by_path',
      title: 'Data provider',
    },
    max_dot_count: {
      title: 'Maximum dot count',
      widget: 'number',
    },
    column_data: {
      title: 'Columns',
      choices: [],
    },
    row_data: {
      title: 'Rows',
      choices: [],
    },
    size_data: {
      title: 'Size data',
      choices: [],
    },
    row_colors: {
      title: 'Colors',
      widget: 'option_mapping',
      field_props: {
        widget: 'simple_color',
        available_colors: config.settings.available_colors,
      },
      options: [],
    },
    specifier: {
      title: 'Tool-tip format specifier',
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
    text_template: {
      title: 'Tool-tip text template',
      description: 'Add suffix/prefix to text. Use {} for value placeholder',
    },
  },

  required: ['provider_url'],
});

export default DottedTableChartSchema;
