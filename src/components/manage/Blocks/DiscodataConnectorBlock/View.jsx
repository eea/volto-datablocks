import React from 'react';
import { compose } from 'redux';
import { connectToMultipleProviders } from '@eeacms/volto-datablocks/hocs';
import { DataConnectedValue } from '@eeacms/volto-datablocks/Utils';
import { Sources } from '@eeacms/volto-datablocks/Utils';

const ProviderView = ({ provider }) => {
  if (!provider) return '';
  return (
    <div className={provider.className}>
      <span>
        <DataConnectedValue
          column={provider.column}
          data={{ data_query: provider.data_query }}
          placeholder={provider.placeholder || '...'}
          row={provider.row}
          specifier={provider.specifier}
          textTemplate={provider.textTemplate}
          url={provider.url}
        />
      </span>
    </div>
  );
};

const View = (props) => {
  const { data = {} } = props;
  const { providers = [] } = data;

  if (!providers.length) return <p>Add providers</p>;

  return (
    <div className="flex h-100 pa-1">
      <div className="flex flex-column w-100">
        {providers.map((provider, index) => {
          if ((index + 1) % 2 === 0) return '';
          return (
            <div
              className={provider.wrapperClassName}
              key={`data-wrapper-${provider.title || index}`}
            >
              <ProviderView provider={provider} />
              <ProviderView provider={providers[index + 1]} />
            </div>
          );
        })}
        {props.data?.chartSources && providers?.[0]?.url && (
          <div>
            <Sources
              data={{ data_query: providers[0].data_query }}
              sources={props.data?.chartSources}
              provider_url={providers[0].url}
              download_button={props.data?.download_button}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default compose(
  connectToMultipleProviders((props) => ({
    providers: props.data.providers,
  })),
)(View);
