import React, { Fragment, useState, useEffect } from 'react';
import { connect,formatMessage } from 'umi';
import { Card, Switch, Badge, Modal } from 'antd';
import { kzDevice } from '../../services/kazoo';
import * as _ from 'lodash';
import { EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useMediaQuery } from 'react-responsive';
import styles from '../style.less';
import EditDeviceDrawer from '../DevicesList/EditDeviceDrawer';

const { confirm } = Modal;

const UserDevices = props => {
  const [brDevs, setBrDevs] = useState([]);
  const [isEditDrawerVisible, setIsEditDrawerVisible] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(false);

  const { dispatch, settings, account, full_users, brief_devices, full_devices, owner_id } = props;
  const isSmallDevice = useMediaQuery({ maxWidth: 991 });

  useEffect(() => {
    if (brief_devices.data) setBrDevs(brief_devices.data);
  }, [full_users[owner_id], brief_devices, full_devices[selectedDevice]]);

  if (!full_users[owner_id]) return null;

  const gridStyle = {
    width: isSmallDevice ? '100%' : '50%',
    textAlign: 'center',
  };

  const items = _.filter(brDevs, { owner_id }).map(item => (
    <Card.Grid style={gridStyle} key={item.id}>
      <Card.Meta
        title={
          <span>
            <Badge dot style={{ color: settings.primaryColor, marginRight: '1.1em' }} />
            {item.name}
            <EditOutlined
              style={{ color: settings.primaryColor, marginLeft: '0.5em' }}
              onClick={() => {
                setSelectedDevice(item.id);
                dispatch({
                  type: 'kz_full_devices/refresh',
                  payload: { account_id: account.data.id, device_id: item.id },
                });
                setIsEditDrawerVisible(true);
              }}
            />
          </span>
        }
        description={
          <Switch
            key={item.id}
            checkedChildren="enabled"
            unCheckedChildren="disabled"
            checked={full_devices[item.id] ? full_devices[item.id].data.enabled : item.enabled}
            onChange={checked => onDeviceEnableSwitch(checked, item)}
          />
        }
      />
    </Card.Grid>
  ));

  function onDeviceEnableSwitch(checked, record) {
    confirm({
      title: (
        <p>
          {formatMessage({ id: 'core.Device', defaultMessage: 'Device' })}: {record.name}
        </p>
      ),
      content: (
        <span style={{ paddingLeft: '6em' }}>
          {checked
            ? formatMessage({ id: 'core.switch_on', defaultMessage: 'Switch ON' })
            : formatMessage({ id: 'core.switch_off', defaultMessage: 'Switch OFF' })}
        </span>
      ),
      onOk() {
        kzDevice({
          method: 'PATCH',
          account_id: account.data.id,
          device_id: record.id,
          data: { enabled: checked },
        })
          .then(() => {
            dispatch({
              type: 'kz_full_devices/refresh',
              payload: { account_id: account.data.id, device_id: record.id },
            });
          })
          .catch(() => console.log('Oops errors!', record));
      },
      onCancel() {},
    });
  }

  const onDrawerClose = () => {
    setIsEditDrawerVisible(false);
  };

  const deleteChildDevice = (dev_id, dev_name, dev_username) => {
    confirm({
      title: `${formatMessage({
        id: 'core.Do_you_want_to_delete_device',
        defaultMessage: 'Do you want to delete device',
      })}?`,
      content: (
        <span className={styles.highlightColor} style={{ textAlign: 'center', fontWeight: 'bold' }}>
          {dev_name} ( {dev_username} )
        </span>
      ),
      icon: <ExclamationCircleOutlined />,
      okType: 'danger',
      okText: formatMessage({ id: 'core.Yes', defaultMessage: 'Yes' }),
      cancelText: formatMessage({ id: 'core.No', defaultMessage: 'No' }),
      onOk() {
        kzDevice({ method: 'DELETE', account_id: account.data.id, device_id: dev_id })
          .then(() => {
            dispatch({
              type: 'kz_brief_devices/refresh',
              payload: { account_id: account.data.id },
            });
            setIsEditDrawerVisible(false);
          })
          .catch(() => console.log('Oops errors!', dev_id, dev_username));
      },
      onCancel() {},
    });
  };

  return (
    <Fragment>
      <Card.Meta description={<>{items}</>} />
      <EditDeviceDrawer
        selectedDevice={selectedDevice}
        onDrawerClose={onDrawerClose}
        isEditDrawerVisible={isEditDrawerVisible}
        deleteChildDevice={deleteChildDevice}
        disableAssignBtn
      />
    </Fragment>
  );
};

export default connect(
  ({ settings, kz_account, kz_full_users, kz_brief_devices, kz_full_devices }) => ({
    settings,
    account: kz_account,
    full_users: kz_full_users,
    brief_devices: kz_brief_devices,
    full_devices: kz_full_devices,
  }),
)(UserDevices);
