export const defaultOperations = [
  'plone.app.querystring.operation.selection.is',
  'plone.app.querystring.operation.selection.any',
  'plone.app.querystring.operation.selection.all',
];

export const defaultOperators = {
  'plone.app.querystring.operation.selection.is': {
    description: 'Tip: you can use * to autocomplete.',
    operation: 'plone.app.querystring.queryparser._equal',
    title: 'Matches value',
    widget: 'TextWidget',
  },
  'plone.app.querystring.operation.selection.all': {
    description: 'Tip: you can use * to autocomplete.',
    operation: 'plone.app.querystring.queryparser._all',
    title: 'Matches all of',
    widget: 'MultipleSelectionWidget',
  },
  'plone.app.querystring.operation.selection.any': {
    description: 'Tip: you can use * to autocomplete.',
    operation: 'plone.app.querystring.queryparser._contains',
    title: 'Matches any of',
    widget: 'MultipleSelectionWidget',
  },
};
