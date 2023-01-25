import React from 'react';
import { connect } from 'react-redux';
import downloadSVG from '@plone/volto/icons/download.svg';
import { Icon as VoltoIcon } from '@plone/volto/components';
import { isEmpty } from 'lodash';
import config from '@plone/volto/registry';
import { trackLink } from '@eeacms/volto-matomo/utils';

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
      const path = key.split('/');
      const title = path[path.length - 1];
      str += title + ': ' + readme[key] + '\r\n';
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
    initialSource,
    initialSourceLink,
    multipleSources,
    providerUrl,
    className,
    data_providers,
    metadata_providers,
    connectorsDataProviders,
    download_button,
  } = props;
  return (
    <React.Fragment>
      {(providerUrl || connectorsDataProviders) && download_button === true && (
        <VoltoIcon
          className="discreet download-button"
          title="Download data"
          onClick={() => {
            const connectorsData = {};
            connectorsDataProviders &&
              Object.keys(connectorsDataProviders).forEach((key) => {
                if (
                  connectorsDataProviders[key].path &&
                  data_providers?.data?.[
                    `${connectorsDataProviders[key].path}/@connector-data`
                  ]
                ) {
                  connectorsData[connectorsDataProviders[key].path] =
                    data_providers?.data?.[
                      `${connectorsDataProviders[key].path}/@connector-data`
                    ];
                }
              });
            const connectorData =
              data_providers?.data?.[`${providerUrl}/@connector-data`];
            if (connectorData && !providerUrl?.includes('.csv')) {
              // no need to re-construct csv if already there
              let array = [];
              let readme = {};
              connectorData &&
                Object.entries(connectorData).forEach(([key, items]) => {
                  readme[key] = metadata_providers?.data?.[key]?.Readme;

                  items.forEach((item, index) => {
                    if (!array[index]) array[index] = {};
                    array[index][key] = item;
                  });
                });

              exportCSVFile(array, providerUrl, readme);
              return;
            }
            const ExternalCSVPath = Object.keys(connectorsData)?.[0];
            if (
              !isEmpty(connectorsData) &&
              !ExternalCSVPath?.includes('.csv')
            ) {
              let title = '';
              let array = [];
              let readme = {};

              Object.entries(connectorsData).forEach(
                ([connectorKey, connector]) => {
                  title += connectorKey + ' & ';
                  readme[connectorKey] =
                    metadata_providers?.data?.[connectorKey]?.Readme;
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

            if (!providerUrl && !ExternalCSVPath) return;

            const dlAnchorElem = document.createElement('a');
            dlAnchorElem.setAttribute(
              'href',
              `${config.settings.apiPath}${
                providerUrl || ExternalCSVPath
              }/@@download`,
            );
            dlAnchorElem.className = 'piwik_download';
            dlAnchorElem.click();
          }}
          name={downloadSVG}
          size="20px"
        />
      )}

      {initialSource ||
        (multipleSources && multipleSources.length && (
          <div className="sources">
            <span className="discreet">
              {multipleSources?.length > 1 ? 'Sources: ' : 'Source: '}
            </span>
            {multipleSources && multipleSources.length ? (
              multipleSources.map((item) =>
                item.chart_source_link ? (
                  <a
                    key={item.chart_source_link}
                    className={`discreet block_source ${className || ''}`}
                    href={item.chart_source_link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.chart_source}
                  </a>
                ) : (
                  <div
                    key={item.chart_source}
                    className="discreet block_source"
                  >
                    {item.chart_source}
                  </div>
                ),
              )
            ) : (
              <a
                className="discreet block_source"
                href={initialSourceLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                {initialSource}
              </a>
            )}
          </div>
        ))}
    </React.Fragment>
  );
};

export default connect((state, props) => ({
  data_providers: state.data_providers,
  metadata_providers: state.metadata_providers,
}))(SourceView);
