import React from 'react';
import { Icon } from '@plone/volto/components';
import { trackLink } from '@eeacms/volto-matomo/utils';

import downloadSVG from '@plone/volto/icons/download.svg';
import './styles.css';

function getHeaders(headers) {
  let str = '';
  headers.forEach((header) => {
    if (str !== '') str += ',';
    str += header;
  });
  return str + '\r\n';
}

function getData(array) {
  let str = '';
  for (let i = 0; i < array.length; i++) {
    let line = '';
    for (let key in array[i]) {
      if (line !== '') line += ',';

      line += array[i][key];
    }

    str += line + '\r\n';
  }

  return str;
}

function convertToCSV(array, readme = []) {
  let str = getHeaders(Object.keys(array[0]));

  str += getData(array);

  for (let i = 0; i < 5; i++) {
    str += '\r\n';
  }

  readme.forEach((text) => {
    str += text + '\r\n';
  });

  return str;
}

function convertMatrixToCSV(matrix, readme = []) {
  let str = '';

  matrix.forEach((array) => {
    str += getHeaders(Object.keys(array[0]));
    str += getData(array);
    for (let i = 0; i < 2; i++) {
      str += '\r\n';
    }
  });

  for (let i = 0; i < 3; i++) {
    str += '\r\n';
  }

  readme.forEach((text) => {
    str += text + '\r\n';
  });

  return str;
}

function exportCSVFile(csv, title = 'data') {
  let fileTitle = title.toLowerCase().replace(' ', '_');
  let exportedFilenmae = fileTitle.includes('.csv')
    ? fileTitle
    : fileTitle + '.csv';
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

// const dlAnchorElem = document.createElement('a');
// dlAnchorElem.setAttribute(
//   'href',
//   `${config.settings.apiPath}${
//     provider_url || ExternalCSVPath
//   }/@@download`,
// );
// dlAnchorElem.className = 'piwik_download';
// dlAnchorElem.click();

const SourceView = (props) => {
  const {
    sources,
    className,
    title,
    provider_data,
    provider_metadata,
    providers_data,
    providers_metadata,
  } = props;

  const download_button = props.download_button ?? true;

  return (
    <React.Fragment>
      {provider_data && download_button === true && (
        <Icon
          className="discreet download-button"
          title="Download data"
          onClick={() => {
            let array = [];
            let readme = provider_metadata?.readme
              ? [provider_metadata?.readme]
              : [];
            Object.entries(provider_data).forEach(([key, items]) => {
              items.forEach((item, index) => {
                if (!array[index]) array[index] = {};
                array[index][key] = item;
              });
            });
            const csv = convertToCSV(array, readme);
            exportCSVFile(csv, title);
          }}
          name={downloadSVG}
          size="20px"
        />
      )}

      {providers_data && download_button === true && (
        <Icon
          className="discreet download-button"
          title="Download data"
          onClick={() => {
            let array = [];
            let readme = [];
            Object.keys(providers_data).forEach((pKey, pIndex) => {
              if (!array[pIndex]) array[pIndex] = [];
              Object.entries(providers_data[pKey]).forEach(([key, items]) => {
                items.forEach((item, index) => {
                  if (!array[pIndex][index]) array[pIndex][index] = {};
                  array[pIndex][index][key] = item;
                  index++;
                });
              });
            });
            Object.keys(providers_metadata).forEach((pKey) => {
              if (providers_metadata[pKey].readme) {
                readme.push(providers_metadata[pKey].readme);
              }
            });
            const csv = convertMatrixToCSV(array, readme);
            exportCSVFile(csv, title);
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

export default SourceView;
