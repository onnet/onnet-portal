/* eslint-disable @typescript-eslint/camelcase */

import React from 'react';

import { formatMessage } from 'umi';
import { Table } from 'antd';
import DeviceParagraph from './DeviceParagraph';
import DeviceSwitch from './DeviceSwitch';

const DeviceDiversion = props => {
  const { device_id } = props;

  const tableData = [
    {
      key: '11',
      name: formatMessage({
        id: 'core.EnableCallForward',
        defaultMessage: 'Enable Call-Forward',
      }),
      value: (
        <DeviceSwitch
          fieldKey="call_forward.enabled"
          device_id={device_id}
          style={{ marginBottom: '0' }}
          modal_title={formatMessage({
            id: 'core.EnableCallForward',
            defaultMessage: 'Enable Call-Forward',
          })}
        />
      ),
    },
    {
      key: '2',
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
      key: '3',
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
      key: '4',
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
      key: '5',
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
      key: '6',
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

export default DeviceDiversion;
