import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import qs from 'query-string';
import DB from 'volto-datablocks/DataBase/DB';
import { settings } from '~/config';
import { getDiscodataResource } from '../actions';
let done = false;
const ViewWrapper = props => {
  const [state, setState] = useState({
    mounted: false,
  });
  const { query } = props;
  const { search } = props.discodata_query;
  const { data, pendingRequests } = props.discodata_resources;
  /* ========================= */
  const sqls = props.data?.sql?.value
    ? JSON.parse(props.data.sql.value).properties
    : {};
  const where = props.data?.where?.value
    ? JSON.parse(props.data.where.value).properties
    : {};
  const groupBy = props.data?.groupBy?.value
    ? JSON.parse(props.data.groupBy.value).properties
    : {};
  /* ========================= */
  const globalQuery = { ...query, ...search };
  useEffect(() => {
    setState({ ...state, mounted: true });
    /* eslint-disable-next-line */
  }, [])
  useEffect(() => {
    if (state.mounted) {
      Object.entries(sqls).forEach(([sqlKey, sqlValue]) => {
        const isCollection = sqlValue.isCollection;
        const hasPagination = sqlValue.hasPagination;
        const requestsMetadata = {
          ...(isCollection
            ? props.discodata_resources.requestsMetadata[sqlKey]
            : props.discodata_resources.requestsMetadata[
                `${sqlKey}_${sqlValue.packageName}`
              ]),
        };
        let requestsMetadataDiff = false;
        let whereStatements = [],
          groupByStatements = [];
        whereStatements = Object.keys(where)
          .filter(key => {
            return (
              where[key].sqlId === sqlKey &&
              globalQuery[where[key].queryParam] &&
              where[key].key
            );
          })
          .map(key => {
            return {
              discodataKey: where[key].key,
              value: globalQuery[where[key].queryParam],
            };
          });
        const url = DB.table(
          sqlValue.sql,
          settings.providerUrl,
          hasPagination ? props.pagination : {},
        )
          .where(whereStatements)
          .encode()
          .get();
        const request = {
          url,
          isCollection,
          resourceKey: sqlKey || '',
        };
        if (!isCollection) {
          groupByStatements = Object.keys(groupBy)
            .filter(key => {
              return groupBy[key].sqlId === sqlKey;
            })
            .map(key => {
              return {
                discodataKey: groupBy[key].discodataKey,
                key: groupBy[key].key,
              };
            });
          /* Update requestsMetadata */
          requestsMetadata.where = whereStatements;
          requestsMetadata.groupBy = groupByStatements;
          requestsMetadata.query = globalQuery[sqlValue.packageName] || '';

          if (
            JSON.stringify(requestsMetadata) !==
              JSON.stringify(
                props.discodata_resources.requestsMetadata[
                  `${sqlKey}_${sqlValue.packageName}`
                ],
              ) &&
            whereStatements.length > 0
          ) {
            requestsMetadataDiff = true;
          }
          if (requestsMetadata) {
            request.search = globalQuery || {};
            request.groupBy = groupByStatements || [];
            request.key = sqlValue.packageName || '';
          }
        } else {
          requestsMetadata.where = whereStatements;
          requestsMetadata.pagination = hasPagination
            ? props.pagination || { p: 1, nrOfHits: 5 }
            : null;
          if (
            JSON.stringify(requestsMetadata) !==
            JSON.stringify(props.discodata_resources.requestsMetadata[sqlKey])
          ) {
            requestsMetadataDiff = true;
          }
        }
        if (
          // !done &&
          ((!isCollection &&
            !pendingRequests[`${sqlKey}_${sqlValue.packageName}`]) ||
            (isCollection && !pendingRequests[sqlKey])) &&
          requestsMetadataDiff
        ) {
          // done = true;
          request.requestsMetadata = requestsMetadata;
          props.getDiscodataResource(request);
        }
      });
    }
    /* eslint-disable-next-line */
  }, [sqls, where, groupBy, search])
  return <>{props.children}</>;
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
)(ViewWrapper);
