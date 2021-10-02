import React from 'react';
import ReactJson from 'react-json-view';
import { useMediaQuery } from 'react-responsive';
import { connect } from 'umi';
import { Drawer } from 'antd';
import { reactJsonProps } from '@/pages/onnet-portal/core/utils/props';

const RegistrationDetailsDrawer = (props) => {
  const {
    settings,
    selectedRegistration,
    onRegistrationDrawerClose,
    isRegistrationDrawerVisible,
  } = props;

  const isSmallDevice = useMediaQuery({ maxWidth: 991 });

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

export default connect(({ settings }) => ({
  settings,
}))(RegistrationDetailsDrawer);
