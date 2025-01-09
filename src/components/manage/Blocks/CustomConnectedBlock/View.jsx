import React, { useMemo } from 'react';
import { isNil } from 'lodash';
import { compose } from 'redux';
import config from '@plone/volto/registry';
import { VisibilitySensor } from '@eeacms/volto-datablocks/components';
import { connectToProviderData } from '@eeacms/volto-datablocks/hocs';
import './style.less';
import { defineMessages } from 'react-intl';

const messages = defineMessages({
  selectBlockType: {
    id: 'selectBlockType',
    defaultMessage: 'Please select a block type from sidebar',
  },
  blockTypeSelected: {
    id: 'blockTypeSelected',
    defaultMessage: 'Block type selected: {type}',
  },
});

const DefaultView = (props) => (
  <>
    {props.mode === 'edit' && !props.data.type ? (
      <p>{props.intl.formatMessage(messages.selectBlockType)}</p>
    ) : props.mode === 'edit' && props.data.type ? (
      <p>
        {props.intl.formatMessage(messages.blockTypeSelected, {
          type: props.data.type,
        })}
      </p>
    ) : (
      ''
    )}
  </>
);

const View = (props) => {
  const type = props.data.type;

  const CustomView = useMemo(() => {
    return (
      config.blocks.blocksConfig.custom_connected_block.blocks?.[type]?.view ||
      null
    );
  }, [type]);

  const RenderCustomConnectedBlock = useMemo(() => {
    return CustomView || DefaultView;
  }, [CustomView]);

  return (
    <RenderCustomConnectedBlock
      {...props}
      mode={props.mode}
      placeholder={!isNil(props.provider_data) ? props.data.placeholder : null}
    />
  );
};

const BlockView = compose(
  connectToProviderData((props) => ({
    provider_url: props.data?.provider_url,
  })),
)(View);

export { View };

const CustomConnectedBlockView = (props) => {
  return (
    <VisibilitySensor Placeholder={() => <div>loading....&nbsp;</div>}>
      <BlockView {...props} />
    </VisibilitySensor>
  );
};

export default CustomConnectedBlockView;
