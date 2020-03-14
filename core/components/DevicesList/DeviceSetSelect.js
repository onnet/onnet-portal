/* eslint-disable @typescript-eslint/camelcase */

import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import * as _ from 'lodash';

import { DownOutlined } from '@ant-design/icons';
import { Modal, Dropdown, Menu } from 'antd';

import { kzDevice } from '@/pages/onnet-portal/core/services/kazoo';

const { confirm } = Modal;

const DeviceSetSelect = props => {
  const [fieldContent, setFieldContent] = useState('Loading...');

  const {
    dispatch,
    account,
    full_devices,
    kz_login,
    device_id,
    title,
    menu_items,
    fieldKey,
    fieldType,
  } = props;

  useEffect(() => {
    if (full_devices[device_id]) {
      const fCont = _.get(full_devices[device_id].data, fieldKey);
      if (_.isArray(fCont)) {
        setFieldContent(_.join(fCont, ', '));
      } else {
        setFieldContent(fCont);
      }
    }
  }, [full_devices[device_id]]);

  const menu = (
    <Menu selectedKeys={[]} onClick={onDeviceRestrictionSelect}>
      {menu_items.map(item => (
        <Menu.Item key={item.key}>{item.text}</Menu.Item>
      ))}
    </Menu>
  );

  function onDeviceRestrictionSelect(event) {
    const { key, item } = event;
    console.log('event: ', event);
    console.log('key: ', key);
    console.log('item: ', item);
    confirm({
      title,
      content: <span style={{ paddingLeft: '6em' }}>{item.props.children}</span>,
      onOk() {
        const data = {};
	if (key === 'empty_array') {
          _.set(data, fieldKey, []);
        } else if (fieldType === 'array') {
          _.set(data, fieldKey, _.split(key, ','));
        } else {
          _.set(data, fieldKey, key);
        }
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

//  if (!kz_login.data.is_reseller) return fieldContent;

  return (
    <Dropdown overlay={menu} trigger={['click']}>
      <a className="ant-dropdown-link" href="#">
        {fieldContent} <DownOutlined />
      </a>
    </Dropdown>
  );
};

export default connect(({ kz_login, kz_account, kz_full_devices }) => ({
  account: kz_account,
  full_devices: kz_full_devices,
  kz_login,
}))(DeviceSetSelect);
