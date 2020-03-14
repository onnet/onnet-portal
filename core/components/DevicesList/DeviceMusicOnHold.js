/* eslint-disable @typescript-eslint/camelcase */

import React, { useState, useEffect } from 'react';
import { connect } from 'dva';

import { formatMessage } from 'umi-plugin-react/locale';
import { DownOutlined } from '@ant-design/icons';
import { Modal, Dropdown, Menu } from 'antd';

import { kzDevice } from '@/pages/onnet-portal/core/services/kazoo';

const { confirm } = Modal;

const DeviceMusicOnHold = props => {
  const [mediaName, setMediaName] = useState('');

  const { dispatch, account, full_devices, account_media, device_id } = props;

  useEffect(() => {
    if (!account_media.data) {
      dispatch({
        type: 'kz_account_media/refresh',
        payload: { method: 'GET', account_id: account.data.id },
      });
    }
    if (full_devices[device_id] && account_media.data) {
      const mediaObj = account_media.data.find(
        ({ id }) => id === full_devices[device_id].data.music_on_hold.media_id,
      );
      if (mediaObj) {
        setMediaName(mediaObj.name);
      } else {
        setMediaName(
          formatMessage({ id: 'telephony.default_music', defaultMessage: 'Default music' }),
        );
      }
    }
  }, [account, full_devices, account_media]);

  if (!account_media.data) return null;

  const menuAccountMusicOnHold = (
    <Menu selectedKeys={[]} onClick={onMediaSelect}>
      <Menu.Item key="">
        {formatMessage({ id: 'telephony.default_music', defaultMessage: 'Default music' })}
      </Menu.Item>
      {account_media.data.map(media => (
        <Menu.Item key={media.id}>{media.name}</Menu.Item>
      ))}
    </Menu>
  );

  function onMediaSelect(event) {
    const { key } = event;
    const mediaJObj = account_media.data.find(({ id }) => id === key);
    const currMediaName = mediaJObj
      ? mediaJObj.name
      : formatMessage({ id: 'telephony.default_music', defaultMessage: 'Default music' });
    const mediaBag = mediaJObj ? { media_id: key } : {};
    confirm({
      title: formatMessage({ id: 'telephony.music_on_hold', defaultMessage: 'Music on hold' }),
      content: <span style={{ paddingLeft: '6em' }}>{currMediaName}</span>,
      onOk() {
        kzDevice({
          method: 'PATCH',
          account_id: account.data.id,
          device_id,
          data: { music_on_hold: mediaBag },
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
    <Dropdown overlay={menuAccountMusicOnHold} trigger={['click']}>
      <a className="ant-dropdown-link" href="#">
        {mediaName} <DownOutlined />
      </a>
    </Dropdown>
  );
};

export default connect(({ kz_account, kz_account_media, kz_full_devices }) => ({
  account: kz_account,
  full_devices: kz_full_devices,
  account_media: kz_account_media,
}))(DeviceMusicOnHold);
