/* eslint-disable @typescript-eslint/camelcase */

import React from 'react';
import { connect } from 'umi';
import * as _ from 'lodash';

import { useIntl } from 'umi';
import { DownOutlined } from '@ant-design/icons';
import { Modal, Dropdown, Menu } from 'antd';

import { kzUser } from '@/pages/onnet-portal/core/services/kazoo';

const { confirm } = Modal;

const RsChildUserRestrictionLevel = props => {
  const { dispatch, child_account, owner_id, classifier, text } = props;
  const { formatMessage } = useIntl();

  const menuUserPrivLevels = (
    <Menu selectedKeys={[]} onClick={onUserRestrictionSelect}>
      <Menu.Item key="inherit">inherit</Menu.Item>
      <Menu.Item key="deny">deny</Menu.Item>
    </Menu>
  );

  function onUserRestrictionSelect(event) {
    const { key } = event;
    console.log('event: ', event);
    console.log('key: ', key);
    confirm({
      title: formatMessage({
        id: 'core.Privilege',
        defaultMessage: 'Privilege',
      }),
      content: <span style={{ paddingLeft: '6em' }}>{key}</span>,
      onOk() {
        const data = {};
        _.set(data, `call_restriction.${classifier}.action`, key);
        console.log('data: ', data);
        kzUser({
          method: 'PATCH',
          account_id: child_account.data?.id,
          owner_id,
          data,
        }).then(() =>
          dispatch({
            type: 'child_full_users/refresh',
            payload: { account_id: child_account.data?.id, owner_id },
          }),
        );
      },
      onCancel() {},
    });
  }

  return (
    <Dropdown overlay={menuUserPrivLevels} trigger={['click']}>
      <a className="ant-dropdown-link" href="#">
        {text} <DownOutlined />
      </a>
    </Dropdown>
  );
};

export default connect(({ child_account }) => ({
  child_account,
}))(RsChildUserRestrictionLevel);
