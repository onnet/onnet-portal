/* eslint-disable @typescript-eslint/camelcase */

import React from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import { Table } from 'antd';
import DeviceParagraph from './DeviceParagraph';
import DeviceSwitch from './DeviceSwitch';
import DeviceSetSelect from './DeviceSetSelect';

const DeviceSettings = props => {
  const { device_id, account } = props;

  const tableData = [
    {
      key: '1',
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
      key: '2',
      name: formatMessage({ id: 'core.Device_type', defaultMessage: "Device type", }),
      value: (
        <DeviceSetSelect
          device_id={device_id}
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
      key: '4',
      name: formatMessage({
        id: 'core.Assign_to',
        defaultMessage: 'Assign to',
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
      key: '5',
      name: formatMessage({
        id: 'core.realm',
        defaultMessage: 'Realm',
      }),
      value: account.data.realm,
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
      key: '7',
      name: formatMessage({
        id: 'core.Password',
        defaultMessage: 'Password',
      }),
      value: (
        <DeviceParagraph
          fieldKey="sip.password"
          device_id={device_id}
          style={{ marginBottom: '0' }}
        />
      ),
    },
    {
      key: '8',
      name: formatMessage({
        id: 'core.Invite_format',
        defaultMessage: 'Invite format',
      }),
      value: (
        <DeviceSetSelect
          device_id={device_id}
          title={formatMessage({ id: 'core.Invite_format', defaultMessage: "Invite format", })}
          menu_items={[{key: 'username', text: 'username'},
		       {key: 'e164', text: 'e164'},
		       {key: 'route', text: 'route'},
		       {key: 'contact', text: 'contact'},
	             ]}
          fieldKey="sip.invite_format"
        />
      ),
    },
    {
      key: '9',
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
      key: '10',
      name: formatMessage({
        id: 'core.Dialplan',
        defaultMessage: 'Dialplan',
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
      key: '11',
      name: formatMessage({
        id: 'core.Music_on_hold',
        defaultMessage: 'Music on hold',
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
      key: '12',
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
    {
      key: '13',
      name: formatMessage({
        id: 'core.Encryption_methods',
        defaultMessage: 'Encryption methods',
      }),
      value: (
        <DeviceSetSelect
          device_id={device_id}
          title={formatMessage({ id: 'core.Encryption_methods', defaultMessage: "Encryption methods", })}
          menu_items={[{key: ['srtp'], text: 'srtp1'},
		       {key: ['zrtp'], text: 'zrtp1'},
		       {key: ['srtp','zrtp'], text: 'srtp1, zrtp1'},
		       {key: [], text: 'No encryption1'},
	             ]}
          fieldKey="media.encryption.methods"
        />
      ),
    },
    {
      key: '14',
      name: formatMessage({
        id: 'core.Enforce_rtp_encryption',
        defaultMessage: 'Enforce rtp encryption',
      }),
      value: (
        <DeviceSwitch
          fieldKey="media.encryption.enforce_security"
          device_id={device_id}
          style={{ marginBottom: '0' }}
          modal_title={formatMessage({
            id: 'core.Enforce_rtp_encryption',
            defaultMessage: "Enforce rtp encryption",
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

export default connect(({ kz_account }) => ({
  account: kz_account,
}))(DeviceSettings);

