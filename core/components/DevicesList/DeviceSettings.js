/* eslint-disable @typescript-eslint/camelcase */

import React from 'react';

import { formatMessage } from 'umi-plugin-react/locale';
import { Table } from 'antd';
import DeviceParagraph from './DeviceParagraph';
import DeviceSwitch from './DeviceSwitch';

const DeviceSettings = props => {
  const { device_id } = props;

  const tableData = [
    {
      key: '11',
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
      key: '2',
      name: formatMessage({
        id: 'core.Devicer_nickname',
        defaultMessage: 'Device nickname',
      }),
      value: (
        <DeviceParagraph
          fieldKey="name"
          device_id={device_id}
          style={{ marginBottom: '0' }}
        />
      ),
    },
    {
      key: '3',
      name: formatMessage({
        id: 'core.Record_calls',
        defaultMessage: "Record calls",
      }),
      value: (
        <DeviceSwitch
          fieldKey="record_call"
          device_id={device_id}
          style={{ marginBottom: '0' }}
          modal_title={formatMessage({
            id: 'core.Recordr_calls',
            defaultMessage: "Record calls",
          })}
        />
      ),
    },
    {
      key: '3',
      name: formatMessage({
        id: 'core.T38',
        defaultMessage: "T.38",
      }),
      value: (
        <DeviceSwitch
          fieldKey="media.fax_option"
          device_id={device_id}
          style={{ marginBottom: '0' }}
          modal_title={formatMessage({
            id: 'core.T38',
            defaultMessage: "T.38",
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

export default DeviceSettings;
