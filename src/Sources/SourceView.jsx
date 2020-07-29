import React from 'react';
import { connect } from 'react-redux';
import downloadSVG from '@plone/volto/icons/download.svg';
import { Icon as VoltoIcon } from '@plone/volto/components';
// import { Grid } from 'semantic-ui-react';
import { settings } from '~/config';

const SourceView = ({
  initialSource,
  initialSourceLink,
  multipleSources,
  providerUrl,
  data_providers,
}) => {
  return (
    <React.Fragment>
      {providerUrl && (
        <VoltoIcon
          className="discreet download-button"
          title="Download data"
          onClick={() => {
            const connectorData =
              data_providers?.data?.[`${providerUrl}/@connector-data`];
            const dataStr = connectorData
              ? 'data:text/json;charset=utf-8,' +
                encodeURIComponent(JSON.stringify(connectorData))
              : null;
            if (dataStr) {
              const dlAnchorElem = document.createElement('a');
              dlAnchorElem.setAttribute('href', dataStr);
              dlAnchorElem.setAttribute('download', `${providerUrl}.json`);
              dlAnchorElem.click();
            } else {
              const dlAnchorElem = document.createElement('a');
              dlAnchorElem.setAttribute(
                'href',
                `${settings.apiPath}${providerUrl}/@@download`,
              );
              dlAnchorElem.click();
            }
          }}
          name={downloadSVG}
          size="20"
        />
      )}

      <div className="sources">
        <span className="discreet">
          {initialSource || (multipleSources && multipleSources.length)
            ? multipleSources && multipleSources.length
              ? 'Sources: '
              : 'Source: '
            : ''}
        </span>
        <a
          className="discreet block_source"
          href={initialSourceLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          {initialSource}
        </a>
        {multipleSources && multipleSources.length
          ? multipleSources.map(item =>
              item.chart_source_link ? (
                <a
                  key={item.chart_source_link}
                  className="discreet block_source"
                  href={item.chart_source_link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.chart_source}
                </a>
              ) : (
                <div key={item.chart_source} className="discreet block_source">
                  {item.chart_source}
                </div>
              ),
            )
          : ''}
      </div>
    </React.Fragment>
  );
};

export default connect((state, props) => ({
  data_providers: state.data_providers,
}))(SourceView);
