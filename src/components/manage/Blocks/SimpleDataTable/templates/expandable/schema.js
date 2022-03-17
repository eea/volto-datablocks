export default () => ({
  title: 'Expandable datatable',
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: [
        'searchDescription',
        'popup_provider_url',
        // 'popupTitle',
        // 'popupDescription',
        // 'popupUrl',
        // 'popupTableData',
        // 'popupMapData',
      ],
    },
  ],
  properties: {
    searchDescription: {
      title: 'Search description',
      widget: 'textarea',
    },
    popup_provider_url: {
      title: 'Popup Data provider',
      widget: 'object_by_path',
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
