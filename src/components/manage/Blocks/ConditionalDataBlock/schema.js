export const ConditionalDataBlockSchema = () => ({
  title: 'Conditional data block',

  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['title', 'provider_url', 'column_data', 'operator', 'condition'],
    },
  ],

  properties: {
    title: {
      title: 'Title',
      description: 'Section friendly name',
      type: 'string',
    },
    provider_url: {
      widget: 'internal_url',
      title: 'Data provider',
    },
    column_data: {
      title: 'Column value',
      choices: [],
    },
    operator: {
      title: 'Operator',
      choices: [
        ['=', 'Equal'],
        ['!=', 'Not equal'],
        ['in', 'Includes'],
        ['not in', 'Not includes'],
        ['>', 'Greater than'],
        ['<', 'Less than'],
      ],
    },
    condition: {
      title: 'Condition value',
      widget: 'textarea',
    },
  },

  required: ['provider_url'],
});

export default ConditionalDataBlockSchema;
