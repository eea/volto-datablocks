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
        widget: 'simple_color',
        available_colors:
          config.blocks.blocksConfig.simpleDataConnectedTable.available_colors,
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
        fields: ['th_color', 'td_color'],
      },
    ],

    properties: {
      th_color: {
        title: 'Table header color',
        widget: 'simple_color',
        available_colors:
          config.blocks.blocksConfig.simpleDataConnectedTable.available_colors,
      },
      td_color: {
        title: 'Table rows color',
        widget: 'object_list',
        schema: colorSchema(props),
      },
    },

    required: [],
  };
};

export default coloredTableSchema;
