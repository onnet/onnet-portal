/* eslint-disable @typescript-eslint/camelcase */

import React from 'react';

import { formatMessage } from 'umi-plugin-react/locale';
import { Table, Switch } from 'antd';
import RsChildUserParagraph from './RsChildUserParagraph';
import RsChildUserSwitch from './RsChildUserSwitch';

const ResellerUserDiversion = props => {
  const { owner_id } = props;

  const tableData = [
    {
      key: '11',
      name: formatMessage({
        id: 'core.EnableCallForward',
        defaultMessage: 'Enable Call-Forward',
      }),
      value: (
        <RsChildUserSwitch
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
        <RsChildUserParagraph
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
      value: <Switch size="small" />,
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

export default ResellerUserDiversion;
