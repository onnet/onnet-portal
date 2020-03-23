import React from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import { Table } from 'antd';
import DeviceParagraph from './DeviceParagraph';
import DeviceSwitch from './DeviceSwitch';
import DeviceSetSelect from './DeviceSetSelect';
import DeviceAssignTo from './DeviceAssignTo';

const DeviceFMCSettings = props => {
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
      key: '6',
      name: formatMessage({
        id: 'core.Username',
        defaultMessage: 'Username',
      }),
      value: (
        <DeviceParagraph
          fieldKey="sip.username"
          device_id={device_id}
          style={{ marginBottom: '0' }}
        />
      ),
    },
    {
      key: '31',
      name: formatMessage({
        id: 'core.SIP_URI',
        defaultMessage: 'SIP URI',
      }),
      value: (
        <DeviceParagraph fieldKey="sip.route" device_id={device_id} style={{ marginBottom: '0' }} />
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

export default DeviceFMCSettings;
