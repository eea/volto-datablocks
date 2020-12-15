import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import _uniqueId from 'lodash/uniqueId';
import qs from 'query-string';
import RenderFields from '../Utils/RenderFields';
import { settings } from '~/config';

import View from './View';

const makeChoices = (keys) => keys && keys.map((k) => [k, k]);

const getSchema = (props) => {
  if (!props) return {};
  const { query } = props;
  const { search } = props.discodata_query;
  const sqls = props.data?.sql?.value
    ? JSON.parse(props.data.sql.value).properties
    : {};
  const whereStatements = props.data?.where?.value
    ? JSON.parse(props.data.where.value).properties
    : {};
  const providerUrlDescription = {};
  const globalQuery = { ...query, ...search };
  sqls &&
    Object.entries(sqls).forEach(([sqlKey, sqlValue]) => {
      let whereArray = [];
      providerUrlDescription[sqlKey] = sqlValue.sql;
      Object.entries(whereStatements).forEach(([whereKey, whereValue]) => {
        if (whereValue.sqlId === sqlKey) {
          whereArray.push(
            `WHERE ${whereValue.key} LIKE ${
              query?.[whereValue.queryParam] || ''
            }`,
          );
        }
      });
      if (whereArray.length) {
        providerUrlDescription[sqlKey] += ' ' + whereArray.join(' AND ');
      }
    });
  return {
    importExport: {
      title: 'Import/Export block data',
      type: 'import-export',
    },
    provider_url: {
      title: 'Provider url',
      type: 'text',
      defaultValue: props.providerUrl,
      description: Object.entries(providerUrlDescription).map(
        ([sql, value]) => (
          <React.Fragment key={`${sql}_description`}>
            <span style={{ display: 'block', marginBottom: '1em' }}>
              {value}
            </span>
          </React.Fragment>
        ),
      ),
    },
    sql: {
      title: 'SQL',
      type: 'schema',
      fieldSetTitle: 'SQL metadata',
      fieldSetId: 'sql_metadata',
      fieldSetSchema: {
        fieldsets: [
          {
            id: 'default',
            title: 'title',
            fields: [
              'title',
              'id',
              'isCollection',
              'hasPagination',
              'urlQuery',
              'sql',
              'packageName',
            ],
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
          isCollection: {
            title: 'Collection',
            type: 'boolean',
            defaultValue: false,
          },
          hasPagination: {
            title: 'Pagination',
            type: 'boolean',
            defaultValue: true,
            disabled: (formData) => !formData.isCollection,
          },
          urlQuery: {
            title: 'Use Query from url',
            type: 'boolean',
            defaultValue: true,
            disabled: (formData) => formData.isCollection,
          },
          sql: {
            title: 'SQL',
            widget: 'textarea',
          },
          packageName: {
            title: 'Package discodata key name',
            type: (formData) => (!formData.urlQuery ? 'text' : 'array'),
            choices: (formData) => {
              if (!formData.urlQuery) return undefined;
              return globalQuery ? makeChoices(Object.keys(globalQuery)) : [];
            },
            disabled: (formData) => formData.isCollection,
          },
        },
        required: (formData) => {
          if (!formData.isCollection)
            return ['title', 'id', 'sql', 'packageName'];
          return ['title', 'id', 'sql'];
        },
      },
      editFieldset: false,
      deleteFieldset: false,
    },
    where: {
      title: 'Where statements',
      type: 'schema',
      fieldSetTitle: 'Where statements metadata',
      fieldSetId: 'where_statements_metadata',
      fieldSetSchema: {
        fieldsets: [
          {
            id: 'default',
            title: 'title',
            fields: [
              'title',
              'id',
              'sqlId',
              'isExact',
              'urlQuery',
              'key',
              'queryParam',
              'regex',
              'collation',
            ],
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
          sqlId: {
            title: 'For sql',
            type: 'array',
            choices: sqls ? makeChoices(Object.keys(sqls)) : [],
          },
          isExact: {
            title: 'Is exact',
            type: 'boolean',
            defaultValue: false,
          },
          urlQuery: {
            title: 'Use Query from url',
            type: 'boolean',
            defaultValue: true,
          },
          key: {
            title: 'Query to set',
            type: (formData) => (!formData.urlQuery ? 'text' : 'array'),
            choices: (formData) => {
              if (!formData.urlQuery) return undefined;
              return globalQuery ? makeChoices(Object.keys(globalQuery)) : [];
            },
          },
          queryParam: {
            title: 'Query to use',
            type: (formData) => (!formData.urlQuery ? 'text' : 'array'),
            choices: (formData) => {
              if (!formData.urlQuery) return undefined;
              return globalQuery ? makeChoices(Object.keys(globalQuery)) : [];
            },
          },
          regex: {
            title: 'Regex',
            type: 'array',
            choices: [
              ['%:value%', '%Value%'],
              [':value%', 'Value%'],
              ['%:value', '%Value'],
            ],
          },
          collation: {
            title: 'Collaltion',
            type: 'array',
            choices: [
              ['_', 'No value'],
              ['latin_ci_ai', 'Latin_CI_AI'],
              ['latin_ci_as', 'Latin_CI_AS'],
            ],
          },
        },
        required: ['id', 'title', 'sqlId', 'key', 'queryParam'],
      },
      editFieldset: false,
      deleteFieldset: false,
    },
    groupBy: {
      title: 'Group by statements',
      type: 'schema',
      fieldSetTitle: 'Group by statements metadata',
      fieldSetId: 'group_by_statements_metadata',
      fieldSetSchema: {
        fieldsets: [
          {
            id: 'default',
            title: 'title',
            fields: ['title', 'id', 'sqlId', 'discodataKey', 'key'],
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
          sqlId: {
            title: 'For sql',
            type: 'array',
            choices: sqls ? makeChoices(Object.keys(sqls)) : [],
          },
          discodataKey: {
            title: 'Discodata query param',
            type: 'text',
          },
          key: {
            title: 'Resource package key',
            type: 'text',
          },
        },
        required: ['id', 'title', 'sqlId', 'discodataKey', 'key'],
      },
      editFieldset: false,
      deleteFieldset: false,
    },
    ...props.optionalSchema,
  };
};

const Edit = (props) => {
  const [state, setState] = useState({
    schema: getSchema({ ...props, providerUrl: settings.providerUrl }),
    id: _uniqueId('block_'),
  });
  useEffect(() => {
    setState({
      ...state,
      schema: getSchema({
        ...props,
        providerUrl: settings.providerUrl,
      }),
    });
    /* eslint-disable-next-line */
  }, [
    props.data,
    props.discodata_resources,
    props.discodata_query.search,
    props.optionalSchema,
  ]);
  return (
    // <div>
    <>
      <RenderFields
        schema={state.schema}
        {...props}
        title={props.title || 'Discodata sql builder'}
      />
      {props.children || <View {...props} mode="edit-no-children" />}
    </>
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
