/* eslint-disable @typescript-eslint/camelcase */

import React from 'react';
import { connect } from 'dva';

import { formatMessage } from 'umi-plugin-react/locale';
import { DownOutlined } from '@ant-design/icons';
import { Modal, Dropdown, Menu } from 'antd';

import { kzAccount } from '@/pages/onnet-portal/core/services/kazoo';
import { runAndDispatch } from '@/pages/onnet-portal/core/utils/subroutine';

const { confirm } = Modal;

const AccountLanguage = props => {
  const { kz_account } = props;

  const menuAccountLanguage = (
    <Menu selectedKeys={[]} onClick={onAccountLanguageSelect}>
      <Menu.Item key="ru-ru">ru-ru</Menu.Item>
      <Menu.Item key="en-en">en-en</Menu.Item>
    </Menu>
  );

  function onAccountLanguageSelect(event) {
    const { key } = event;
    confirm({
      title: formatMessage({
        id: 'telephony.account_language',
        defaultMessage: 'Account language',
      }),
      content: <span style={{ paddingLeft: '6em' }}>{key}</span>,
      onOk() {
        runAndDispatch(kzAccount, 'kz_account/update', {
          method: 'PATCH',
          account_id: kz_account.data.id,
          data: { language: key },
        });
      },
      onCancel() {},
    });
  }

  return (
    <Dropdown overlay={menuAccountLanguage} trigger={['click']}>
      <a className="ant-dropdown-link" href="#">
        {kz_account.data ? kz_account.data.language : null} <DownOutlined />
      </a>
    </Dropdown>
  );
};

export default connect(({ kz_account }) => ({
  kz_account,
}))(AccountLanguage);
