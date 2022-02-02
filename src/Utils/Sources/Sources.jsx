import React from 'react';
import { compose } from 'redux';
import { isEmpty } from 'lodash';
import config from '@plone/volto/registry';
import { Icon } from '@plone/volto/components';
import { trackLink } from '@eeacms/volto-matomo/utils';
import { connectToProviderData } from '@eeacms/volto-datablocks/hocs';

import downloadSVG from '@plone/volto/icons/download.svg';
import './styles.css';

function convertToCSV(objArray, readme) {
  let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
  let str = '';

  // Add headers
  for (let key in array[0]) {
    if (str !== '') str += ',';
    str += key;
  }

  str += '\r\n';

  for (let i = 0; i < array.length; i++) {
    let line = '';
    for (let key in array[i]) {
      if (line !== '') line += ',';

      line += array[i][key];
    }

    str += line + '\r\n';
  }

  for (let i = 0; i < 5; i++) {
    str += '\r\n';
  }

  for (let key in readme) {
    if (readme[key]) {
      str += key + ': ' + readme[key] + '\r\n';
    }
  }
  return str;
}

function exportCSVFile(items, fileTitle, readme) {
  // Convert Object to JSON
  let jsonObject = JSON.stringify(items);

  let csv = convertToCSV(jsonObject, readme);

  let exportedFilenmae = fileTitle + '.csv' || 'export.csv';
  trackLink({
    href: window.location.href + exportedFilenmae,
    linkType: 'download',
  });

  let blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  if (navigator.msSaveBlob) {
    // IE 10+
    navigator.msSaveBlob(blob, exportedFilenmae);
  } else {
    let link = document.createElement('a');
    if (link.download !== undefined) {
      // feature detection
      // Browsers that support HTML5 download attribute
      if (document) {
        let url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', exportedFilenmae);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }
}

const SourceView = (props) => {
  const {
    sources,
    className,
    provider_url,
    provider_data,
    provider_metadata,
    download_button,
  } = props;

  return (
    <React.Fragment>
      {provider_data && download_button === true && (
        <Icon
          className="discreet download-button"
          title="Download data"
          onClick={() => {
            if (provider_data && !provider_url?.includes('.csv')) {
              // no need to re-construct csv if already there
              let array = [];
              let readme = {};
              Object.entries(provider_data).forEach(([key, items]) => {
                readme[key] = provider_metadata?.readme;

                items.forEach((item, index) => {
                  if (!array[index]) array[index] = {};
                  array[index][key] = item;
                });
              });

              exportCSVFile(array, provider_url, readme);
              return;
            }
            const ExternalCSVPath = Object.keys(provider_data)?.[0];
            if (!isEmpty(provider_data) && !ExternalCSVPath?.includes('.csv')) {
              let title = '';
              let array = [];
              let readme = {};

              Object.entries(provider_data).forEach(
                ([connectorKey, connector]) => {
                  title += connectorKey + ' & ';
                  readme[connectorKey] = provider_metadata?.readme;
                  Object.entries(connector).forEach(([key, items]) => {
                    items.forEach((item, index) => {
                      if (!array[index]) {
                        array[index] = {};
                      }
                      array[index][key] = item;
                    });
                  });
                },
              );

              exportCSVFile(array, title.slice(0, -3), readme);
              return;
            }

            if (!provider_url && !ExternalCSVPath) return;

            const dlAnchorElem = document.createElement('a');
            dlAnchorElem.setAttribute(
              'href',
              `${config.settings.apiPath}${
                provider_url || ExternalCSVPath
              }/@@download`,
            );
            dlAnchorElem.className = 'piwik_download';
            dlAnchorElem.click();
          }}
          name={downloadSVG}
          size="20px"
        />
      )}

      {sources?.length ? (
        <div className="sources">
          <span className="discreet">
            {sources.length > 1 ? 'Sources: ' : 'Source: '}
          </span>
          {sources.map((source) =>
            source.chart_source_link ? (
              <a
                key={source.chart_source_link}
                className={`discreet block_source ${className || ''}`}
                href={source.chart_source_link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {source.chart_source}
              </a>
            ) : (
              <div key={source.chart_source} className="discreet block_source">
                {source.chart_source}
              </div>
            ),
          )}
        </div>
      ) : (
        ''
      )}
    </React.Fragment>
  );
};

export default compose(
  connectToProviderData((props) => {
    const download_button = props.download_button ?? true;
    if (!download_button) return {};
    return {
      provider_url: props.provider_url,
    };
  }),
)(SourceView);
