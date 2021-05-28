import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchContent } from '@plone/volto/actions';
import { setProviderContent } from '@eeacms/volto-datablocks/actions';
/**
 * withProviderContent.
 *
 * @param {} WrappedComponent
 */
export function withProviderContent(WrappedComponent, config = {}) {
  return (props) => {
    const dispatch = useDispatch();
    const { provider_url = null } = props.data;
    const providerContent = useSelector(
      (state) => state.data_providers.content,
    );
    const search = useSelector((state) => state.search);
    const content =
      search.items.filter((item) => item['@id'] === provider_url)?.[0] || null;

    useEffect(() => {
      if (provider_url && !content && !providerContent?.[provider_url]) {
        dispatch(searchContent(provider_url, { fullobjects: true }));
      }
    }, [dispatch, content, provider_url, providerContent]);

    useEffect(() => {
      if (content && !providerContent?.[provider_url]) {
        dispatch(
          setProviderContent(provider_url, {
            ...content,
            parameters: content.parameters.map((field) => {
              const param = field.split('.');
              return param[1] || param[0] || '';
            }),
          }),
        );
      }
    }, [dispatch, content, providerContent, provider_url]);

    return (
      <WrappedComponent
        {...props}
        providerContent={providerContent?.[provider_url]}
      />
    );
  };
}

export default withProviderContent;
