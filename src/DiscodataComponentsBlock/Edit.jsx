import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import _uniqueId from 'lodash/uniqueId';
import RenderFields from 'volto-addons/Widgets/RenderFields';
import View from './View';
import { settings } from '~/config';

const makeChoices = keys => keys && keys.map(k => [k, k]);

const classNames = [
  'flex',
  'grid',
  'display-block',
  'responsive',
  'flex-row',
  'flex-column',
  'align-center',
  'space-between',
  'light-blue',
  'bold',
  'lighter',
  'info',
  'mt-0',
  'mt-1',
  'mt-2',
  'mt-3',
  'mb-0',
  'mb-1',
  'mb-2',
  'mb-3',
  'ml-0',
  'ml-1',
  'ml-2',
  'ml-3',
  'mr-0',
  'mr-1',
  'mr-2',
  'mr-3',
  'w-40',
  'w-50',
  'w-60',
  'w-70',
  'w-80',
  'w-90',
  'w-100',
  'float-left',
  'float-right',
  'clear-fix',
];

const getSchema = props => {
  const item = { ...props.item };
  const components = props.data.components?.value
    ? JSON.parse(props.data.components?.value).properties
    : {};
  return {
    provider_url: {
      title: 'Provider url',
      type: 'text',
      defaultValue: props.providerUrl,
    },
    sql: {
      title: 'SQL Select',
      type: 'sql',
      selectQueryFields: [
        { title: 'Table', id: 'table' },
        { title: 'Where column', id: 'columnKey' },
        { title: 'Is equal to', id: 'columnValue' },
      ],
      additionalQueryFields: [
        { title: 'Where column', id: 'columnKey' },
        { title: 'Is equal to', id: 'columnValue' },
      ],
    },
    components: {
      title: 'Components',
      type: 'schema',
      fieldSetTitle: 'Components metadata',
      fieldSetId: 'components_metadata',
      fieldSetSchema: {
        fieldsets: [
          {
            id: 'default',
            title: 'title',
            fields: [
              'title',
              'id',
              'static',
              'staticValue',
              'value',
              'urlValue',
              'valueClassName',
              'valueLabels',
              'valueLabelsClassName',
              'type',
              'gridColumns',
              'className',
              'hasParent',
              'wrapperClassName',
              'parent',
            ],
          },
        ],
        properties: {
          title: {
            type: 'text',
            title: 'Title',
          },
          id: {
            type: 'text',
            title: 'Id',
          },
          static: {
            type: 'boolean',
            title: 'Only static data',
            defaultValue: false,
            disabled: formData =>
              ['container', 'hr', 'metadataGrid', 'table', 'banner'].includes(
                formData.type,
              ),
          },
          staticValue: {
            type: 'text',
            title: 'Static value',
            disabled: formData =>
              ['container', 'hr', 'metadataGrid', 'table', 'banner'].includes(
                formData.type,
              ),
          },
          value: {
            type: formData => {
              if (['metadataGrid', 'table', 'banner'].includes(formData.type))
                return 'array';
              return 'select';
            },
            title: formData => {
              if (['metadataGrid', 'banner'].includes(formData.type))
                return 'Metadata fields';
              return 'Metadata field';
            },
            items: formData => {
              if (['metadataGrid', 'table', 'banner'].includes(formData.type)) {
                return {
                  choices: item ? makeChoices(Object.keys(item)) : [],
                };
              }
              return undefined;
            },
            choices: formData => {
              if (!['metadataGrid', 'table', 'banner'].includes(formData.type))
                return item ? makeChoices(Object.keys(item)) : [];
              return undefined;
            },
            description: formData => {
              if (['metadataGrid', 'table', 'banner'].includes(formData.type))
                return "If you want to add multiple columns for the same metadata field use '@{unique id}' suffix";
              return undefined;
            },
            disabled: formData =>
              formData.static || ['container', 'hr'].includes(formData.type),
          },
          urlValue: {
            type: formData => {
              return 'select';
            },
            title: formData => {
              return 'URL metadata field';
            },
            choices: formData => {
              return item ? makeChoices(Object.keys(item)) : [];
            },
            disabled: formData => !['linkHeader'].includes(formData.type),
          },
          valueClassName: {
            type: 'array',
            title: 'Class names for metadata fields',
            items: {
              choices: makeChoices(classNames),
            },
            disabled: formData =>
              !['metadataGrid', 'table', 'banner'].includes(formData.type),
          },
          valueLabels: {
            type: 'array',
            title: 'Labels for metadata fields',
            disabled: formData =>
              !['metadataGrid', 'table', 'banner'].includes(formData.type),
          },
          valueLabelsClassName: {
            type: 'array',
            title: 'Class names for labels of metadata fields',
            items: {
              choices: makeChoices(classNames),
            },
            disabled: formData =>
              !['metadataGrid', 'table', 'banner'].includes(formData.type),
          },
          type: {
            type: 'select',
            title: 'Component type',
            choices: [
              ['container', 'Container'],
              ['hr', 'Horizontal line'],
              ['header', 'Header'],
              ['linkHeader', 'Header link'],
              ['paragraph', 'Paragraph'],
              ['metadataGrid', 'Metadata grid'],
              ['table', 'Table'],
              ['banner', 'Banner'],
            ],
          },
          gridColumns: {
            type: 'text',
            title: 'Grid columns',
            disabled: formData => !['metadataGrid'].includes(formData.type),
          },
          className: {
            type: 'array',
            title: 'Class name',
            items: {
              choices: makeChoices(classNames),
            },
            disabled: formData => ['container'].includes(formData.type),
          },
          hasParent: {
            type: 'boolean',
            title: 'Has parent',
            defaultValue: false,
          },
          wrapperClassName: {
            type: 'array',
            title: 'Wrapper class name',
            items: {
              choices: makeChoices(classNames),
            },
            disabled: formData =>
              ['metadataGrid', 'table', 'banner'].includes(formData.type),
          },
          parent: {
            type: 'select',
            title: 'Parent',
            disabled: formData => !formData.hasParent,
            choices: formData => {
              const components_filtered = { ...components };
              components_filtered[formData.id] &&
                delete components_filtered[formData.id];
              return makeChoices(Object.keys(components_filtered));
            },
          },
        },
        required: formData => {
          const requiredFields = ['title', 'id', 'type'];
          if (['metadataGrid', 'table', 'banner'].includes(formData.type))
            requiredFields.push('valueLabels');
          if (formData.type === 'linkHeader') requiredFields.push('urlValue');
          if (!formData.static && !['container', 'hr'].includes(formData.type))
            requiredFields.push('value');
          return requiredFields;
        },
      },
      editFieldset: false,
      deleteFieldset: false,
    },
  };
};

const Edit = props => {
  const [state, setState] = useState({
    schema: getSchema({ ...props, providerUrl: settings.providerUrl }),
    id: _uniqueId('block_'),
  });
  useEffect(() => {
    setState({
      ...state,
      schema: getSchema({
        ...props,
        item: state.item,
        providerUrl: settings.providerUrl,
      }),
    });
    /* eslint-disable-next-line */
  }, [state.item, props.data.components])
  return (
    <div>
      <RenderFields
        schema={state.schema}
        {...props}
        title="Discodata components block"
      />
      <View
        {...props}
        id={state.id}
        updateEditState={newState => {
          if (newState.items?.[0]) {
            setState({ ...state, item: { ...newState.items[0] } });
          }
        }}
      />
    </div>
  );
};

export default compose(
  connect((state, props) => ({
    pathname: state.router.location.pathname,
  })),
)(Edit);
