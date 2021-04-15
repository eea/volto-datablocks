import config from '@plone/volto/registry';

const colorSchema = (props) => {
  return {
    title: 'Color',

    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: ['label', 'color'],
      },
    ],

    properties: {
      label: {
        title: 'Label',
        type: 'string',
      },
      color: {
        title: 'Color',
        type: 'string',
      },
    },

    required: [],
  };
};

const coloredTableSchema = (props) => {
  return {
    title: 'Colored datatable',

    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: ['bg_color', 'rows_color'],
      },
    ],

    properties: {
      bg_color: {
        title: 'Table header color',
        widget: 'simple_color',
        available_colors:
          config.blocks.blocksConfig.simpleDataConnectedTable.available_colors,
      },
      rows_color: {
        title: 'Table rows color',
        widget: 'objectlist',
        schema: colorSchema(props),
      },
    },

    required: [],
  };
};

export default coloredTableSchema;
