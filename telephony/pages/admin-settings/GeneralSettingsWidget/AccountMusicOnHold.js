/* eslint-disable @typescript-eslint/camelcase */

import React, { useState, useEffect } from 'react';
import { connect } from 'dva';

import { formatMessage } from 'umi-plugin-react/locale';
import { Icon, Modal, Dropdown, Menu } from 'antd';

import { kzAccount } from '@/pages/onnet-portal/core/services/kazoo';
import { runAndDispatch } from '@/pages/onnet-portal/core/utils/subroutine';

const { confirm } = Modal;

const AccountMusicOnHold = props => {
  const [mediaName, setMediaName] = useState('');

  const { kazoo_account, kazoo_account_media } = props;

  useEffect(() => {
    if (kazoo_account.data) {
      const mediaObj = kazoo_account_media.data.find(
        ({ id }) => id === kazoo_account.data.music_on_hold.media_id,
      );
      if (mediaObj) {
        setMediaName(mediaObj.name);
      } else {
        setMediaName(
          formatMessage({ id: 'telephony.default_music', defaultMessage: 'Default music' }),
        );
      }
    }
  }, [kazoo_account, kazoo_account_media]);

  const menuAccountMusicOnHold = (
    <Menu selectedKeys={[]} onClick={onMediaSelect}>
      <Menu.Item key="">Default music</Menu.Item>
      {kazoo_account_media.data.map(media => (
        <Menu.Item key={media.id}>{media.name}</Menu.Item>
      ))}
    </Menu>
  );

  function onMediaSelect(event) {
    const { key } = event;
    const mediaJObj = kazoo_account_media.data.find(({ id }) => id === key);
    const currMediaName = mediaJObj
      ? mediaJObj.name
      : formatMessage({ id: 'telephony.default_music', defaultMessage: 'Default music' });
    const mediaBag = mediaJObj ? { media_id: key } : {};
    confirm({
      title: formatMessage({ id: 'telephony.music_on_hold', defaultMessage: 'Music on hold' }),
      content: <span style={{ paddingLeft: '6em' }}>{currMediaName}</span>,
      onOk() {
        runAndDispatch(kzAccount, 'kazoo_account/update', {
          method: 'PATCH',
          account_id: kazoo_account.data.id,
          data: { music_on_hold: mediaBag },
        });
      },
      onCancel() {},
    });
  }

  return (
    <Dropdown overlay={menuAccountMusicOnHold} trigger={['click']}>
      <a className="ant-dropdown-link" href="#">
        {mediaName} <Icon type="down" />
      </a>
    </Dropdown>
  );
};

export default connect(({ kazoo_account, kazoo_account_media }) => ({
  kazoo_account,
  kazoo_account_media,
}))(AccountMusicOnHold);
