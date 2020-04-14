import React from 'react';
import { connect } from 'dva';
import { useMediaQuery } from 'react-responsive';
import { formatMessage } from 'umi';
import { Drawer } from 'antd';
import EditDevice from './EditDevice';
import { DeleteOutlined } from '@ant-design/icons';

import styles from '../../style.less';

const EditDeviceDrawer = props => {
  const {
    settings,
    full_devices,
    selectedDevice,
    onDrawerClose,
    isEditDrawerVisible,
    deleteChildDevice,
    disableAssignBtn,
  } = props;
  const isSmallDevice = useMediaQuery({ maxWidth: 991 });

  return (
    <Drawer
      title={
        full_devices[selectedDevice] ? (
          <>
            <b style={{ color: settings.primaryColor }}>
              {`${formatMessage({ id: 'core.Device', defaultMessage: 'Device' })}: `}
              {full_devices[selectedDevice].data.name}
            </b>
            <DeleteOutlined
              className={styles.highlightColor}
              style={{ marginLeft: '0.5em' }}
              onClick={() =>
                deleteChildDevice(
                  full_devices[selectedDevice].data.id,
                  full_devices[selectedDevice].data.name,
                  full_devices[selectedDevice].data.sip.username,
                )
              }
            />
          </>
        ) : null
      }
      width={isSmallDevice ? '100%' : '50%'}
      placement="right"
      onClose={onDrawerClose}
      visible={isEditDrawerVisible}
    >
      <EditDevice selectedDevice={selectedDevice} disableAssignBtn={disableAssignBtn} />
    </Drawer>
  );
};

export default connect(({ settings, kz_full_devices }) => ({
  settings,
  full_devices: kz_full_devices,
}))(EditDeviceDrawer);
