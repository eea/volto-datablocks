import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import qs from 'query-string';
import View from './View';
import DiscodataSqlBuilderEdit from 'volto-datablocks/DiscodataSqlBuilder/Edit';

const makeChoices = (keys) => keys && keys.map((k) => [k, k]);

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
  'pa-0',
  'pa-1',
  'pa-2',
  'pa-3',
  'float-left',
  'float-right',
  'clear-fix',
  'list-style-none',
];

const getSchema = (props) => {
  const { query } = props;
  const { search } = props.discodata_query;
  const { data } = props.discodata_resources;
  const globalQuery = { ...query, ...search };
  /* ===================== */
  const source_discodata_keys = props.data.source_discodata_keys?.value
    ? JSON.parse(props.data.source_discodata_keys?.value).properties
    : {};
  const components = props.data.components?.value
    ? JSON.parse(props.data.components?.value).properties
    : {};
  /* ===================== */
  const resourcePackageKey = props.data.resource_package_key?.value;
  const key = props.data.key?.value;
  const source = props.data.source?.value;
  const source_query_param = props.data.source_query_param?.value;
  const selectedResource =
    resourcePackageKey && !key
      ? data[resourcePackageKey]
      : resourcePackageKey && key
      ? data[resourcePackageKey]?.[globalQuery[key]]
      : data;
  let sourceData;
  if (
    selectedResource &&
    source &&
    Object.keys(source).length &&
    selectedResource[source] &&
    globalQuery[source_query_param] &&
    selectedResource[source][globalQuery[source_query_param]]
  ) {
    sourceData = selectedResource[source][globalQuery[source_query_param]];
  } else if (selectedResource && source && selectedResource[source]) {
    sourceData = selectedResource[source];
  }
  return {
    resource_package_key: {
      title: 'Resource package key',
      type: 'array',
      choices: data ? makeChoices(Object.keys(data)) : [],
    },
    key: {
      title: 'Key',
      type: 'array',
      choices: globalQuery ? makeChoices(Object.keys(globalQuery)) : [],
    },
    source: {
      title: 'Source',
      type: 'array',
      choices: selectedResource
        ? makeChoices(Object.keys(selectedResource))
        : [],
    },
    source_query_param: {
      title: 'Source query selector',
      type: 'array',
      choices: globalQuery ? makeChoices(Object.keys(globalQuery)) : [],
    },
    source_discodata_keys: {
      title: 'Source discodata keys',
      type: 'schema',
      fieldSetTitle: 'Source discodata keys metadata',
      fieldSetId: 'source_discodata_keys_metadata',
      fieldSetSchema: {
        fieldsets: [
          {
            id: 'default',
            title: 'title',
            fields: ['title', 'id', 'key'],
          },
        ],
        properties: {
          title: {
            title: 'Title',
            type: 'text',
          },
          id: {
            title: 'Id',
            type: 'text',
          },
          key: {
            title: 'Key',
            type: 'array',
            choices:
              sourceData && Array.isArray(sourceData)
                ? makeChoices(Object.keys(sourceData[0]))
                : sourceData
                ? makeChoices(Object.keys(sourceData))
                : [],
          },
        },
        required: ['id', 'title', 'key'],
      },
      editFieldset: false,
      deleteFieldset: false,
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
              'type',
              'static',
              'hasParent',
              'staticValue',
              'value',
              'urlValue',
              'queryToSet',
              'page',
              'maxElements',
              'placeholder',
              'valueClassName',
              'valueLabels',
              'valueLabelsClassName',
              'gridColumns',
              'className',
              'listItemClassName',
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
          type: {
            type: 'select',
            title: 'Component type',
            choices: [
              ['container', 'Container'],
              ['hr', 'Horizontal line'],
              ['header', 'Header'],
              ['select', 'Select'],
              ['linkHeader', 'Header link'],
              ['list', 'List'],
              ['linkList', 'List Link'],
              ['paragraph', 'Paragraph'],
              ['metadataGrid', 'Metadata grid'],
              ['table', 'Table'],
              ['banner', 'Banner'],
              ['eprtrCountrySelector', 'eprtrCountrySelector'],
              ['eprtrCountryGroupSelector', 'eprtrCountryGroupSelector'],
              ['eprtrBatDerogations', 'eprtrBatDerogations'],
              ['eprtrBatConclusions', 'eprtrBatConclusions'],
            ],
          },
          static: {
            type: 'boolean',
            title: 'Only static data',
            defaultValue: false,
            disabled: (formData) =>
              [
                'container',
                'hr',
                'metadataGrid',
                'table',
                'banner',
                'list',
                'linkList',
                'select',
              ].includes(formData.type),
          },
          hasParent: {
            type: 'boolean',
            title: 'Has parent',
            defaultValue: false,
          },
          staticValue: {
            type: 'text',
            title: 'Static value',
            disabled: (formData) =>
              [
                'container',
                'hr',
                'metadataGrid',
                'table',
                'banner',
                'list',
                'linkList',
                'select',
              ].includes(formData.type),
          },
          value: {
            type: (formData) => {
              if (['metadataGrid', 'table', 'banner'].includes(formData.type))
                return 'array';
              return 'select';
            },
            title: (formData) => {
              if (['metadataGrid', 'table', 'banner'].includes(formData.type))
                return 'Metadata fields';
              return 'Metadata field';
            },
            items: (formData) => {
              if (['metadataGrid', 'table', 'banner'].includes(formData.type)) {
                return {
                  choices: selectedResource
                    ? makeChoices(Object.keys(selectedResource))
                    : [],
                };
              }
              return undefined;
            },
            choices: (formData) => {
              if (!['metadataGrid', 'table', 'banner'].includes(formData.type))
                return selectedResource
                  ? makeChoices(Object.keys(selectedResource))
                  : [];
              return undefined;
            },
            description: (formData) => {
              if (['metadataGrid', 'table', 'banner'].includes(formData.type))
                return "If you want to add multiple columns for the same metadata field use '@{unique id}' suffix";
              return undefined;
            },
            disabled: (formData) =>
              formData.static || ['container', 'hr'].includes(formData.type),
          },
          urlValue: {
            type: (formData) => {
              if (['linkList', 'select'].includes(formData.type)) return 'text';
              return 'select';
            },
            title: (formData) => {
              if (['linkList', 'select'].includes(formData.type))
                return 'Query to use';
              return 'URL metadata field';
            },
            choices: (formData) => {
              if (['linkList', 'select'].includes(formData.type))
                return undefined;
              return selectedResource
                ? makeChoices(Object.keys(selectedResource))
                : [];
            },
            disabled: (formData) =>
              !['linkHeader', 'linkList', 'select'].includes(formData.type),
          },
          queryToSet: {
            type: 'text',
            title: 'Query to set',
            disabled: (formData) =>
              !['linkHeader', 'linkList', 'select'].includes(formData.type),
          },
          page: {
            type: 'text',
            title: 'Go to page',
            disabled: (formData) =>
              !['linkHeader', 'linkList', 'select'].includes(formData.type),
          },
          maxElements: {
            type: 'text',
            title: 'Max elements',
            disabled: (formData) => !['linkList'].includes(formData.type),
          },
          placeholder: {
            type: 'text',
            title: 'Placeholder',
            disabled: (formData) => !['select'].includes(formData.type),
          },
          valueClassName: {
            type: 'array',
            title: 'Class names for metadata fields',
            items: {
              choices: makeChoices(classNames),
            },
            disabled: (formData) =>
              !['metadataGrid', 'table', 'banner'].includes(formData.type),
          },
          valueLabels: {
            type: 'array',
            title: 'Labels for metadata fields',
            disabled: (formData) =>
              !['metadataGrid', 'table', 'banner'].includes(formData.type),
          },
          valueLabelsClassName: {
            type: 'array',
            title: 'Class names for labels of metadata fields',
            items: {
              choices: makeChoices(classNames),
            },
            disabled: (formData) =>
              !['metadataGrid', 'table', 'banner'].includes(formData.type),
          },
          gridColumns: {
            type: 'text',
            title: 'Grid columns',
            disabled: (formData) => !['metadataGrid'].includes(formData.type),
          },
          className: {
            type: 'array',
            title: 'Class name',
            items: {
              choices: makeChoices(classNames),
            },
            disabled: (formData) => ['container'].includes(formData.type),
          },
          listItemClassName: {
            type: 'array',
            title: 'List item class name',
            items: {
              choices: makeChoices(classNames),
            },
            disabled: (formData) =>
              !['list', 'linkList'].includes(formData.type),
          },
          wrapperClassName: {
            type: 'array',
            title: 'Wrapper class name',
            items: {
              choices: makeChoices(classNames),
            },
            disabled: (formData) =>
              ['metadataGrid', 'table', 'banner'].includes(formData.type),
          },
          parent: {
            type: 'select',
            title: 'Parent',
            disabled: (formData) => !formData.hasParent,
            choices: (formData) => {
              const components_filtered = { ...components };
              components_filtered[formData.id] &&
                delete components_filtered[formData.id];
              return makeChoices(Object.keys(components_filtered));
            },
          },
        },
        required: (formData) => {
          const requiredFields = ['title', 'id', 'type'];
          if (['metadataGrid', 'table', 'banner'].includes(formData.type))
            requiredFields.push('valueLabels');
          if (['linkHeader', 'linkList', 'select'].includes(formData.type))
            requiredFields.push('urlValue', 'queryToSet');
          if (!formData.static && !['container', 'hr'].includes(formData.type))
            requiredFields.push('value');
          return requiredFields;
        },
      },
      editFieldset: false,
      deleteFieldset: false,
    },
    requiredQueries: {
      title: 'Required queries',
      type: 'array',
      items: {
        choices: [],
      },
    },
  };
};

const Edit = (props) => {
  const [state, setState] = useState({
    schema: getSchema({ ...props }),
  });
  useEffect(() => {
    setState({
      ...state,
      schema: getSchema({
        ...props,
      }),
    });
    /* eslint-disable-next-line */
  }, [props.data, props.discodata_resources, props.discodata_query.search])
  return (
    <DiscodataSqlBuilderEdit
      {...props}
      optionalSchema={state.schema}
      title="Discodata components block"
    >
      <h3>Discodata components - edit mode</h3>
      <View {...props} mode="edit" />
    </DiscodataSqlBuilderEdit>
  );
};

export default compose(
  connect((state, props) => ({
    query: qs.parse(state.router.location.search),
    pathname: state.router.location.pathname,
    discodata_resources: state.discodata_resources,
    discodata_query: state.discodata_query,
  })),
)(Edit);
