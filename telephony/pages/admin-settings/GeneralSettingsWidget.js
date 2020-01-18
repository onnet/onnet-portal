/* eslint-disable @typescript-eslint/camelcase */

import React, { useState, useEffect } from 'react';
import { connect } from 'dva';

import { formatMessage } from 'umi-plugin-react/locale';
import { Table, Card, Switch, Menu, Dropdown, Icon, Modal } from 'antd';

import { runAndDispatch } from '@/pages/onnet-portal/core/services/kazoo';
import AccountParagraph from '@/pages/onnet-portal/core/components/AccountParagraph';
import AccountTimezone from './AccountTimezone';

import styles from '../style.less';

const { confirm } = Modal;

const GeneralSettingsWidget = props => {

  const [ mediaName, setMediaName ] = useState('');

  const { kazoo_account, kazoo_account_numbers, kazoo_account_media } = props;

  useEffect(() => {
    if (kazoo_account.data) {
      const mediaObj = kazoo_account_media.data.find(({ id }) => id === kazoo_account.data.music_on_hold.media_id);
      if (mediaObj) setMediaName(mediaObj.name);
    }
  }, [kazoo_account, kazoo_account_media]);

  function externalNumber() {
    try {
      return kazoo_account.data.caller_id.external.number;
    } catch (e) {
      return 'no number selected';
    }
  }

  const menuMainNumber = (
    <Menu selectedKeys={[]} onClick={onMainNumberSelect}>
      {Object.keys(kazoo_account_numbers.data.numbers).map(number => (
        <Menu.Item key={number}>{number}</Menu.Item>
      ))}
    </Menu>
  );

  const menuAccountLanguage = (
    <Menu
      selectedKeys={[]}
      onClick={({ key }) =>
        runAndDispatch('kzAccount', 'kazoo_account/update', {
          method: 'PATCH',
          account_id: kazoo_account.data.id,
          data: { language: key },
        })
      }
    >
      <Menu.Item key="en">en</Menu.Item>
      <Menu.Item key="ru">ru</Menu.Item>
    </Menu>
  );

  function onMainNumberSelect(event) {
    const { key } = event;
    confirm({
      title: 'You are about to change main number to:',
      content: <span style={{ paddingLeft: '6em' }}>{key}</span>,
      onOk() {
        runAndDispatch('kzAccount', 'kazoo_account/update', {
          method: 'PATCH',
          account_id: kazoo_account.data.id,
          data: { caller_id: { external: { number: key, name: key } } },
        });
      },
      onCancel() {},
    });
  }

  const menuAccountMusicOnHold = (
    <Menu selectedKeys={[]} onClick={onMediaSelect}>
      {kazoo_account_media.data.map(media => (
        <Menu.Item key={media.id}>{media.name}</Menu.Item>
      ))}
    </Menu>
  );

  function onMediaSelect(event) {
    const { key } = event;
    confirm({
      title: 'You are about to change Music on hold:',
      content: <span style={{ paddingLeft: '6em' }}>
	         {kazoo_account_media.data.find(({ id }) => id === key).name}
	       </span>,
      onOk() {
        runAndDispatch('kzAccount', 'kazoo_account/update', {
          method: 'PATCH',
          account_id: kazoo_account.data.id,
          data: { music_on_hold: { media_id: key } },
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
      value: (
        <Dropdown overlay={menuMainNumber} trigger={['click']}>
          <a className="ant-dropdown-link" href="#">
            {externalNumber()} <Icon type="down" />
          </a>
        </Dropdown>
      ),
    },
    {
      key: '11',
      name: formatMessage({ id: 'telephony.account_language', defaultMessage: 'Account language' }),
      value: (
        <Dropdown overlay={menuAccountLanguage} trigger={['click']}>
          <a className="ant-dropdown-link" href="#">
            {kazoo_account.data.language} <Icon type="down" />
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
          checked={kazoo_account.data ? kazoo_account.data.record_call : false}
          onChange={checked => {
            runAndDispatch('kzAccount', 'kazoo_account/update', {
              method: 'PATCH',
              account_id: kazoo_account.data.id,
              data: { record_call: checked },
            });
          }}
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
      value: <AccountTimezone />
    },
    {
      key: '6',
      name: formatMessage({ id: 'telephony.music_on_hold', defaultMessage: 'Music on hold' }),
      value: (
        <Dropdown overlay={menuAccountMusicOnHold} trigger={['click']}>
          <a className="ant-dropdown-link" href="#">
            { mediaName } <Icon type="down" />
          </a>
        </Dropdown>
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
      align: 'center',
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

export default connect(({ kazoo_account, kazoo_account_numbers, kazoo_account_media }) => ({
  kazoo_account,
  kazoo_account_numbers,
  kazoo_account_media,
}))(GeneralSettingsWidget);
