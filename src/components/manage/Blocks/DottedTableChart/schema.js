import React from 'react';
import config from '@plone/volto/registry';
import messages from '@eeacms/volto-datablocks/messages';

export const DottedTableChartSchema = (intl) => ({
  title: intl.formatMessage(messages.dottedTableChartTitle),

  fieldsets: [
    {
      id: 'default',
      title: intl.formatMessage(messages.defaultFieldsetTitle),
      fields: ['description'], // title, 'underline'
    },
    {
      id: 'source',
      title: intl.formatMessage(messages.dataSourceFieldsetTitle),
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
      title: intl.formatMessage(messages.stylingFieldsetTitle),
      fields: ['row_colors'],
    },
  ],

  properties: {
    description: {
      title: intl.formatMessage(messages.descriptionTitle),
      widget: 'slate_richtext',
    },
    provider_url: {
      widget: 'internal_url',
      title: intl.formatMessage(messages.dataProviderTitle),
    },
    max_dot_count: {
      title: intl.formatMessage(messages.maxDotCountTitle),
      widget: 'number',
    },
    column_data: {
      title: intl.formatMessage(messages.columnsTitle),
      choices: [],
    },
    row_data: {
      title: intl.formatMessage(messages.rowsTitle),
      choices: [],
    },
    size_data: {
      title: intl.formatMessage(messages.sizeDataTitle),
      choices: [],
    },
    row_colors: {
      title: intl.formatMessage(messages.colorsTitle),
      widget: 'option_mapping',
      field_props: {
        widget: 'simple_color',
        available_colors: config.settings.available_colors,
      },
      options: [],
    },
    specifier: {
      title: intl.formatMessage(messages.tooltipFormatSpecifierTitle),
      description: (
        <>
          {intl.formatMessage(messages.tooltipFormatSpecifierDescription)}{' '}
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
    text_template: {
      title: intl.formatMessage(messages.tooltipTextTemplateTitle),
      description: intl.formatMessage(messages.tooltipTextTemplateDescription),
    },
  },

  required: ['provider_url'],
});

export default DottedTableChartSchema;
