import React, { Fragment, useState, useEffect } from 'react';
import { connect, useIntl } from 'umi';
import { useMediaQuery } from 'react-responsive';
import cryptoRandomString from 'crypto-random-string';
import * as _ from 'lodash';
import isIp from 'is-ip';
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { Drawer, Table, Card, Modal, Switch, Button } from 'antd';
import styles from '../../style.less';
import gh_styles from '../HeaderSearch/globhead.less';
import { cardProps } from '../../utils/props';
import EditDeviceDrawer from './EditDeviceDrawer';
import CreateDeviceDrawer from './CreateDeviceDrawer';
import DeviceType from './DeviceType';
import HeaderSearch from '../HeaderSearch';
import { kzDevice, kzDevices } from '../../services/kazoo';

const { confirm } = Modal;

const DevicesList = (props) => {
  const { formatMessage } = useIntl();

  const [isPaginated, setIsPaginated] = useState({ position: 'bottom' });
  const [dataSource, setDataSource] = useState([]);
  const [isEditDrawerVisible, setIsEditDrawerVisible] = useState(false);
  const [isCreateDrawerVisible, setIsCreateDrawerVisible] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(false);
  const [createDeviceType, setCreateDeviceType] = useState('sip_device');

  const { dispatch, settings, account, brief_devices, full_devices } = props;
  const formRef_sip_device = React.createRef();
  const formRef_sip_uri = React.createRef();
  const formRef_cellphone = React.createRef();
  const isSmallDevice = useMediaQuery({ maxWidth: 991 });

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

  if (!brief_devices.data) {
    return null;
  }

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

  const columns = [
    {
      dataIndex: 'id',
      key: 'isDeviceEnabled',
      align: 'center',
      render: (text, record) => (
        <Switch
          size="small"
          checked={full_devices[record.id] ? full_devices[record.id].data.enabled : record.enabled}
          onChange={(checked) => onDeviceEnableSwitch(checked, record)}
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
      key: 'edit_device',
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
            setIsEditDrawerVisible(true);
          }}
        />
      ),
    },
    {
      dataIndex: 'id',
      key: 'delete_device',
      align: 'center',
      render: (text, record) => (
        <DeleteOutlined
          style={{ color: settings.primaryColor }}
          onClick={() => deleteChildDevice(record.id, record.name, record.username)}
        />
      ),
    },
  ];

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
            dispatch({
              type: 'kz_brief_devices/refresh',
              payload: { account_id: account.data.id },
              timeout: 1000,
            });
          })
          .catch(() => console.log('Oops errors!', record));
      },
      onCancel() {},
    });
  }

  const handlePagination = (e) => {
    if (e) {
      setIsPaginated({ position: 'bottom' });
    } else {
      setIsPaginated(false);
    }
  };

  const onDrawerClose = () => {
    setIsEditDrawerVisible(false);
  };

  const onCloseCancel = () => {
    if (formRef_sip_device.current) formRef_sip_device.current.resetFields();
    if (formRef_sip_uri.current) formRef_sip_uri.current.resetFields();
    if (formRef_cellphone.current) formRef_cellphone.current.resetFields();
    setIsCreateDrawerVisible(false);
  };

  const onCloseSubmit = () => {
    if (createDeviceType === 'sip_device') {
      formRef_sip_device.current.submit();
    } else if (createDeviceType === 'cellphone') {
      formRef_cellphone.current.submit();
    } else if (createDeviceType === 'sip_uri') {
      formRef_sip_uri.current.submit();
    }
  };

  let createDeviceButton = null;

  if (createDeviceType === 'sip_device') {
    createDeviceButton = (
      <Button onClick={onCloseSubmit} type="primary">
        {formatMessage({ id: 'core.Create_sip_device', defaultMessage: 'Create SIP Device' })}
      </Button>
    );
  } else if (createDeviceType === 'cellphone') {
    createDeviceButton = (
      <Button onClick={onCloseSubmit} type="primary">
        {formatMessage({ id: 'core.Create_cellphone', defaultMessage: 'Create Cell Phone' })}
      </Button>
    );
  } else if (createDeviceType === 'sip_uri') {
    createDeviceButton = (
      <Button onClick={onCloseSubmit} type="primary">
        {formatMessage({ id: 'core.Create_sip_uri', defaultMessage: 'Create SIP URI' })}
      </Button>
    );
  } else if (createDeviceType === 'sip_fmc') {
    createDeviceButton = (
      <Button onClick={onCloseSubmit} type="primary">
        {formatMessage({ id: 'core.Create_sip_fmc', defaultMessage: 'Create FMC Device' })}
      </Button>
    );
  } else {
    createDeviceButton = (
      <Button onClick={onCloseSubmit} type="primary">
        {formatMessage({ id: 'core.Create_device', defaultMessage: 'Create device' })}
      </Button>
    );
  }

  const onDeviceCreateFinish = (values) => {
    console.log('Success:', values);
    const newDevice = {};
    _.set(newDevice, 'device_type', values.device_type);
    _.set(newDevice, 'name', values.device_nickname);
    _.set(newDevice, 'accept_charges', true);
    _.set(newDevice, 'suppress_unregister_notifications', true);
    _.set(newDevice, 'register_overwrite_notify', true);
    _.set(
      newDevice,
      'sip.username',
      values.device_username || `user_${cryptoRandomString({ length: 7 })}`,
    );
    _.set(
      newDevice,
      'sip.password',
      values.device_password || `${cryptoRandomString({ length: 12 })}`,
    );
    if (isIp(values.sip_ip_auth)) {
      _.set(newDevice, 'sip.method', 'ip');
      _.set(newDevice, 'sip.ip', values.sip_ip_auth);
    } else {
      _.set(newDevice, 'sip.method', 'password');
    }
    if (values.sip_uri) {
      _.set(newDevice, 'sip.invite_format', 'route');
      _.set(newDevice, 'sip.route', values.sip_uri);
    } else {
      _.set(newDevice, 'sip.invite_format', 'username');
    }
    if (values.redirect_number) {
      _.set(newDevice, 'call_forward.enabled', true);
      _.set(newDevice, 'call_forward.keep_caller_id', false);
      _.set(newDevice, 'call_forward.require_keypress', false);
      _.set(newDevice, 'call_forward.number', values.redirect_number);
    }
    console.log('newDevice:', newDevice);

    kzDevices({
      method: 'PUT',
      account_id: account.data.id,
      data: newDevice,
    }).then((uRes) => {
      dispatch({
        type: 'kz_brief_devices/refresh',
        payload: { account_id: account.data.id },
        timeout: 500,
      });
      setSelectedDevice(uRes.data.id);
      dispatch({
        type: 'kz_full_devices/refresh',
        payload: { account_id: account.data.id, device_id: uRes.data.id },
      });
      setIsEditDrawerVisible(true);
      onCloseCancel();
    });
  };

  const onSearchChange = (value) => {
    console.log('Value: ', value);
    if (value.length > 1) {
      const searchRes = _.filter(brief_devices.data, (o) =>
        _.includes(_.toString(Object.values(o)).toLowerCase(), value.toLowerCase()),
      );
      setDataSource(searchRes);
    } else {
      setDataSource(brief_devices.data);
    }
  };

  return (
    <Fragment>
      <Card hoverable className={styles.card} {...cardProps}>
        <Card.Meta
          title={
            <Fragment>
              {!isSmallDevice
                ? formatMessage({
                    id: 'reseller_portal.accounts_devices',
                    defaultMessage: "Account's Devices",
                  })
                : null}
              <PlusOutlined
                style={{ color: settings.primaryColor, marginLeft: '1em' }}
                onClick={() => {
                  setIsCreateDrawerVisible(true);
                }}
              />
              <HeaderSearch
                className={`${gh_styles.action} ${gh_styles.search}`}
                style={{ marginLeft: '1em', display: 'inline-flex' }}
                onSearch={(value) => {
                  console.log('input', value);
                }}
                onChange={onSearchChange}
              />
              <p style={{ float: 'right', display: 'inline-flex' }}>
                {!isSmallDevice
                  ? `${formatMessage({
                      id: 'core.pagination',
                      defaultMessage: 'pagination',
                    })}: `
                  : null}
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
              dataSource={dataSource}
              columns={columns}
              pagination={isPaginated}
              size="small"
              rowKey={(record) => record.id}
            />
          }
        />
      </Card>
      <EditDeviceDrawer
        selectedDevice={selectedDevice}
        onDrawerClose={onDrawerClose}
        isEditDrawerVisible={isEditDrawerVisible}
        deleteChildDevice={deleteChildDevice}
      />
      <Drawer
        title={
          <b style={{ color: settings.primaryColor }}>
            {formatMessage({ id: 'core.Create_device', defaultMessage: 'Create device' })}
          </b>
        }
        width={isSmallDevice ? '100%' : '50%'}
        placement="right"
        onClose={onCloseCancel}
        visible={isCreateDrawerVisible}
        bodyStyle={{ paddingBottom: 80 }}
        footer={
          <div
            style={{
              textAlign: 'right',
            }}
          >
            {createDeviceButton}
          </div>
        }
      >
        <CreateDeviceDrawer
          formRef_sip_device={formRef_sip_device}
          formRef_sip_uri={formRef_sip_uri}
          formRef_cellphone={formRef_cellphone}
          setCreateDeviceType={setCreateDeviceType}
          onFinish={onDeviceCreateFinish}
        />
      </Drawer>
    </Fragment>
  );
};

export default connect(({ settings, kz_account, kz_brief_devices, kz_full_devices }) => ({
  settings,
  account: kz_account,
  brief_devices: kz_brief_devices,
  full_devices: kz_full_devices,
}))(DevicesList);
