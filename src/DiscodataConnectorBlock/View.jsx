import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {
  getConnectedDataParametersForProvider,
  getConnectedDataParametersForContext,
} from '../helpers';
import DataConnectedValue from '../DataConnectedValue';
import { SourceView } from '../Sources';
import { setConnectedDataParameters } from '../actions';

import { getBasePath } from '../helpers';

const dataParameters = props => {
  return (
    getConnectedDataParametersForProvider(
      props.connected_data_parameters,
      '',
    ) ||
    getConnectedDataParametersForContext(
      props.connected_data_parameters,
      props.content['@id'],
    )
  );
};

const providerView = (dataProviderKey, dataProvider, defaultDataParameters) => {
  let hasDefaultQueryParams = false;
  if (
    (!dataProvider.queryParameterColumn || !dataProvider.queryParameterValue) &&
    (defaultDataParameters?.[0]?.i && defaultDataParameters?.[0]?.v)
  ) {
    hasDefaultQueryParams = true;
  }
  return (
    <div
      key={`land-data-for-${dataProviderKey}`}
      className={dataProvider.className}
    >
      <span>
        {dataProvider.hasDiscodataConnector && (
          <DataConnectedValue
            hasQueryParammeters={
              typeof dataProvider.hasQueryParameters !== 'undefined'
                ? dataProvider.hasQueryParameters
                : true
            }
            filterIndex={hasDefaultQueryParams ? 0 : dataProviderKey}
            url={dataProvider.path}
            column={dataProvider.displayColumn}
            format={dataProvider.displayFormat}
            placeholder="_"
          />
        )}
        {' ' + (dataProvider.measurmentUnit || '')}
      </span>
      {' ' + (dataProvider.additionalText || '')}
    </div>
  );
};

const bulletListView = items => (
  <div className="ui bulleted list">
    {items &&
      Object.entries(items).map(([key, item]) => (
        <div className="item">
          {item.leftText}
          <span className="float-right">{item.rightText}</span>
        </div>
      ))}
  </div>
);

const View = props => {
  const [state, setState] = useState({
    onChange: newState => {
      setState({ ...state, ...newState });
    },
  });
  const dataProvidersSchema =
    props.data?.data_providers?.value &&
    JSON.parse(props.data?.data_providers?.value);
  const dataProviders = {};
  dataProvidersSchema?.fieldsets?.[0]?.fields &&
    dataProvidersSchema.fieldsets[0].fields.forEach(dataProvider => {
      dataProviders[dataProvider] = {
        ...dataProvidersSchema.properties[dataProvider],
      };
    });
  const bulletList =
    props.data?.bullet_list?.value &&
    JSON.parse(props.data?.bullet_list?.value).properties;
  const path = getBasePath(props.content['@id']);
  useEffect(() => {
    dataProviders &&
      Object.entries(dataProviders).forEach(
        ([dataProviderKey, dataProvider]) => {
          if (
            dataProvider.queryParameterColumn &&
            dataProvider.queryParameterValue
          ) {
            props.dispatch(
              setConnectedDataParameters(
                path,
                {
                  i: dataProvider.queryParameterColumn,
                  v: dataProvider.queryParameterValue,
                },
                dataProviderKey,
              ),
            );
          }
        },
      );
    /* eslint-disable-next-line */
  }, [props.data?.data_providers])
  const parentsDataProviders = {};
  dataProviders &&
    Object.entries(dataProviders).forEach(([dataProviderKey, dataProvider]) => {
      if (!dataProvider.hasParent) {
        parentsDataProviders[dataProviderKey] = { ...dataProvider };
      } else if (
        dataProvider.parent &&
        parentsDataProviders[dataProvider.parent]
      ) {
        if (!parentsDataProviders[dataProvider.parent].children) {
          parentsDataProviders[dataProvider.parent].children = {};
        }
        parentsDataProviders[dataProvider.parent].children[
          dataProviderKey
        ] = dataProvider;
      }
    });

  const view = (
    <div className="flex h-100 pa-1">
      <div className="flex flex-column w-100">
        {props.data?.block_title?.value ? (
          <h5>{props.data.block_title.value}</h5>
        ) : (
          ''
        )}
        {parentsDataProviders &&
          Object.entries(parentsDataProviders).map(
            ([dataProviderKey, dataProvider]) => {
              if (dataProvider.children) {
                return (
                  <div
                    className={dataProvider.wrapperClassName}
                    key={`data-wrapper-${dataProviderKey}`}
                  >
                    {providerView(
                      dataProviderKey,
                      dataProvider,
                      dataParameters(props),
                    )}
                    {Object.entries(dataProvider.children).map(
                      ([cildrenKey, children]) =>
                        providerView(
                          cildrenKey,
                          children,
                          dataParameters(props),
                        ),
                    )}
                  </div>
                );
              }
              return (
                <div
                  className={dataProvider.wrapperClassName}
                  key={`data-wrapper-${dataProviderKey}`}
                >
                  {providerView(
                    dataProviderKey,
                    dataProvider,
                    dataParameters(props),
                  )}
                </div>
              );
            },
          )}
        {bulletList && bulletListView(bulletList)}
        {props?.data?.chart_sources && (
          <div>
            <SourceView
              multipleSources={props?.data?.chart_sources}
              connectorsDataProviders={dataProviders}
            />
          </div>
        )}
      </div>
    </div>
  );
  return view;
};

export default compose(
  connect((state, props) => ({
    connected_data_parameters: state.connected_data_parameters,
    content: state.content.data,
  })),
)(View);

// export default View;
