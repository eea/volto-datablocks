import React from 'react';
import { getBlockData } from 'volto-datablocks/actions';
import { useDispatch, useSelector } from 'react-redux';
import { getBaseUrl } from '@plone/volto/helpers';

import { useLocation } from 'react-router-dom';

const withBlockData = (WrappedComponent) => (props) => {
  const { id } = props;
  const dispatch = useDispatch();
  const blockData = useSelector((state) => state.blockdata[id]);
  const location = useLocation();
  const pathname = props.path || location.pathname;

  React.useEffect(() => {
    if (!blockData) {
      dispatch(getBlockData(getBaseUrl(pathname), id)); // || blockData.error
    }
  }, [blockData, dispatch, id, pathname]);

  return <WrappedComponent {...props} data={blockData?.data || props.data} />;
};

export default withBlockData;
