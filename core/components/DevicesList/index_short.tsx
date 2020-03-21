import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'dva';
import * as _ from 'lodash';
import isIp from 'is-ip';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Drawer, Table, Card, Modal, Switch, Button } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from '@/pages/onnet-portal/core/style.less';
import { cardProps } from '@/pages/onnet-portal/core/utils/props';
import EditDevice from './EditDevice';
import CreateDeviceDrawer from './CreateDeviceDrawer';
import DeviceType from './DeviceType';
import { kzDevice, kzDevices } from '@/pages/onnet-portal/core/services/kazoo';

const { confirm } = Modal;

const DevicesList = props => {
  const [isPaginated, setIsPaginated] = useState({ position: 'bottom' });
  const [dataSource, setDataSource] = useState([]);
  const [isEditDrawerVisible, setIsEditDrawerVisible] = useState(false);
  const [isCreateDrawerVisible, setIsCreateDrawerVisible] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(false);
  const [createDeviceType, setCreateDeviceType] = useState('sip_device');

  const { dispatch, settings, account, brief_devices, full_devices } = props;
  const formRef_sip_device = React.createRef();
  const formRef_sip_uri = React.createRef();
  const formRef_cell_phone = React.createRef();

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

  const deleteChildDevice = (dev_id, dev_name, dev_username) => {
    confirm({
      title: `Delete device ${dev_name} ( ${dev_username} )?`,
      onOk() {
        kzDevice({ method: 'DELETE', account_id: account.data.id, device_id: dev_id })
          .then(uRes => {
            console.log(uRes);
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

  const onDrawerClose = () => {
    setIsEditDrawerVisible(false);
  };

  const onCloseCancel = () => {
    if (formRef_sip_device.current) formRef_sip_device.current.resetFields();
    if (formRef_sip_uri.current) formRef_sip_uri.current.resetFields();
    if (formRef_cell_phone.current) formRef_cell_phone.current.resetFields();
    setIsCreateDrawerVisible(false);
  };

  const onCloseSubmit = () => {
    if (createDeviceType === 'sip_device') {
      formRef_sip_device.current.submit();
    } else if (createDeviceType === 'cell_phone') {
      formRef_cell_phone.current.submit();
    } else if (createDeviceType === 'sip_uri') {
      formRef_sip_uri.current.submit();
    }
  };

  let createDeviceButton = null;

  console.log('createDeviceButton: ', createDeviceButton);

  if (createDeviceType === 'sip_device') {
    createDeviceButton = (
      <Button onClick={onCloseSubmit} type="primary">
        {formatMessage({ id: 'core.Create_sip_device', defaultMessage: 'Create SIP Device' })}
      </Button>
    );
  } else if (createDeviceType === 'cell_phone') {
    createDeviceButton = (
      <Button onClick={onCloseSubmit} type="primary">
        {formatMessage({ id: 'core.Create_cell_phone', defaultMessage: 'Create Cell Phone' })}
      </Button>
    );
  } else if (createDeviceType === 'sip_uri') {
    createDeviceButton = (
      <Button onClick={onCloseSubmit} type="primary">
        {formatMessage({ id: 'core.Create_sip_uri', defaultMessage: 'Create SIP URI' })}
      </Button>
    );
  } else {
    createDeviceButton = (
      <Button onClick={onCloseSubmit} type="primary">
        {formatMessage({ id: 'core.Create_device', defaultMessage: 'Create device' })}
      </Button>
    );
  }

  const onDeviceCreateFinish = values => {
    console.log('Success:', values);
    let newDevice = {};
    _.set(newDevice, 'device_type', values.device_type);
    _.set(newDevice, 'name', values.device_nickname);
    _.set(newDevice, 'accept_charges', true);
    if (isIp(values.sip_ip_auth)) {
      _.set(newDevice, 'sip.method', 'ip');
      _.set(newDevice, 'sip.ip', values.sip_ip_auth);
    } else {
      _.set(newDevice, 'sip.method', 'password');
      _.set(newDevice, 'sip.username', values.device_username);
      _.set(newDevice, 'sip.password', values.device_password);
    }
    if (values.sip_uri) {
      _.set(newDevice, 'sip.invite_format', 'route');
      _.set(newDevice, 'sip.route', values.sip_uri);
    } else {
      _.set(newDevice, 'sip.invite_format', 'username');
    }
    if (values.redirect_number) {
      _.set(newDevice, 'call_forward.enabled', true);
      _.set(newDevice, 'call_forward.number', values.redirect_number);
    }
    console.log('values.sip_ip_auth:', values.sip_ip_auth);
    console.log('isIp:', isIp(values.sip_ip_auth));
    console.log('newDevice:', newDevice);

    kzDevices({
      method: 'PUT',
      account_id: account.data.id,
      data: newDevice,
    }).then(uRes => {
      console.log(uRes);
      dispatch({
        type: 'kz_brief_devices/refresh',
        payload: { account_id: account.data.id },
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
              <PlusOutlined
                style={{ color: settings.primaryColor, marginLeft: '1em' }}
                onClick={() => {
                  setIsCreateDrawerVisible(true);
                }}
              />
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
              dataSource={dataSource}
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
            <>
              <b style={{ color: settings.primaryColor }}>
                {' '}
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
        width="50%"
        placement="right"
        onClose={onDrawerClose}
        visible={isEditDrawerVisible}
      >
        <EditDevice selectedDevice={selectedDevice} />
      </Drawer>
      <Drawer
        title={
          <b style={{ color: settings.primaryColor }}>
            {formatMessage({ id: 'core.Create_device', defaultMessage: 'Create device' })}
          </b>
        }
        width="50%"
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
          formRef_cell_phone={formRef_cell_phone}
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
