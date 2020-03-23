import React from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import { Table } from 'antd';
import DeviceParagraph from './DeviceParagraph';
import DeviceSwitch from './DeviceSwitch';
import DeviceSetSelect from './DeviceSetSelect';
import DeviceAssignTo from './DeviceAssignTo';

const DeviceCellPhoneSettings = props => {
  const { device_id, disableAssignBtn } = props;

  const tableData = [
    {
      key: '1',
      name: formatMessage({
        id: 'core.Device_nickname',
        defaultMessage: 'Device nickname',
      }),
      value: (
        <DeviceParagraph fieldKey="name" device_id={device_id} style={{ marginBottom: '0' }} />
      ),
    },
    {
      key: '2',
      name: formatMessage({ id: 'core.Device_type', defaultMessage: 'Device type' }),
      value: (
        <DeviceSetSelect
          device_id={device_id}
          title={formatMessage({ id: 'core.Device_type', defaultMessage: 'Device type' })}
          menu_items={[
            { key: 'sip_device', text: 'sip_device' },
            { key: 'softphone', text: 'softphone' },
            { key: 'cellphone', text: 'cellphone' },
            { key: 'fax', text: 'fax' },
            { key: 'sip_uri', text: 'sip_uri' },
          ]}
          fieldKey="device_type"
        />
      ),
    },
    {
      key: '3',
      name: formatMessage({
        id: 'core.Enabled',
        defaultMessage: 'Enabled',
      }),
      value: (
        <DeviceSwitch
          fieldKey="enabled"
          device_id={device_id}
          style={{ marginBottom: '0' }}
          modal_title={formatMessage({
            id: 'core.Enabled',
            defaultMessage: 'Enabled',
          })}
        />
      ),
    },
    {
      key: '21',
      name: formatMessage({
        id: 'core.Redirect_calls_to',
        defaultMessage: 'Redirect calls to',
      }),
      value: (
        <DeviceParagraph
          fieldKey="call_forward.number"
          device_id={device_id}
          style={{ marginBottom: '0' }}
        />
      ),
    },

    {
      key: '31',
      name: formatMessage({
        id: 'core.Bypass_users_phones',
        defaultMessage: "Bypass user's phones",
      }),
      value: (
        <DeviceSwitch
          fieldKey="call_forward.substitute"
          device_id={device_id}
          style={{ marginBottom: '0' }}
          modal_title={formatMessage({
            id: 'core.Bypass_users_phones',
            defaultMessage: "Bypass user's phones",
          })}
        />
      ),
    },
    {
      key: '41',
      name: formatMessage({
        id: 'core.RequireKeyPress',
        defaultMessage: 'Require Key Press',
      }),
      value: (
        <DeviceSwitch
          fieldKey="call_forward.require_keypress"
          device_id={device_id}
          style={{ marginBottom: '0' }}
          modal_title={formatMessage({
            id: 'core.RequireKeyPress',
            defaultMessage: 'Require Key Press',
          })}
        />
      ),
    },

    {
      key: '51',
      name: formatMessage({
        id: 'core.KeepCallerID',
        defaultMessage: 'Keep Caller ID',
      }),
      value: (
        <DeviceSwitch
          fieldKey="call_forward.keep_caller_id"
          device_id={device_id}
          style={{ marginBottom: '0' }}
          modal_title={formatMessage({
            id: 'core.KeepCallerID',
            defaultMessage: 'Keep Caller ID',
          })}
        />
      ),
    },
    {
      key: '61',
      name: formatMessage({
        id: 'core.DirectCallsOnly',
        defaultMessage: 'Direct Calls Only',
      }),
      value: (
        <DeviceSwitch
          fieldKey="call_forward.direct_calls_only"
          device_id={device_id}
          style={{ marginBottom: '0' }}
          modal_title={formatMessage({
            id: 'core.DirectCallsOnly',
            defaultMessage: 'Direct Calls Only',
          })}
        />
      ),
    },

    {
      key: '4',
      name: formatMessage({
        id: 'core.Assign_to',
        defaultMessage: 'Assign to',
      }),
      value: <DeviceAssignTo device_id={device_id} disableAssignBtn={disableAssignBtn} />,
    },
    {
      key: '9',
      name: formatMessage({
        id: 'core.Record_calls',
        defaultMessage: 'Record calls',
      }),
      value: (
        <DeviceSwitch
          fieldKey="record_call"
          device_id={device_id}
          style={{ marginBottom: '0' }}
          modal_title={formatMessage({
            id: 'core.Record_calls',
            defaultMessage: 'Record calls',
          })}
        />
      ),
    },
  ];

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: '50%',
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
    },
  ];

  return (
    <Table
      dataSource={tableData}
      columns={columns}
      pagination={false}
      showHeader={false}
      size="small"
    />
  );
};

export default DeviceCellPhoneSettings;
