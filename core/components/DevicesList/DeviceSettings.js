/* eslint-disable @typescript-eslint/camelcase */

import React from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import { Table } from 'antd';
import DeviceParagraph from './DeviceParagraph';
import DeviceSwitch from './DeviceSwitch';
import DeviceSetSelect from './DeviceSetSelect';

const DeviceSettings = props => {
  const { device_id, full_devices } = props;

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
        id: 'core.Device_nickname',
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
      key: '21',
      name: formatMessage({ id: 'core.Device_type', defaultMessage: "Device type", }),
      value: (
        <DeviceSetSelect
          device_id={device_id}
          text={full_devices ? full_devices[device_id].device_type : null}
          title={formatMessage({ id: 'core.Device_type', defaultMessage: "Device type", })}
          menu_items={[{key: 'sip_device', text: 'sip_device'},
		       {key: 'softphone', text: 'softphone'},
		       {key: 'cellphone', text: 'cellphone'},
		       {key: 'fax', text: 'fax'},
		       {key: 'sip_uri', text: 'sip_uri'},
	             ]}
          fieldKey="device_type"
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
            id: 'core.Record_calls',
            defaultMessage: "Record calls",
          })}
        />
      ),
    },
    {
      key: '4',
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

export default connect(({ kz_full_devices }) => ({
  full_devices: kz_full_devices,
}))(DeviceSettings);

