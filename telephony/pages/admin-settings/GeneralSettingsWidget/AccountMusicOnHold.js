/* eslint-disable @typescript-eslint/camelcase */

import React, { useState, useEffect } from 'react';
import { connect } from 'dva';

import { formatMessage } from 'umi-plugin-react/locale';
import { DownOutlined } from '@ant-design/icons';
import { Modal, Dropdown, Menu } from 'antd';

import { kzAccount } from '@/pages/onnet-portal/core/services/kazoo';
import { runAndDispatch } from '@/pages/onnet-portal/core/utils/subroutine';

const { confirm } = Modal;

const AccountMusicOnHold = props => {
  const [mediaName, setMediaName] = useState('');

  const { kz_account, kz_account_media } = props;

  useEffect(() => {
    if (kz_account.data) {
      const mediaObj = kz_account_media.data.find(
        ({ id }) => id === kz_account.data.music_on_hold.media_id,
      );
      if (mediaObj) {
        setMediaName(mediaObj.name);
      } else {
        setMediaName(
          formatMessage({ id: 'telephony.default_music', defaultMessage: 'Default music' }),
        );
      }
    }
  }, [kz_account, kz_account_media]);

  const menuAccountMusicOnHold = (
    <Menu selectedKeys={[]} onClick={onMediaSelect}>
      <Menu.Item key="">
        {formatMessage({ id: 'telephony.default_music', defaultMessage: 'Default music' })}
      </Menu.Item>
      {kz_account_media.data.map(media => (
        <Menu.Item key={media.id}>{media.name}</Menu.Item>
      ))}
    </Menu>
  );

  function onMediaSelect(event) {
    const { key } = event;
    const mediaJObj = kz_account_media.data.find(({ id }) => id === key);
    const currMediaName = mediaJObj
      ? mediaJObj.name
      : formatMessage({ id: 'telephony.default_music', defaultMessage: 'Default music' });
    const mediaBag = mediaJObj ? { media_id: key } : {};
    confirm({
      title: formatMessage({ id: 'telephony.music_on_hold', defaultMessage: 'Music on hold' }),
      content: <span style={{ paddingLeft: '6em' }}>{currMediaName}</span>,
      onOk() {
        runAndDispatch(kzAccount, 'kz_account/update', {
          method: 'PATCH',
          account_id: kz_account.data.id,
          data: { music_on_hold: mediaBag },
        });
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

export default connect(({ kz_account, kz_account_media }) => ({
  kz_account,
  kz_account_media,
}))(AccountMusicOnHold);
