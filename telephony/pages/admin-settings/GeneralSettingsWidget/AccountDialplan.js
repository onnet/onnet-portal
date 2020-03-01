/* eslint-disable @typescript-eslint/camelcase */

import React, { useState, useEffect } from 'react';
import { connect } from 'dva';

import { formatMessage } from 'umi-plugin-react/locale';
import { DownOutlined } from '@ant-design/icons';
import { Modal, Dropdown, Menu } from 'antd';

import { AccountDialplans } from '../../../services/kazoo-telephony.ts';
import { kzAccount } from '@/pages/onnet-portal/core/services/kazoo';
import { runAndDispatch } from '@/pages/onnet-portal/core/utils/subroutine';

const { confirm } = Modal;

const AccountDialplan = props => {
  const [accountDialplans, setAccountDialplans] = useState({});

  const { kazoo_account } = props;

  useEffect(() => {
    if (kazoo_account.data) {
      AccountDialplans({ account_id: kazoo_account.data.id }).then(res => {
        if (res.data) setAccountDialplans(res.data);
      });
    }
  }, [kazoo_account]);

  const menuAccountDialplan = (
    <Menu selectedKeys={[]} onClick={onAccountDialplanSelect}>
      {Object.keys(accountDialplans).map(dpKey => (
        <Menu.Item key={dpKey}>{dpKey}</Menu.Item>
      ))}
    </Menu>
  );

  function onAccountDialplanSelect({ key }) {
    confirm({
      title: formatMessage({
        id: 'telephony.dialplan',
        defaultMessage: 'Dialplan',
      }),
      content: (
        <span style={{ paddingLeft: '4em' }}>
          {formatMessage({ id: 'core.change_to', defaultMessage: 'Change to' })} <b>{key}</b>
        </span>
      ),
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

  return (
    <Dropdown overlay={menuAccountDialplan} trigger={['click']}>
      <a className="ant-dropdown-link" href="#">
        {kazoo_account.data
          ? kazoo_account.data.dial_plan
            ? kazoo_account.data.dial_plan.system
            : null
          : null}{' '}
        <DownOutlined />
      </a>
    </Dropdown>
  );
};

export default connect(({ kazoo_account }) => ({
  kazoo_account,
}))(AccountDialplan);
