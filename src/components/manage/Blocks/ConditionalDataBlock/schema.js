import messages from '@eeacms/volto-datablocks/messages';

export const ConditionalDataBlockSchema = (intl) => ({
  title: intl.formatMessage(messages.conditionalDataBlockTitle),

  fieldsets: [
    {
      id: 'default',
      title: intl.formatMessage(messages.defaultFieldsetTitle),
      fields: ['title', 'provider_url', 'column_data', 'operator', 'condition'],
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
