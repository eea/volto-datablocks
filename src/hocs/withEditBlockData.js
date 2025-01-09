import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBaseUrl } from '@plone/volto/helpers';
import { getBlockData } from '../actions';

const withEditBlockData = (WrappedComponent) => (props) => {
  const { id } = props;
  const dispatch = useDispatch();
  // const blockData = useSelector((state) =>
  const blockData = useSelector((state) =>
    props.data?.chartData?.data?.length > 0 // we have data from edit
      ? props
      : state.blockdata[id]?.data?.chartData // the data came from async
        ? state.blockdata[id]
        : props,
  );
  const pathname = useSelector((state) => state.router.location.pathname);

  React.useEffect(() => {
    if (!blockData?.chartData?.data) {
      dispatch(getBlockData(getBaseUrl(pathname), id)); // || blockData.error
    }
    /* eslint-disable-next-line */
  }, [blockData?.chartData?.data, dispatch, id, pathname]);

  return <WrappedComponent {...props} data={blockData?.data || props.data} />;
};

export default withEditBlockData;
