import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import _uniqueId from 'lodash/uniqueId';
import { connect } from 'react-redux';
import { compose } from 'redux';
import moment from 'moment';
import { arrayToTree } from 'performant-array-to-tree';
import qs from 'query-string';
import { Table, Dropdown, List, Header } from 'semantic-ui-react';
import './style.css';
import DiscodataSqlBuilderView from 'volto-datablocks/DiscodataSqlBuilder/View';
import { setQueryParam, deleteQueryParam } from 'volto-datablocks/actions';
import cx from 'classnames';
import Icon from '@plone/volto/components/theme/Icon/Icon';
import infoSVG from '@plone/volto/icons/info.svg';
import blankSVG from '@plone/volto/icons/blank.svg';

const renderComponents = {
  wrapper: function (tree, item, props) {
    if (!tree.children || tree.children.length === 0) {
      return (
        <React.Fragment key={`data-wrapper-${tree.data?.id}`}>
          {this[tree.data.type]({
            component: tree.data,
            item,
            ...props,
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
            ...props,
          })}
          {tree.children.map((child) => {
            if (child.children?.length > 0) {
              return this.wrapper(child, item, props);
            }
            return (
              renderComponents[child.data.type] && (
                <React.Fragment key={`children-${child.data.id}`}>
                  {this[child.data.type]({
                    component: child.data,
                    item,
                    ...props,
                  })}
                </React.Fragment>
              )
            );
          })}
        </div>
      );
    }
  },
  container: (props) => {
    return '';
  },
  hr: (props) => {
    return (
      <div className={`hr ${props.component?.className?.join(' ') || ''}`} />
    );
  },
  header: (props) => {
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
  linkHeader: (props) => {
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
            : props.item[props.component?.urlValue]
        }
        className={props.component?.className?.join(' ') || ''}
      >
        <h1>{text}</h1>
      </a>
    );
    return text && props ? view : '';
  },
  select: (props) => {
    let value = props.item?.[props.component?.value];
    const options =
      value &&
      Object.keys(value)
        .filter((key) => key)
        .map((key) => {
          return { key: key, value: key, text: key };
        });
    const trigger = (
      <span>
        {props.globalQuery?.[props.component?.urlValue] ||
          props.component?.placeholder ||
          ''}
      </span>
    );
    const view = (
      <Dropdown
        trigger={trigger}
        onChange={(event, data) => {
          if (props.component?.urlValue) {
            props.setQueryParam &&
              typeof props.setQueryParam === 'function' &&
              props.setQueryParam({
                queryParam: {
                  [props.component.urlValue]: data.value,
                },
              });
          }
        }}
        className={props.component?.className?.join(' ') || ''}
        options={options}
      />
    );
    return view;
  },
  paragraph: (props) => {
    let value = props.item?.[props.component?.value];
    if (value && !isNaN(Date.parse(value)) && value.length >= 10) {
      value = moment(props.item[value]).format('DD MMM YYYY');
    }
    const text = props.component?.static
      ? props.component?.staticValue
      : props.component?.staticValue
      ? `${props.component?.staticValue} ${value || '-'}`
      : value || '-';
    const view = (
      <p className={props.component?.className?.join(' ') || ''}>{text}</p>
    );
    return text && props ? view : '';
  },
  list: (props) => {
    let value = props.item?.[props.component?.value];
    let items = [];
    if (Array.isArray(value)) {
      items = [...value];
    } else if (value && Object.keys(value).length) {
      items = Object.keys(value);
    }
    const view = (
      <ul className={props.component?.className?.join(' ') || ''}>
        {items.map((value) => (
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
  linkList: (props) => {
    let value = props.item?.[props.component?.value];
    let items = [];
    if (Array.isArray(value)) {
      items = [...value];
    } else if (value && Object.keys(value).length) {
      items = Object.keys(value);
    }
    const maxElements = parseInt(props.component.maxElements) || 0;
    if (maxElements && props.globalQuery.listFilter) {
      items = items
        .sort(
          (a, b) =>
            b[props.globalQuery.listFilter] - a[props.globalQuery.listFilter],
        )
        .slice(0, maxElements);
    }
    const view = (
      <ol
        className={cx(
          'link-list responsive grid grid-cl-4',
          props.component?.className?.join(' '),
        )}
      >
        {items.map((value) => (
          <li key={_uniqueId('li-')}>
            <button
              style={{ cursor: 'pointer' }}
              className={props.component?.listItemClassName?.join(' ') || ''}
              onClick={() => {
                props.setQueryParam &&
                  typeof props.setQueryParam === 'function' &&
                  props.setQueryParam({
                    queryParam: {
                      [props.component.queryToSet]:
                        typeof value === 'object'
                          ? value[props.component?.urlValue]
                          : value,
                    },
                  });
                if (props.component.page) {
                  props.history.push(props.component.page);
                }
              }}
            >
              {typeof value === 'object'
                ? value[props.component?.urlValue]
                : value}
            </button>
          </li>
        ))}
      </ol>
    );
    return view;
  },
  banner: (props) => {
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
  metadataGrid: (props) => {
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
  table: (props) => {
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
  eprtrCountrySelector: (props) => {
    const items =
      props.item?.[props.component.value]?.map((item) => {
        return {
          key: item.CountryCode,
          value: item.CountryName,
          text: item.CountryName,
        };
      }) || [];
    return (
      <div className="eprtrSelection">
        <Header as="h1">Industrial pollution in</Header>
        <div className="selector-container">
          {items && (
            <Dropdown
              selection
              onChange={(event, data) => {
                props.setQueryParam({
                  queryParam: {
                    countryCode: data.options.filter((opt) => {
                      return opt.value === data.value;
                    })[0]?.key,
                    countryName: data.value,
                  },
                });
              }}
              placeholder={'Country'}
              options={items}
              value={props.globalQuery.countryName}
            />
          )}
        </div>
      </div>
    );
  },
  eprtrCountryGroupSelector: (props) => {
    const items =
      props.item?.[props.component.value]
        ?.filter((item) => item.countryGroupId)
        .map((item) => {
          return {
            key: item.countryGroupId,
            value: item.countryGroupId,
            text: item.countryGroupId,
          };
        }) || [];
    const pollutionType = [
      {
        key: 'airPollutionPerCapita',
        value: 'airPollutionPerCapita',
        text: 'Air',
      },
      {
        key: 'waterPollutionPerCapita',
        value: 'waterPollutionPerCapita',
        text: 'Water',
      },
    ];
    return (
      <div className="eprtrSelection">
        <Header as="h1">Industrial pollution in</Header>
        <div className="selector-container display-flex flex-flow-column">
          {items && (
            <Dropdown
              selection
              onChange={(event, data) => {
                props.setQueryParam({
                  queryParam: {
                    countryGroupId: data.options.filter((opt) => {
                      return opt.value === data.value;
                    })[0]?.key,
                  },
                });
              }}
              placeholder={'Country group'}
              options={items}
              value={props.globalQuery.countryGroupId}
            />
          )}
          {pollutionType && (
            <Dropdown
              selection
              onChange={(event, data) => {
                props.setQueryParam({
                  queryParam: {
                    listFilter: data.options.filter((opt) => {
                      return opt.value === data.value;
                    })[0]?.key,
                  },
                });
              }}
              placeholder={'Pollution by'}
              options={pollutionType}
              value={props.globalQuery.listFilter}
            />
          )}
        </div>
      </div>
    );
  },
  eprtrReprotingYears: (props) => {
    // const items =
    //   props.item?.[props.component.value]?.map((item) => {
    //     return {
    //       key: item.CountryCode,
    //       value: item.CountryName,
    //       text: item.CountryName,
    //     };
    //   }) || [];
    return <h1>OLA</h1>;
    // return (
    //   <div className="eprtrSelection">
    //     <Header as="h1">Industrial pollution in</Header>
    //     <div className="selector-container">
    //       {items && (
    //         <Dropdown
    //           search
    //           selection
    //           fluid
    //           onChange={(event, data) => {
    //             props.setQueryParam({
    //               queryParam: {
    //                 countryCode: data.options.filter((opt) => {
    //                   return opt.value === data.value;
    //                 })[0]?.key,
    //                 countryName: data.value,
    //               },
    //             });
    //           }}
    //           placeholder={'Country'}
    //           options={items}
    //           value={props.globalQuery.countryName}
    //         />
    //       )}
    //     </div>
    //   </div>
    // );
  },
  eprtrBatDerogations: (props) => {
    return (
      <div className="eprtrBatDerogations">
        <h1>BAT DEROGATIONS</h1>
      </div>
    );
  },
  eprtrBatConclusions: (props) => {
    const batConclusions = props.item?.[props.component.value] || {};
    return Object.keys(batConclusions).length ? (
      <>
        <div className="display-flex align-items-center mb-1">
          <h2 className="mb-0-super mr-1">BAT Conclusions</h2>
          <Icon name={infoSVG} size="30" color="#EC776A" />
        </div>
        <div className="eprtrBatConclusions bat-container">
          {Object.entries(batConclusions).map(([key, conclusion]) => (
            <div key={key} className="bat-conclusion">
              <div className="bat-title mb-2">
                <a>
                  {key}
                  <Icon name={blankSVG} size="20" color="#EC776A" />
                </a>
              </div>
              <div className="bat-details grid grid-cl-2 mb-2">
                <div>
                  <p className="bold">Status</p>
                  <p className="info">{conclusion[0].conclusionStatus}</p>
                </div>
                {/* <div>
                <p className="bold">Status Modified</p>
                <p className="info">{conclusion[0].Status}</p>
              </div> */}
              </div>
              {props.show.aels && (
                <div className="bat-aels mb-2">
                  <p className="bat-aels-title">BAT AELs</p>
                  {conclusion.map((ael, index) => (
                    <div
                      className="bat-ael"
                      key={`${index} - ${ael.BATAELName}`}
                    >
                      <div className="bat-title mb-2">
                        <a>
                          {ael.BATAELName}
                          <Icon name={blankSVG} size="20" color="#EC776A" />
                        </a>
                      </div>
                      <div className="bat-details grid grid-cl-1 mb-2">
                        <div>
                          <p className="bold">Status</p>
                          <p className="info">{ael.BATAELStatus}</p>
                        </div>
                        <div>
                          <p className="bold">Accepted date</p>
                          <p className="info">{ael.BATAELAcceptedDate}</p>
                        </div>
                        <div>
                          <p className="bold">Description</p>
                          <p className="info">{ael.Description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="hr mb-1" />
          <div className="bat-action text-align-center">
            <button
              onClick={() => {
                props.setShow({ ...props.show, aels: !props.show.aels });
              }}
            >
              {props.show.aels ? 'Hide BAT Aels' : 'View BAT AELs'}
            </button>
          </div>
        </div>
      </>
    ) : (
      ''
    );
  },
};

const View = (props) => {
  // providerUrl
  const [state, setState] = useState({
    selectedResource: {},
  });
  const [show, setShow] = useState({});
  const [canRender, setCanRender] = useState(true);
  const history = useHistory();
  const { query } = props;
  const { search } = props.discodata_query;
  const { data } = props.discodata_resources;
  const globalQuery = { ...query, ...search };
  const source_discodata_keys = props.data.source_discodata_keys?.value
    ? JSON.parse(props.data.source_discodata_keys?.value).properties
    : {};
  const resourcePackageKey = props.data.resource_package_key?.value;
  const key = props.data.key?.value;
  const source = props.data.source?.value;
  const source_query_param = props.data.source_query_param?.value;
  const requiredQueries = props.data.requiredQueries?.value || [];
  useEffect(() => {
    const requiredQueriesLength = requiredQueries?.length
      ? requiredQueries.filter((query) => props.discodata_query.search[query])
          .length
      : true;
    if (!requiredQueriesLength && canRender) {
      setCanRender(false);
    } else if (requiredQueriesLength && !canRender) {
      setCanRender(true);
    }
    /* eslint-disable-next-line */
  }, [props.discodata_query.search])
  useEffect(() => {
    const selectedResource =
      resourcePackageKey && !key
        ? data[resourcePackageKey]
        : resourcePackageKey && key
        ? data[resourcePackageKey]?.[globalQuery[key]]
        : data;
    let sourceData;
    let selectedSourceData;
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
    if (sourceData && Array.isArray(sourceData) && source_discodata_keys) {
      selectedSourceData = sourceData.filter((item) => {
        let ok = true;
        Object.entries(source_discodata_keys).forEach(
          ([selectorKey, selector]) => {
            if (
              globalQuery[selectorKey] &&
              item[selector.key] !== globalQuery[selectorKey]
            ) {
              ok = false;
            } else if (!globalQuery[selectorKey]) {
              ok = false;
            }
          },
        );
        return ok;
      })[0];
    }
    setState({
      ...state,
      selectedResource: selectedSourceData
        ? selectedSourceData
        : selectedResource,
    });
    /* eslint-disable-next-line */
  }, [props.data, props.discodata_resources, props.discodata_query.search])
  //  Render components
  const componentsSchema =
    props.data?.components?.value && JSON.parse(props.data?.components?.value);
  const components = {};
  componentsSchema?.fieldsets?.[0]?.fields &&
    componentsSchema.fieldsets[0].fields.forEach((component) => {
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
    <DiscodataSqlBuilderView {...props}>
      <div className="facility-block-wrapper">
        <div>
          {(state.selectedResource &&
            canRender &&
            root.map((tree) =>
              renderComponents.wrapper(tree, state.selectedResource, {
                globalQuery,
                setQueryParam: props.setQueryParam,
                history,
                show,
                setShow,
              }),
            )) ||
            (props.data.mode === 'edit' ? <p>Add components</p> : '')}
        </div>
      </div>
    </DiscodataSqlBuilderView>
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
    {
      setQueryParam,
      deleteQueryParam,
    },
  ),
)(View);
