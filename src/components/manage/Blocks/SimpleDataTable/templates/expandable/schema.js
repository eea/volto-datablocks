export default () => ({
  title: 'Expandable datatable',
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: [
        'searchDescription',
        'popupTitle',
        'popupDescription',
        'popupUrl',
        'popupTableData',
        'popupMapData',
      ],
    },
  ],
  properties: {
    searchDescription: {
      title: 'Search description',
      widget: 'textarea',
    },
    popupTitle: {
      title: 'Popup Title',
      choices: [],
    },
    popupDescription: {
      title: 'Popup description',
      choices: [],
    },
    popupUrl: {
      title: 'Popup Url',
      choices: [],
    },
    popupTableData: {
      title: 'Popup Table Data',
      choices: [],
    },
    popupMapData: {
      title: 'Popup Map Data',
      choices: [],
    },
  },
  required: [],
});
