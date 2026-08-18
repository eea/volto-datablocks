import messages from '@eeacms/volto-datablocks/messages';

export const ConditionalDataBlockSchema = (intl) => ({
  title: intl.formatMessage(messages.conditionalDataBlockTitle),

  fieldsets: [
    {
      id: 'default',
      title: intl.formatMessage(messages.defaultFieldsetTitle),
      fields: [
        'title',
        'provider_url',
        'allowedParams',
        'waitForParams',
        'column_data',
        'operator',
        'condition',
      ],
    },
  ],

  properties: {
    title: {
      title: intl.formatMessage(messages.titleLabel),
      description: intl.formatMessage(messages.titleDescription),
      type: 'string',
    },
    provider_url: {
      widget: 'internal_url',
      title: intl.formatMessage(messages.dataProviderTitle),
    },
    allowedParams: {
      title: 'Allowed params',
      type: 'array',
      creatable: true,
      items: { choices: [] },
    },
    waitForParams: {
      title: 'Wait for filters before loading data',
      description:
        'When enabled, data is fetched only after all allowed filter parameters are available.',
      type: 'boolean',
      default: false,
    },
    column_data: {
      title: intl.formatMessage(messages.columnValueLabel),
      choices: [],
    },
    operator: {
      title: intl.formatMessage(messages.operatorLabel),
      choices: [
        ['=', intl.formatMessage(messages.equalOperator)],
        ['!=', intl.formatMessage(messages.notEqualOperator)],
        ['in', intl.formatMessage(messages.includesOperator)],
        ['not in', intl.formatMessage(messages.notIncludesOperator)],
        ['>', intl.formatMessage(messages.greaterThanOperator)],
        ['<', intl.formatMessage(messages.lessThanOperator)],
        ['exists', intl.formatMessage(messages.existsOperator)],
      ],
    },
    condition: {
      title: intl.formatMessage(messages.conditionValueLabel),
      widget: 'textarea',
    },
  },

  required: ['provider_url'],
});

export default ConditionalDataBlockSchema;
