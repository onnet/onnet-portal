import React, { useState } from 'react';
import ReactJson from 'react-json-view';
import * as _ from 'lodash';
import { useMediaQuery } from 'react-responsive';
import { useIntl, connect } from 'umi';
import { Drawer } from 'antd';
import { reactJsonProps } from '@/pages/onnet-portal/core/utils/props';

const CallLegDrawer = (props) => {
  const [callLegData, ] = useState({});

  const {
    settings,
    selectedLeg,
    onSelectedLegDrawerClose,
    isSelectedLegDrawerVisible,
  } = props;

  const isSmallDevice = useMediaQuery({ maxWidth: 991 });
  const { formatMessage } = useIntl();

  return (
    <Drawer
      title={
        selectedLeg ? (
          <>
            <b style={{ color: settings.primaryColor }}>
              {`${_.get(callLegData, 'container.cnt_name')}: `}
              {formatMessage({
                id: `.${selectedLeg.event_name}`,
                defaultMessage: selectedLeg.event_name,
              })}
            </b>
          </>
        ) : null
      }
      width={isSmallDevice ? '100%' : '70%'}
      placement="right"
      onClose={onSelectedLegDrawerClose}
      visible={isSelectedLegDrawerVisible}
    >
      <ReactJson src={selectedLeg} {...reactJsonProps} />
    </Drawer>
  );
};

export default connect(({ settings }) => ({
  settings,
}))(CallLegDrawer);
