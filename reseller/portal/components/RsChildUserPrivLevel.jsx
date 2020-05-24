/* eslint-disable @typescript-eslint/camelcase */

import React from 'react';

import { connect,formatMessage } from 'umi';
import { DownOutlined } from '@ant-design/icons';
import { Modal, Dropdown, Menu } from 'antd';

import { kzUser } from '@/pages/onnet-portal/core/services/kazoo';

const { confirm } = Modal;

const RsChildUserPrivLevel = props => {
  const { dispatch, child_account, child_full_users, owner_id } = props;

  const menuUserPrivLevels = (
    <Menu selectedKeys={[]} onClick={onUserPrivilegeSelect}>
      <Menu.Item key="admin">admin</Menu.Item>
      <Menu.Item key="user">user</Menu.Item>
    </Menu>
  );

  function onUserPrivilegeSelect(event) {
    const { key } = event;
    confirm({
      title: formatMessage({
        id: 'core.Privilege',
        defaultMessage: 'Privilege',
      }),
      content: <span style={{ paddingLeft: '6em' }}>{key}</span>,
      onOk() {
        kzUser({
          method: 'PATCH',
          account_id: child_account.data.id,
          owner_id,
          data: { priv_level: key },
        }).then(() =>
          dispatch({
            type: 'child_full_users/refresh',
            payload: { account_id: child_account.data.id, owner_id },
          }),
        );
      },
      onCancel() {},
    });
  }

  return (
    <Dropdown overlay={menuUserPrivLevels} trigger={['click']}>
      <a className="ant-dropdown-link" href="#">
        {child_full_users[owner_id] ? child_full_users[owner_id].data.priv_level : null}{' '}
        <DownOutlined />
      </a>
    </Dropdown>
  );
};

export default connect(({ child_account, child_full_users }) => ({
  child_account,
  child_full_users,
}))(RsChildUserPrivLevel);
