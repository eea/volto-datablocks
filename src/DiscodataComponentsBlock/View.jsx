import React, { useState, useEffect } from 'react';
import _uniqueId from 'lodash/uniqueId';
import { connect } from 'react-redux';
import { compose } from 'redux';
import moment from 'moment';
import { arrayToTree } from 'performant-array-to-tree';
import qs from 'query-string';
import { Table } from 'semantic-ui-react';
import './style.css';
import DB from 'volto-datablocks/DataBase/DB';

import { settings } from '~/config';

import { getDiscodataResource } from '../actions';

const renderComponents = {
  wrapper: function(tree, item) {
    if (!tree.children || tree.children.length === 0) {
      return (
        <React.Fragment key={`data-wrapper-${tree.data?.id}`}>
          {this[tree.data.type]({
            component: tree.data,
            item,
          })}
        </React.Fragment>
      );
    } else if (tree.children.length > 0) {
      return (
        <div
          className={tree.data.wrapperClassName?.join(' ')}
          key={`data-wrapper-${tree.data.id}`}
        >
          {this[tree.data.type]({
            component: tree.data,
            item,
          })}
          {tree.children.map(child => {
            if (child.children?.length > 0) {
              return this.wrapper(child, item);
            }
            return (
              renderComponents[child.data.type] && (
                <React.Fragment key={`children-${child.data.id}`}>
                  {this[child.data.type]({
                    component: child.data,
                    item,
                  })}
                </React.Fragment>
              )
            );
          })}
        </div>
      );
    }
  },
  container: props => {
    return '';
  },
  hr: props => {
    return (
      <div className={`hr ${props.component?.className?.join(' ') || ''}`} />
    );
  },
  header: props => {
    let value = props.item?.[props.component?.value];
    if (value && !isNaN(Date.parse(value)) && value.length >= 10) {
      value = moment(props.item[value]).format('DD MMM YYYY');
    }
    const text = props.component?.static
      ? props.component?.staticValue
      : props.component?.staticValue
      ? `${props.component?.staticValue} ${value}`
      : value;
    const view = (
      <h1 className={props.component?.className?.join(' ') || ''}>{text}</h1>
    );
    return text && props ? view : '';
  },
  linkHeader: props => {
    let value = props.item?.[props.component?.value];
    if (value && !isNaN(Date.parse(value)) && value.length >= 10) {
      value = moment(props.item[value]).format('DD MMM YYYY');
    }
    const text = props.component?.static
      ? props.component?.staticValue
      : props.component?.staticValue
      ? `${props.component?.staticValue} ${value}`
      : value;
    const view = (
      <a
        href={
          props.component?.static
            ? props.component?.urlValue
            : props.item[(props.component?.urlValue)]
        }
        className={props.component?.className?.join(' ') || ''}
      >
        <h1>{text}</h1>
      </a>
    );
    return text && props ? view : '';
  },
  paragraph: props => {
    let value = props.item?.[props.component?.value];
    if (value && !isNaN(Date.parse(value)) && value.length >= 10) {
      value = moment(props.item[value]).format('DD MMM YYYY');
    }
    const text = props.component?.static
      ? props.component?.staticValue
      : props.component?.staticValue
      ? `${props.component?.staticValue} ${value}`
      : value;
    const view = (
      <p className={props.component?.className?.join(' ') || ''}>{text}</p>
    );
    return text && props ? view : '';
  },
  list: props => {
    let value = props.item?.[props.component?.value];
    let items = [];
    if (Array.isArray(value)) {
      items = [...value];
    } else if (value && Object.keys(value).length) {
      items = Object.keys(value);
    }
    const view = (
      <ul className={props.component?.className?.join(' ') || ''}>
        {items.map(value => (
          <li
            key={_uniqueId('li-')}
            className={props.component?.listItemClassName?.join(' ') || ''}
          >
            {value}
          </li>
        ))}
      </ul>
    );
    return view;
  },
  banner: props => {
    return props.item && props.component ? (
      <div className={`banner flex ${props.component?.className?.join(' ')}`}>
        {props.component.value &&
          props.component.value?.map((metadataField, index) => {
            const key = metadataField.split('@')[0];
            const labelsClassName = props.component.valueLabelsClassName?.[
              index
            ]?.split('@')?.[0];
            const valueClassName = props.component.valueClassName?.[
              index
            ]?.split('@')?.[0];
            return (
              props.item[key] && (
                <div className="flex-item">
                  {props.component.valueLabels?.[index] && (
                    <p className={labelsClassName}>
                      {props.component.valueLabels[index]}
                    </p>
                  )}
                  <p className={valueClassName}>
                    {!isNaN(Date.parse(props.item[key])) &&
                    props.item[key].length >= 10
                      ? moment(props.item[key]).format('DD MMM YYYY')
                      : props.item[key]}
                  </p>
                </div>
              )
            );
          })}
      </div>
    ) : (
      ''
    );
  },
  metadataGrid: props => {
    return props.item && props.component ? (
      <div
        className={`grid responsive metadata grid-cl-${
          props.component?.gridColumns
        } ${props.component?.className?.join(' ')}`}
      >
        {props.component.value &&
          props.component.value?.map((metadataField, index) => {
            const key = metadataField.split('@')[0];
            const labelsClassName = props.component.valueLabelsClassName?.[
              index
            ]?.split('@')?.[0];
            const valueClassName = props.component.valueClassName?.[
              index
            ]?.split('@')?.[0];
            return (
              <div key={`metadata-${index}-${metadataField}`}>
                {props.component.valueLabels?.[index] && (
                  <p className={`mb-0 ${labelsClassName}`}>
                    {props.component.valueLabels[index]}
                  </p>
                )}
                <p className={valueClassName}>
                  {!isNaN(Date.parse(props.item[key])) &&
                  props.item[key].length >= 10
                    ? moment(props.item[key]).format('DD MMM YYYY')
                    : props.item[key]}
                </p>
              </div>
            );
          })}
      </div>
    ) : (
      ''
    );
  },
  table: props => {
    return props.item && props.component ? (
      <div className={`table ${props.component?.className?.join(' ')}`}>
        {props.component.value && (
          <Table>
            {/* ==== TABLE HEADER ==== */}
            <Table.Header>
              <Table.Row>
                {props.component.valueLabels &&
                  props.component.valueLabels.map((header, index) => (
                    <Table.HeaderCell
                      key={`header-${header}`}
                      className={props.component.valueLabelsClassName?.[index]}
                    >
                      {header}
                    </Table.HeaderCell>
                  ))}
              </Table.Row>
            </Table.Header>
            {/* ==== TABLE BODY ==== */}
            {/* <Table.Body>
              {props.component.value.map((row, index) => (
                <Table.Row
                  key={`tr-${index}`}
                  className={props.component.valueClassName?.[index]}
                >
                  {Object.keys(row).map(cell => (
                    <Table.Cell key={`cell-${cell}`}>{row[cell]}</Table.Cell>
                  ))}
                </Table.Row>
              ))}
            </Table.Body> */}
          </Table>
        )}
      </div>
    ) : (
      ''
    );
  },
};

