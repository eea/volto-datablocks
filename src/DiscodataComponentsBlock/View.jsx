import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import moment from 'moment';
import { arrayToTree } from 'performant-array-to-tree';
import { settings } from '~/config';
import DB from '../DataBase/DB';
import { Table } from 'semantic-ui-react';
import './style.css';

const renderComponents = {
  wrapper: function(tree, item) {
    if (!tree.children || tree.children.length === 0) {
      return this[tree.data.type]({
        component: tree.data,
        item,
      });
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
  const [state, setState] = useState({
    loaded: false,
    loading: false,
    errors: [],
    items: [],
  });
  const { data } = props;
  const selectQuery = data?.sql?.selectQuery;
  const additionalQuery = data?.sql?.additionalQuery;
  const providerUrl = data?.providerUrl || settings.providerUrl || null;
  //  Update Edit
  useEffect(() => {
    if (props.updateEditState) {
      props.updateEditState({ items: state.items });
    }
    /* eslint-disable-next-line */
  }, [state]);
  //  Fetch items
  useEffect(() => {
    let isMounted = true;
    if (
      isMounted &&
      selectQuery?.table &&
      selectQuery?.columnKey &&
      selectQuery?.columnValue &&
      providerUrl &&
      !state.loading
    ) {
      setState({ ...state, loading: true });
      DB.table(providerUrl, selectQuery.table)
        .get()
        .where(selectQuery?.columnKey, selectQuery?.columnValue)
        .where(additionalQuery?.columnKey, additionalQuery?.columnValue)
        .makeRequest()
        .then(response => {
          if (isMounted) {
            setState({
              ...state,
              loaded: true,
              loading: false,
              errors: [],
              items: response.data.results,
            });
          }
        })
        .catch(errors => {
          if (isMounted) {
            setState({
              loaded: false,
              loading: false,
              errors: errors,
              items: [],
            });
          }
        });
    }
    return () => {
      isMounted = false;
    };
    /* eslint-disable-next-line */
}, [data?.sql, data?.provider_url])
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
        {state.items?.[0] &&
          root.map(tree => renderComponents.wrapper(tree, state.items[0]))}
      </div>
    </div>
  );
};

export default compose(
  connect((state, props) => ({
    pathname: state.router.location.pathname,
  })),
)(View);
