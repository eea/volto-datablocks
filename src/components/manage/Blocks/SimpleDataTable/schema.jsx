import React from 'react';
import messages from '@eeacms/volto-datablocks/messages';

const columnSchema = (intl) => ({
  title: intl.formatMessage(messages.columnTitle),
  fieldsets: [
    {
      id: 'default',
      title: intl.formatMessage(messages.defaultFieldsetTitle),
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
      title: intl.formatMessage(messages.headerTitle),
    },
    component: {
      title: intl.formatMessage(messages.componentType),
      choices: [
        ['text', 'Text'],
        ['link', 'Link'],
      ],
      defaultValue: 'text',
    },
    target: {
      title: 'Target',
      choices: [
        ['_blank', intl.formatMessage(messages.newWindowChoice)],
        ['_self', intl.formatMessage(messages.sameWindowChoice)],
      ],
    },
    external: {
      title: intl.formatMessage(messages.externalLink),
      type: 'boolean',
    },
    linkTemplate: {
      title: intl.formatMessage(messages.linkTemplate),
      description: intl.formatMessage(messages.tooltipTextTemplateDescription),
    },
    render_as: {
      title: 'HTML tag',
    },
    specifier: {
      title: intl.formatMessage(messages.formatSpecifier),
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
      title: intl.formatMessage(messages.textTemplate),
      description: intl.formatMessage(messages.tooltipTextTemplateDescription),
    },
    placeholder: {
      title: intl.formatMessage(messages.placeholder),
    },
    textAlign: {
      title: intl.formatMessage(messages.alignmentTitle),
      widget: 'align',
      type: 'string',
    },
    column: {
      title: intl.formatMessage(messages.dataColumn),
      choices: [],
    },
    column_link: {
      title: intl.formatMessage(messages.dataColumnLink),
      choices: [],
    },
  },
  required: ['column'],
});

const getColumnSchema = (schema, child, intl) => {
  return {
    ...columnSchema(intl),
    fieldsets: [
      {
        id: 'default',
        title: intl.formatMessage(messages.defaultFieldsetTitle),
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

export const SimpleDataTableSchema = (config, templateSchema = {}, intl) => {
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
    title: intl.formatMessage(messages.dataConnectedTable),

    fieldsets: [
      {
        id: 'default',
        title: intl.formatMessage(messages.defaultFieldsetTitle),
        fields: [
          'description',
          'placeholder',
          'template',
          ...(defaultFieldset?.fields || {}),
        ], // title
      },
      {
        id: 'source',
        title: intl.formatMessage(messages.dataSourceFieldsetTitle),
        fields: ['provider_url', 'allowedParams', 'max_count', 'columns'],
      },
      {
        id: 'data_query',
        title: intl.formatMessage(messages.dataQuery),
        fields: ['data_query'],
      },
      {
        id: 'styling',
        title: intl.formatMessage(messages.stylingFieldsetTitle),
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
        title: intl.formatMessage(messages.columnsTitle),
        description: intl.formatMessage(messages.columnsDescription),
        schema: columnSchema(intl),
        schemaExtender: (schema, child) => getColumnSchema(schema, child, intl),
        widget: 'object_list',
      },
      description: {
        title: intl.formatMessage(messages.descriptionTitle),
        widget: 'slate_richtext',
        description: intl.formatMessage(messages.allowRichText),
      },
      provider_url: {
        title: intl.formatMessage(messages.dataProviderTitle),
        widget: 'internal_url',
      },
      allowedParams: {
        title: intl.formatMessage(messages.allowedURLParams),
        type: 'array',
        creatable: true,
        items: {
          choices: [],
        },
      },
      data_query: {
        title: intl.formatMessage(messages.dataQuery),
        widget: 'data_query',
      },
      max_count: {
        title: intl.formatMessage(messages.maxResults),
        widget: 'number',
        defaultValue: 5,
      },
      placeholder: {
        title: intl.formatMessage(messages.placeholder),
        widget: 'textarea',
        default: intl.formatMessage(messages.noResults),
      },
      template: {
        title: intl.formatMessage(messages.templateTitle),
        choices: [...templates],
        default: 'default',
      },
      has_pagination: {
        title: intl.formatMessage(messages.paginationTitle),
        type: 'boolean',
        default: false,
      },
      show_header: {
        title: intl.formatMessage(messages.showHeader),
        type: 'boolean',
      },
      striped: {
        title: intl.formatMessage(messages.stripeRows),
        type: 'boolean',
      },
      bordered: {
        title: intl.formatMessage(messages.removeTableBorder),
        type: 'boolean',
      },
      compact_table: {
        title: intl.formatMessage(messages.makeTableCompact),
        type: 'boolean',
      },
      celled: {
        title: intl.formatMessage(messages.divideRow),
        type: 'boolean',
      },
      ...(templateSchema.properties || {}),
    },

    required: ['provider_url', ...(templateSchema.required || [])],
  };
};
