/* eslint-disable @typescript-eslint/camelcase */

import React, { useState, useEffect } from 'react';
import { connect, useIntl } from 'umi';
import { DownOutlined } from '@ant-design/icons';
import { Modal, Dropdown, Menu } from 'antd';

import { kzAccount } from '@/pages/onnet-portal/core/services/kazoo';
import { runAndDispatch } from '@/pages/onnet-portal/core/utils/subroutine';

const { confirm } = Modal;

const AccountMusicOnHold = props => {
  const [mediaName, setMediaName] = useState('');

  const { dispatch, account, account_media } = props;

  useEffect(() => {
    if (!account_media.data) {
      dispatch({
        type: 'kz_account_media/refresh',
        payload: { method: 'GET', account_id: account.data.id },
      });
    }

    if (account.data && account_media.data) {
      const mediaObj = account_media.data.find(
        ({ id }) => id === account.data.music_on_hold.media_id,
      );
      if (mediaObj) {
        setMediaName(mediaObj.name);
      } else {
        setMediaName(
          formatMessage({ id: 'telephony.default_music', defaultMessage: 'Default music' }),
        );
      }
    }
  }, [account, account_media]);

  const { formatMessage } = useIntl();

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
        runAndDispatch(kzAccount, 'kz_account/update', {
          method: 'PATCH',
          account_id: account.data.id,
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
  account: kz_account,
  account_media: kz_account_media,
}))(AccountMusicOnHold);
