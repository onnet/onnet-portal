/* eslint-disable @typescript-eslint/camelcase */

import React from 'react';

import { useIntl } from 'umi';
import { Table, Card } from 'antd';

import AccountTimezone from './AccountTimezone';
import AccountMainNumber from './AccountMainNumber';
import AccountOutboundRouting from './AccountOutboundRouting';
import AccountMusicOnHold from './AccountMusicOnHold';
import AccountLanguage from './AccountLanguage';
import AccountCallsRecording from './AccountCallsRecording';
import AccountDialplan from './AccountDialplan';

import styles from '../../style.less';

const GeneralSettingsWidget = () => {
  const { formatMessage } = useIntl();
  const tableData = [
    {
      key: '1',
      name: formatMessage({
        id: 'telephony.main_account_number',
        defaultMessage: 'Main account number',
      }),
      value: <AccountMainNumber />,
    },
    {
      key: '11',
      name: formatMessage({
        id: 'telephony.account_language',
        defaultMessage: 'Account language',
      }),
      value: <AccountLanguage />,
    },
    {
      key: '2',
      name: formatMessage({
        id: 'telephony.all_calls_recording',
        defaultMessage: 'All calls recording',
      }),
      value: <AccountCallsRecording />,
    },
    {
      key: '5',
      name: formatMessage({
        id: 'telephony.account_timezone',
        defaultMessage: 'Account timezone',
      }),
      value: <AccountTimezone />,
    },
    {
      key: '6',
      name: formatMessage({
        id: 'telephony.music_on_hold',
        defaultMessage: 'Music on hold',
      }),
      value: <AccountMusicOnHold />,
    },
    {
      key: '7',
      name: formatMessage({
        id: 'telephony.dialplan',
        defaultMessage: 'Dialplan',
      }),
      value: <AccountDialplan />,
    },
    {
      key: '8',
      name: formatMessage({
        id: 'telephony.outbound_routing',
        defaultMessage: 'Outbound routing',
      }),
      value: <AccountOutboundRouting />,
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
      //      align: 'center',
    },
  ];

  return (
    <Card hoverable className={styles.card}>
      <Card.Meta
        title={formatMessage({
          id: 'telephony.general_settings',
          defaultMessage: 'General settings',
        })}
        description={
          <Table
            dataSource={tableData}
            columns={columns}
            pagination={false}
            showHeader={false}
            size="small"
          />
        }
      />
    </Card>
  );
};

export default GeneralSettingsWidget;
