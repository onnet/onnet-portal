/* eslint-disable @typescript-eslint/camelcase */

import React, { useState, useEffect } from 'react';
import { connect } from 'dva';

import { formatMessage } from 'umi-plugin-react/locale';
import { Table, Card, Switch, Menu, Dropdown, Icon, Modal } from 'antd';

import { runAndDispatch } from '@/pages/onnet-portal/core/services/kazoo';
import AccountParagraph from '@/pages/onnet-portal/core/components/AccountParagraph';
import AccountTimezone from './AccountTimezone';
import AccountMainNumber from './AccountMainNumber';
import { AccountDialplans } from '../../../services/kazoo-telephony.ts';

import styles from '../../style.less';

const { confirm } = Modal;

const GeneralSettingsWidget = props => {
  const [mediaName, setMediaName] = useState('');
  const [accountDialplans, setAccountDialplans] = useState({});

  const { kazoo_account, kazoo_account_media } = props;

  useEffect(() => {
    if (kazoo_account.data) {
      const mediaObj = kazoo_account_media.data.find(
        ({ id }) => id === kazoo_account.data.music_on_hold.media_id,
      );
      if (mediaObj) {
        setMediaName(mediaObj.name);
      } else {
        setMediaName('Default music');
      }
      AccountDialplans({ account_id: kazoo_account.data.id }).then(res => {
        if (res.data) setAccountDialplans(res.data);
      });
    }
  }, [kazoo_account, kazoo_account_media]);

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
        runAndDispatch('kzAccount', 'kazoo_account/update', {
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
        runAndDispatch('kzAccount', 'kazoo_account/update', {
          method: 'PATCH',
          account_id: kazoo_account.data.id,
          data: { record_call: checked },
        });
      },
      onCancel() {},
    });
  }

  const menuAccountMusicOnHold = (
    <Menu selectedKeys={[]} onClick={onMediaSelect}>
      <Menu.Item key="">Default music</Menu.Item>
      {kazoo_account_media.data.map(media => (
        <Menu.Item key={media.id}>{media.name}</Menu.Item>
      ))}
    </Menu>
  );

  function onMediaSelect(event) {
    const { key } = event;
    const mediaJObj = kazoo_account_media.data.find(({ id }) => id === key);
    const currMediaName = mediaJObj ? mediaJObj.name : 'Default music';
    const mediaBag = mediaJObj ? { media_id: key } : {};
    confirm({
      title: 'You are about to change Music on hold:',
      content: <span style={{ paddingLeft: '6em' }}>{currMediaName}</span>,
      onOk() {
        runAndDispatch('kzAccount', 'kazoo_account/update', {
          method: 'PATCH',
          account_id: kazoo_account.data.id,
          data: { music_on_hold: mediaBag },
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
        runAndDispatch('kzAccount', 'kazoo_account/update', {
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
      value: (
        <Dropdown overlay={menuAccountMusicOnHold} trigger={['click']}>
          <a className="ant-dropdown-link" href="#">
            {mediaName} <Icon type="down" />
          </a>
        </Dropdown>
      ),
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
      value: 'Outbound routing',
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

export default connect(({ kazoo_account, kazoo_account_media }) => ({
  kazoo_account,
  kazoo_account_media,
}))(GeneralSettingsWidget);
