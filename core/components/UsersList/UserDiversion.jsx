import React from 'react';

import { formatMessage } from 'umi';
import { Table } from 'antd';
import UserParagraph from './UserParagraph';
import UserSwitch from './UserSwitch';

const UserDiversion = props => {
  const { owner_id } = props;

  const tableData = [
    {
      key: '11',
      name: formatMessage({
        id: 'core.EnableCallForward',
        defaultMessage: 'Enable Call-Forward',
      }),
      value: (
        <UserSwitch
          fieldKey="call_forward.enabled"
          owner_id={owner_id}
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
        <UserParagraph
          fieldKey="call_forward.number"
          owner_id={owner_id}
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
        <UserSwitch
          fieldKey="call_forward.substitute"
          owner_id={owner_id}
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
        <UserSwitch
          fieldKey="call_forward.require_keypress"
          owner_id={owner_id}
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
        <UserSwitch
          fieldKey="call_forward.keep_caller_id"
          owner_id={owner_id}
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
        <UserSwitch
          fieldKey="call_forward.direct_calls_only"
          owner_id={owner_id}
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

export default UserDiversion;
