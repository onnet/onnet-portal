/* eslint-disable @typescript-eslint/camelcase */

import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import * as _ from 'lodash';
import { formatMessage } from 'umi-plugin-react/locale';
import { DownOutlined } from '@ant-design/icons';
import { Modal, Dropdown, Menu } from 'antd';

import { kzDevice } from '@/pages/onnet-portal/core/services/kazoo';

const { confirm } = Modal;

const DeviceAssignTo = props => {
  const [fieldContent, setFieldContent] = useState('No assignment');

  const { dispatch, account, full_devices, brief_users, full_users, device_id } = props;

  useEffect(() => {
    if (full_devices[device_id]) {
      let ownerId = full_devices[device_id].data.owner_id;
      if (ownerId) {
        setFieldContent(full_users[ownerId].data.username);
      } else {
        setFieldContent(formatMessage({ id: 'core.No_owner', defaultMessage: '-No owner-' }));
      }
    }
  }, [account, full_devices, full_users]);

  if (!full_devices[device_id]) return null;
  const menu = (
    <Menu selectedKeys={[]} onClick={onSelect}>
      {brief_users.data.map(user => (
        <Menu.Item key={user.id}>{user.username}</Menu.Item>
      ))}
      <Menu.Item key="no_owner_key">
        {formatMessage({ id: 'core.No_owner', defaultMessage: '-No owner-' })}
      </Menu.Item>
    </Menu>
  );

  function onSelect(event) {
    const { key } = event;
    confirm({
      title: formatMessage({ id: 'core.Assign_to', defaultMessage: 'Assign to' }),
      content: <span style={{ paddingLeft: '6em' }}>{full_users[key] ? full_users[key].data.username : '-No owner-'}</span>,
      onOk() {
        if (key === "no_owner_key") {
          kzDevice({
            method: 'GET',
            account_id: account.data.id,
            device_id,
          }).then(res => {
              kzDevice({
                method: 'POST',
                account_id: account.data.id,
                device_id,
                data: _.omit(res.data, 'owner_id'),
              }).then(() =>
                dispatch({
                  type: 'kz_full_devices/refresh',
                  payload: { account_id: account.data.id, device_id },
                }),
              );
            }
          )
        } else {
          kzDevice({
            method: 'PATCH',
            account_id: account.data.id,
            device_id,
            data: { owner_id: key },
          }).then(() =>
            dispatch({
              type: 'kz_full_devices/refresh',
              payload: { account_id: account.data.id, device_id },
            }),
          );
        }
      },
      onCancel() {},
    });
  }

  return (
    <Dropdown overlay={menu} trigger={['click']}>
      <a className="ant-dropdown-link" href="#">
        {fieldContent} <DownOutlined />
      </a>
    </Dropdown>
  );
};

export default connect(({ kz_account, kz_full_devices, kz_brief_users, kz_full_users }) => ({
  account: kz_account,
  full_devices: kz_full_devices,
  brief_users: kz_brief_users,
  full_users: kz_full_users,
}))(DeviceAssignTo);
