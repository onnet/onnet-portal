/* eslint-disable @typescript-eslint/camelcase */

import React, { useState, useEffect } from 'react';
import { connect } from 'dva';

import { formatMessage } from 'umi-plugin-react/locale';
import { Table, Card, Switch, Menu, Dropdown, Icon, Modal } from 'antd';

import { kzAccount } from '@/pages/onnet-portal/core/services/kazoo';
import { runAndDispatch } from '@/pages/onnet-portal/core/utils/subroutine';
import AccountParagraph from '@/pages/onnet-portal/core/components/AccountParagraph';
import AccountTimezone from './AccountTimezone';
import AccountMainNumber from './AccountMainNumber';
import AccountOutboundRouting from './AccountOutboundRouting';
import AccountMusicOnHold from './AccountMusicOnHold';
import { AccountDialplans } from '../../../services/kazoo-telephony.ts';

import styles from '../../style.less';

const { confirm } = Modal;

const GeneralSettingsWidget = props => {
  const [accountDialplans, setAccountDialplans] = useState({});

  const { kazoo_account } = props;

  useEffect(() => {
    if (kazoo_account.data) {
      AccountDialplans({ account_id: kazoo_account.data.id }).then(res => {
        if (res.data) setAccountDialplans(res.data);
      });
    }
  }, [kazoo_account]);

  const menuAccountLanguage = (
    <Menu selectedKeys={[]} onClick={onAccountLanguageSelect}>
      <Menu.Item key="ru-ru">ru-ru</Menu.Item>
      <Menu.Item key="en-en">en-en</Menu.Item>
    </Menu>
  );

  function onAccountLanguageSelect(event) {
    const { key } = event;
    confirm({
      title: 'You are about to change account language:',
      content: <span style={{ paddingLeft: '6em' }}>{key}</span>,
      onOk() {
        runAndDispatch(kzAccount, 'kazoo_account/update', {
          method: 'PATCH',
          account_id: kazoo_account.data.id,
          data: { language: key },
        });
      },
      onCancel() {},
    });
  }

  function onCallRecordingSwitch(checked) {
    confirm({
      title: checked
        ? 'You are about to switch call recording ON'
        : 'You are about to switch call recording OFF',
      content: <span style={{ paddingLeft: '6em' }}>{checked}</span>,
      onOk() {
        runAndDispatch(kzAccount, 'kazoo_account/update', {
          method: 'PATCH',
          account_id: kazoo_account.data.id,
          data: { record_call: checked },
        });
      },
      onCancel() {},
    });
  }

  const menuAccountDialplan = (
    <Menu selectedKeys={[]} onClick={onAccountDialplanSelect}>
      {Object.keys(accountDialplans).map(dpKey => (
        <Menu.Item key={dpKey}>{dpKey}</Menu.Item>
      ))}
    </Menu>
  );

  function onAccountDialplanSelect({ key }) {
    confirm({
      title: 'You are about to change dialplan',
      content: <span style={{ paddingLeft: '6em' }}>To: {key}</span>,
      onOk() {
        runAndDispatch(kzAccount, 'kazoo_account/update', {
          method: 'PATCH',
          account_id: kazoo_account.data.id,
          data: { dial_plan: { system: [key] } },
        });
      },
      onCancel() {},
    });
  }

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
      value: (
        <Dropdown overlay={menuAccountLanguage} trigger={['click']}>
          <a className="ant-dropdown-link" href="#">
            {kazoo_account.data ? kazoo_account.data.language : null} <Icon type="down" />
          </a>
        </Dropdown>
      ),
    },
    {
      key: '2',
      name: formatMessage({
        id: 'telephony.all_calls_recording',
        defaultMessage: 'All calls recording',
      }),
      value: (
        <Switch
          size="small"
          checked={kazoo_account.data ? kazoo_account.data.record_call : false}
          onChange={onCallRecordingSwitch}
        />
      ),
    },
    {
      key: '4',
      name: 'AccountParagraph',
      value: (
        <AccountParagraph
          fieldKey="name"
          currentText={kazoo_account.data ? kazoo_account.data.name : 'Loading...'}
        />
      ),
    },
    {
      key: '5',
      name: formatMessage({ id: 'telephony.account_timezone', defaultMessage: 'Account timezone' }),
      value: <AccountTimezone />,
    },
    {
      key: '6',
      name: formatMessage({ id: 'telephony.music_on_hold', defaultMessage: 'Music on hold' }),
      value: <AccountMusicOnHold />,
    },
    {
      key: '7',
      name: formatMessage({ id: 'telephony.dialplan', defaultMessage: 'Dialplan' }),
      value: (
        <Dropdown overlay={menuAccountDialplan} trigger={['click']}>
          <a className="ant-dropdown-link" href="#">
            {kazoo_account.data
              ? kazoo_account.data.dial_plan
                ? kazoo_account.data.dial_plan.system
                : null
              : null}{' '}
            <Icon type="down" />
          </a>
        </Dropdown>
      ),
    },
    {
      key: '8',
      name: formatMessage({ id: 'telephony.outbound_routing', defaultMessage: 'Outbound routing' }),
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
        avatar={
          <img
            alt=""
            className={styles.cardAvatar}
            src="https://api.adorable.io/avatars/24/generalsettings.png"
          />
        }
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

export default connect(({ kazoo_account }) => ({
  kazoo_account,
}))(GeneralSettingsWidget);
