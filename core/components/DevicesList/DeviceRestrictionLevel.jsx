/* eslint-disable @typescript-eslint/camelcase */

import React from 'react';
import { connect, useIntl } from 'umi';
import * as _ from 'lodash';
import { DownOutlined } from '@ant-design/icons';
import { Modal, Dropdown, Menu } from 'antd';

import { kzDevice } from '../../services/kazoo';

const { confirm } = Modal;

const DeviceRestrictionLevel = (props) => {
  const { dispatch, account, device_id, classifier, text } = props;
  const { formatMessage } = useIntl();

  const menuDevicePrivLevels = (
    <Menu selectedKeys={[]} onClick={onDeviceRestrictionSelect}>
      <Menu.Item key="inherit">inherit</Menu.Item>
      <Menu.Item key="deny">deny</Menu.Item>
    </Menu>
  );

  function onDeviceRestrictionSelect(event) {
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

  return (
    <Dropdown overlay={menuDevicePrivLevels} trigger={['click']}>
      <a className="ant-dropdown-link" href="#">
        {text} <DownOutlined />
      </a>
    </Dropdown>
  );
};

export default connect(({ kz_account }) => ({
  account: kz_account,
}))(DeviceRestrictionLevel);
