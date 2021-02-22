/**
 * A country flags provider.
 */
/* eslint-disable */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getContent } from '@plone/volto/actions';
import countries_url from './data/countries.tsv';
import world_url from './data/world-country-names.tsv';

export default ({ children }) => {
  const dispatch = useDispatch();

  const subrequests = useSelector((state) => state.content.subrequests);
  const countries_req = subrequests[countries_url];
  const world_req = subrequests[world_url];

  React.useEffect(() => {
    if (!countries_req) {
      const c_action = getContent(countries_url, null, countries_url);
      dispatch({
        ...c_action,
        request: {
          ...c_action.request,
          headers: { Accept: 'plain/text' },
        },
      });
    }
  }, [countries_req, dispatch]);

  React.useEffect(() => {
    if (!world_req) {
      const c_action = getContent(world_url, null, world_url);
      dispatch({
        ...c_action,
        request: {
          ...c_action.request,
          headers: { Accept: 'plain/text' },
        },
      });
    }
  }, [world_req, dispatch]);

  return children([countries_req, world_req]);
};