const View = props => {
  // providerUrl
  const [state, setState] = useState({
    item: {},
  });
  const { data } = props;
  const discodata = { ...props.discodata_query.data };
  const { additional_sql, sql, resource_key, key, where, groupBy } = data;
  useEffect(() => {
    if (
      additional_sql?.value === true &&
      sql?.value &&
      resource_key?.value &&
      key?.value &&
      where?.value
    ) {
      const whereStatements = where.value
        ? JSON.parse(where.value).properties
        : {};
      const groupByStatements = groupBy?.value
        ? JSON.parse(groupBy.value).properties
        : {};
      const url = DB.table(sql.value, settings.providerUrl, {
        p: props.query.p,
        nrOfHits: props.query.nrOfHits,
      })
        .where(
          whereStatements &&
            Object.entries(whereStatements).map(([key, where]) => {
              return {
                discodataKey: where.queryParam,
                value: props.discodata_query.data?.search?.[where.queryParam],
              };
            }),
        )
        .encode()
        .get();
      if (
        discodata?.search?.[key.value] &&
        !props.discodata_resources.data[resource_key.value]?.[
          discodata?.search?.[key.value]
        ] &&
        !props.discodata_resources.pendingRequests[
          `${resource_key.value}_${key.value}_${discodata.search?.[key.value]}`
        ]
      ) {
        const request = {
          url,
          search: discodata.search || {},
          resourceKey: resource_key.value || '',
          key: key.value || '',
          groupBy: groupByStatements
            ? Object.entries(groupByStatements).map(([key, group]) => {
                return {
                  discodataKey: group.discodataKey,
                  key: group.key,
                };
              })
            : [],
        };
        props.getDiscodataResource(request);
      }
    }
    /* eslint-disable-next-line */
  }, [additional_sql])
  useEffect(() => {
    const __1_selectedDiscodataResource =
      props.discodata_resources.data?.[props.data.resource_key?.value]?.[
        discodata.search[(props.data.key?.value)]
      ] || null;
    const __2_selectedDiscodataResource =
      props.discodata_resources.data?.[discodata.resourceKey]?.[
        discodata.search?.[discodata.key]
      ] || null;
    const item = {
      ...__1_selectedDiscodataResource,
      additional_results: [
        ...(__1_selectedDiscodataResource?.results
          ? __1_selectedDiscodataResource.results
          : []),
      ],
      ...__2_selectedDiscodataResource,
      results: [
        ...(__2_selectedDiscodataResource?.results
          ? __2_selectedDiscodataResource.results
          : []),
      ],
    };
    setState({ ...state, item });
    /* eslint-disable-next-line */
  }, [props.data, props.discodata_resources])
  //  Render components
  const componentsSchema =
    data?.components?.value && JSON.parse(data?.components?.value);
  const components = {};
  componentsSchema?.fieldsets?.[0]?.fields &&
    componentsSchema.fieldsets[0].fields.forEach(component => {
      components[component] = {
        ...componentsSchema.properties[component],
      };
    });
  const componentsArray =
    components &&
    Object.keys(components).map((key, index) => {
      return {
        ...components[key],
        id: key,
        parentId: components[key].parent || null,
      };
    });
  let root = arrayToTree(componentsArray);
  return (
    <div className="facility-block-wrapper">
      <div className="" style={{ padding: '2rem', overflow: 'auto' }}>
        {state.item &&
          root.map(tree => renderComponents.wrapper(tree, state.item))}
      </div>
    </div>
  );
};

export default compose(
  connect(
    (state, props) => ({
      query: qs.parse(state.router.location.search),
      pathname: state.router.location.pathname,
      discodata_resources: state.discodata_resources,
      discodata_query: state.discodata_query,
    }),
    { getDiscodataResource },
  ),
)(View);
