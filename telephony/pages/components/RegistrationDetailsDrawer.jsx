import React, { useState, useEffect } from 'react';
import ReactJson from 'react-json-view';
import * as _ from 'lodash';
import { useMediaQuery } from 'react-responsive';
import { useIntl, connect } from 'umi';
import { Drawer } from 'antd';
import { reactJsonProps } from '@/pages/onnet-portal/core/utils/props';

const RegistrationDetailsDrawer = (props) => {
  const {
    settings,
    kz_account,
    selectedRegistration,
    onSelectedRegistrationDrawerClose,
    onRegistrationDrawerClose,
    isRegistrationDrawerVisible,
  } = props;

  const isSmallDevice = useMediaQuery({ maxWidth: 991 });
  const { formatMessage } = useIntl();

  return (
    <Drawer
      title={
        selectedRegistration ? (
          <>
            <b style={{ color: settings.primaryColor }}>
              {`${selectedRegistration?.username}@${selectedRegistration?.realm}`}
            </b>
          </>
        ) : null
      }
      width={isSmallDevice ? '100%' : '70%'}
      placement="right"
      onClose={onRegistrationDrawerClose}
      visible={isRegistrationDrawerVisible}
    >
      <ReactJson src={selectedRegistration} {...reactJsonProps} />
    </Drawer>
  );
};

export default connect(({ settings, kz_account }) => ({
  settings,
  kz_account,
}))(RegistrationDetailsDrawer);
