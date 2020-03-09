/* eslint-disable @typescript-eslint/camelcase */

import React from 'react';
import { connect } from 'dva';
import * as _ from 'lodash';

import { formatMessage } from 'umi-plugin-react/locale';
import { DownOutlined } from '@ant-design/icons';
import { Modal, Dropdown, Menu } from 'antd';

import { kzDevice } from '@/pages/onnet-portal/core/services/kazoo';

const { confirm } = Modal;

const DeviceType = props => {
  const { dispatch, account, kz_login, device_id, text } = props;

  const menuDevicePrivLevels = (
    <Menu selectedKeys={[]} onClick={onDeviceRestrictionSelect}>
      <Menu.Item key="sip_device">sip_device</Menu.Item>
      <Menu.Item key="softphone">softphone</Menu.Item>
      <Menu.Item key="cellphone">cellphone</Menu.Item>
      <Menu.Item key="fax">fax</Menu.Item>
      <Menu.Item key="sip_uri">sip_uri</Menu.Item>
    </Menu>
  );

  function onDeviceRestrictionSelect(event) {
    const { key } = event;
    console.log('event: ', event);
    console.log('key: ', key);
    confirm({
      title: formatMessage({
        id: 'core.DeviceType',
        defaultMessage: 'Device type',
      }),
      content: <span style={{ paddingLeft: '6em' }}>{key}</span>,
      onOk() {
        const data = {};
        _.set(data, `device_type`, key);
        console.log('data: ', data);
        kzDevice({
          method: 'PATCH',
          account_id: account.data.id,
          device_id,
          data,
        }).then(() =>
          dispatch({
            type: 'kz_full_devices/refresh',
            payload: { account_id: account.data.id, device_id },
          }),
        );
      },
      onCancel() {},
    });
  }

  if (!kz_login.data.is_reseller) return text;

  return (
    <Dropdown overlay={menuDevicePrivLevels} trigger={['click']}>
      <a className="ant-dropdown-link" href="#">
        {text} <DownOutlined />
      </a>
    </Dropdown>
  );
};

export default connect(({ kz_login, kz_account }) => ({
  account: kz_account,
  kz_login,
}))(DeviceType);
