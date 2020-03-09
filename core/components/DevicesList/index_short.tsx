import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'dva';
import * as _ from 'loadsh';
import { DeleteOutlined, EditOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Drawer, Table, Card, Modal, Switch } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from '@/pages/onnet-portal/core/style.less';
import { cardProps } from '@/pages/onnet-portal/core/utils/props';
import CreateDevice from './CreateDevice';
import EditDevice from './EditDevice';
import DeviceParagraph from './DeviceParagraph';
import DeviceType from './DeviceType';
import info_details_fun from '@/pages/onnet-portal/core/components/info_details';
import { kzDevice } from '@/pages/onnet-portal/core/services/kazoo';

const { confirm } = Modal;

const DevicesList = props => {
  const [isPaginated, setIsPaginated] = useState({ position: 'bottom' });
  const [dataSource, setDataSource] = useState([]);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(false);

  const { dispatch, settings, account, brief_devices, full_devices, full_users } = props;

  useEffect(() => {
    if (brief_devices.data) {
      setDataSource(brief_devices.data);
    } else {
      dispatch({
        type: 'kz_brief_devices/refresh',
        payload: { account_id: account.data.id },
      });
    }
  }, [brief_devices]);

  if (brief_devices.data) {
    if (brief_devices.data.length === 0) {
      return null;
    }
  } else {
    return null;
  }

  const deleteChildDevice = record => {
    confirm({
      title: `Do you want to delete device ${record.username}?`,
      onOk() {
        kzDevice({ method: 'DELETE', account_id: account.data.id, device_id: record.id })
          .then(uRes => {
            console.log(uRes);
            dispatch({
              type: 'kz_brief_devices/refresh',
              payload: { account_id: account.data.id },
            });
          })
          .catch(() => console.log('Oops errors!', record));
      },
      onCancel() {},
    });
  };

  const columns = [
    {
      dataIndex: 'id',
      key: 'isDeviceEnabled',
      align: 'center',
      render: (text, record) => (
        <Switch
          size="small"
          checked={full_devices[record.id] ? full_devices[record.id].data.enabled : record.enabled}
          onChange={checked => onDeviceEnableSwitch(checked, record)}
        />
      ),
    },
    {
      title: formatMessage({ id: 'core.Type', defaultMessage: 'Type' }),
      dataIndex: 'device_type',
      key: 'device_type',
      render: (text, record) => (
        <DeviceType
          device_id={record.id}
          text={full_devices[record.id] ? full_devices[record.id].data.device_type : text}
        />
      ),
    },
    {
      title: formatMessage({ id: 'core.Devicename', defaultMessage: 'Devicename' }),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: formatMessage({ id: 'core.Username', defaultMessage: 'Username' }),
      dataIndex: 'username',
      key: 'username',
    },
    {
      dataIndex: 'id',
      key: 'edit_user',
      align: 'center',
      render: (text, record) => (
        <EditOutlined
          style={{ color: settings.primaryColor }}
          onClick={() => {
            setSelectedDevice(record.id);
            dispatch({
              type: 'kz_full_devices/refresh',
              payload: { account_id: account.data.id, device_id: record.id },
            });
            setIsDrawerVisible(true);
          }}
        />
      ),
    },
    {
      dataIndex: 'id',
      key: 'delete_user',
      align: 'center',
      render: (text, record) => (
        <DeleteOutlined
          style={{ color: settings.primaryColor }}
          onClick={() => deleteChildDevice(record)}
        />
      ),
    },
  ];

  const onDrawerClose = () => {
    setIsDrawerVisible(false);
  };

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
          .then(uRes => {
            console.log(uRes);
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

  const handlePagination = e => {
    console.log('handlePagination e: ', e);
    if (e) {
      setIsPaginated({ position: 'bottom' });
    } else {
      setIsPaginated(false);
    }
  };

  return (
    <Fragment>
      <Card hoverable className={styles.card} {...cardProps}>
        <Card.Meta
          title={
            <Fragment>
              {formatMessage({
                id: 'reseller_portal.accounts_devices',
                defaultMessage: "Account's Devices",
              })}
              <CreateDevice btnstyle={{ float: 'left1' }} />
              <p style={{ float: 'right', display: 'inline-flex' }}>
                {formatMessage({
                  id: 'core.pagination',
                  defaultMessage: 'pagination',
                })}
                :
                <Switch
                  style={{ marginLeft: '1em', marginTop: '0.4em' }}
                  checked={!!isPaginated}
                  onChange={handlePagination}
                  size="small"
                />
              </p>
            </Fragment>
          }
          description={
            <Table
              dataSource={brief_devices.data}
              columns={columns}
              pagination={isPaginated}
              size="small"
              rowKey={record => record.id}
            />
          }
        />
      </Card>
      <Drawer
        title={
          full_devices[selectedDevice] ? (
              <b style={{ color: settings.primaryColor }}>
                {' '}
                {full_devices[selectedDevice].data.name}
              </b>
          ) : null
        }
        width="50%"
        placement="right"
        onClose={onDrawerClose}
        visible={isDrawerVisible}
      >
        <EditDevice selectedDevice={selectedDevice} />
      </Drawer>
    </Fragment>
  );
};

export default connect(
  ({ settings, kz_account, kz_brief_devices, kz_full_devices, kz_full_users }) => ({
    settings,
    account: kz_account,
    brief_devices: kz_brief_devices,
    full_devices: kz_full_devices,
    full_users: kz_full_users,
  }),
)(DevicesList);
