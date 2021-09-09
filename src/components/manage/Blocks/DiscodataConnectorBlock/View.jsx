import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { flattenToAppURL } from '@plone/volto/helpers';
import { DataConnectedValue } from '../../../../Utils';
import { SourcesBlockView } from '../../../../components';
import { setConnectedDataParameters } from '../../../../actions';
import {
  getConnectedDataParametersForProvider,
  getConnectedDataParametersForContext,
} from '../../../../helpers';

const dataParameters = (props) => {
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
  if (!dataProvider.queryParameterColumn || !dataProvider.queryParameterValue) {
    if (
      defaultDataParameters?.[0]?.query?.[0]?.i || //support for querystring widget, we may remove the workaround part?
      (defaultDataParameters?.[0]?.i &&
        defaultDataParameters?.[0]?.query?.[0]?.v) ||
      defaultDataParameters?.[0]?.v
    ) {
      hasDefaultQueryParams = true;
    }
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
            textTemplate={dataProvider.textTemplate}
            specifier={dataProvider.specifier}
            placeholder="_"
          />
        )}
        {dataProvider.measurmentUnit || ''}
      </span>
      {' ' + (dataProvider.additionalText || '')}
    </div>
  );
};

const bulletListView = (items) => (
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

const View = (props) => {
  const [dataProviders, setDataProviders] = useState({});
  const [parentsDataProviders, setParentsDataProviders] = useState({});
  const bulletList =
    props.data?.bullet_list?.value &&
    JSON.parse(props.data?.bullet_list?.value).properties;
  const path = flattenToAppURL(props.content['@id']);

  const updateDataProviders = () => {
    let newDataProviders = { ...dataProviders };
    if (props.data.data_providers) {
      if (
        typeof props.data.data_providers === 'object' &&
        props.data.data_providers.value
      ) {
        newDataProviders = {};
        const dataProvidersSchema =
          props.data?.data_providers?.value &&
          JSON.parse(props.data?.data_providers?.value);
        dataProvidersSchema?.fieldsets?.[0]?.fields &&
          dataProvidersSchema.fieldsets[0].fields.forEach((dataProvider) => {
            newDataProviders[dataProvider] = {
              ...dataProvidersSchema.properties[dataProvider],
            };
          });
      } else if (Array.isArray(props.data.data_providers)) {
        newDataProviders = {};
        props.data.data_providers.forEach((provider) => {
          newDataProviders[provider.id] = { ...provider };
        });
      }
    }
    setDataProviders({ ...newDataProviders });
    return newDataProviders;
  };

  const updateParentsDataProviders = () => {
    const newParentsDataProviders = {};
    dataProviders &&
      Object.entries(dataProviders).forEach(
        ([dataProviderKey, dataProvider]) => {
          if (!dataProvider.hasParent) {
            newParentsDataProviders[dataProviderKey] = { ...dataProvider };
          } else if (
            dataProvider.parent &&
            newParentsDataProviders[dataProvider.parent]
          ) {
            if (!newParentsDataProviders[dataProvider.parent].children) {
              newParentsDataProviders[dataProvider.parent].children = {};
            }
            newParentsDataProviders[dataProvider.parent].children[
              dataProviderKey
            ] = dataProvider;
          }
        },
      );
    setParentsDataProviders({ ...newParentsDataProviders });
    return newParentsDataProviders;
  };

  useEffect(() => {
    updateDataProviders();
    /* eslint-disable-next-line */
  }, []);

  useEffect(() => {
    updateParentsDataProviders();
    /* eslint-disable-next-line */
  }, [JSON.stringify(dataProviders)]);

  useEffect(() => {
    const newDataProviders = updateDataProviders();
    newDataProviders &&
      Object.entries(newDataProviders).forEach(
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
  }, [JSON.stringify(props.data?.data_providers)]);

  const view = (
    <div className="flex h-100 pa-1">
      <div className="flex flex-column w-100">
        {/* {props.data?.block_title ? <h5>{props.data.block_title}</h5> : ''} */}
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
                    {Object.entries(
                      dataProvider.children,
                    ).map(([cildrenKey, children]) =>
                      providerView(cildrenKey, children, dataParameters(props)),
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
        {props?.data?.chartSources && (
          <div>
            <SourcesBlockView
              multipleSources={props?.data?.chartSources}
              connectorsDataProviders={dataProviders}
              download_button={props?.data?.download_button}
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
