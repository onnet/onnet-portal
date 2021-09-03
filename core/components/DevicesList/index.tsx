import React, { Fragment, useState, useEffect } from 'react';
import { connect, useIntl } from 'umi';
import * as _ from 'lodash';
import { DeleteOutlined, EditOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Drawer, Table, Card, Modal, Switch } from 'antd';
import styles from '../../style.less';
import { cardProps } from '../../utils/props';
import CreateDevice from './CreateDevice';
import EditDevice from './EditDevice';
import DeviceType from './DeviceType';
import info_details_fun from '../info_details';
import { kzDevice } from '../../services/kazoo';

const { confirm } = Modal;

const DevicesList = (props) => {
  const { formatMessage } = useIntl();

  const [isPaginated, setIsPaginated] = useState({ position: 'bottom' });
  const [dataSource, setDataSource] = useState([]);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(false);

  const { dispatch, settings, kz_account, brief_devices, full_devices, full_users } = props;

  useEffect(() => {
    if (kz_account.data)
      if (brief_devices.data) {
        setDataSource(brief_devices.data);
      } else {
        dispatch({
          type: 'kz_brief_devices/refresh',
          payload: { account_id: kz_account.data.id },
        });
      }
  }, [brief_devices, kz_account]);

  if (!brief_devices.data) {
    return null;
  }

  const deleteChildDevice = (record) => {
    confirm({
      title: `Do you want to delete device ${record.username}?`,
      onOk() {
        kzDevice({ method: 'DELETE', account_id: kz_account.data.id, device_id: record.id })
          .then((uRes) => {
            console.log(uRes);
            dispatch({
              type: 'kz_brief_devices/refresh',
              payload: { account_id: kz_account.data.id },
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
          checked={record.enabled}
          onChange={(checked) => onDeviceEnableSwitch(checked, record)}
        />
      ),
    },
    {
      title: formatMessage({ id: 'core.Type', defaultMessage: 'Type' }),
      dataIndex: 'device_type',
      key: 'device_type',
      render: (text, record) => <DeviceType device_id={record.id} text={text} />,
    },
    {
      title: formatMessage({ id: 'core.Devicename', defaultMessage: 'Devicename' }),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: formatMessage({ id: 'core.Owner', defaultMessage: 'Owner' }),
      dataIndex: 'owner_id',
      key: 'owner_id',
      align: 'center',
      render: (text) =>
        full_users[text]
          ? `${full_users[text].data.username} (${full_users[text].data.first_name} ${full_users[text].data.last_name})`
          : null,
    },
    {
      title: formatMessage({ id: 'core.CID', defaultMessage: 'CID' }),
      key: 'device_cid',
      align: 'center',
      render: (record) => {
        const InternalCIDNumber = _.get(full_devices[record.id], 'data.caller_id.internal.number');
        const ExternalCIDNumber = _.get(full_devices[record.id], 'data.caller_id.external.number');
        if (InternalCIDNumber && ExternalCIDNumber) {
          return `${InternalCIDNumber} | ${ExternalCIDNumber}`;
        }
        if (InternalCIDNumber) {
          return InternalCIDNumber;
        }
        if (ExternalCIDNumber) {
          return ExternalCIDNumber;
        }
        return null;
      },
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
              payload: { account_id: kz_account.data.id, device_id: record.id },
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
    {
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      render: (text, record) => (
        <InfoCircleOutlined
          style={{ color: settings.primaryColor }}
          onClick={(event) => {
            console.log('event', event);
            const result = dataSource.find(({ id }) => id === record.id);
            console.log('result', result);
            info_details_fun(full_devices[record.id].data);
          }}
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
          {formatMessage({ id: 'core.Device', defaultMessage: 'Device' })}: {record.username}
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
          account_id: kz_account.data.id,
          device_id: record.id,
          data: { enabled: checked },
        })
          .then((uRes) => {
            console.log(uRes);
            dispatch({
              type: 'kz_full_devices/refresh',
              payload: { account_id: kz_account.data.id, device_id: record.id },
            });
          })
          .catch(() => console.log('Oops errors!', record));
      },
      onCancel() {},
    });
  }

  const handlePagination = (e) => {
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
              <CreateDevice btnstyle={{ float: 'right1' }} />
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
              rowKey={(record) => record.id}
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
    kz_account,
    brief_devices: kz_brief_devices,
    full_devices: kz_full_devices,
    full_users: kz_full_users,
  }),
)(DevicesList);
