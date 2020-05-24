/* eslint-disable @typescript-eslint/camelcase */

import React, { useState, useEffect } from 'react';
import { connect, formatMessage } from 'umi';
import * as _ from 'lodash';
import { EditOutlined } from '@ant-design/icons';
import { Button, Select, Modal } from 'antd';

import { kzDevice } from '../../services/kazoo';

const DeviceMusicOnHold = props => {
  const [buttonVisible, setButtonVisible] = useState(false);
  const [selectedId, setSelectedId] = useState('');
  const [dataForSelect, setDataForSelect] = useState([]);
  const [currentValue, setCurrentValue] = useState(
    formatMessage({
      id: 'telephony.default_music',
      defaultMessage: 'Default music',
    }),
  );
  const [modalTitle, setModalTitle] = useState(
    formatMessage({
      id: 'telephony.music_on_hold',
      defaultMessage: 'Music on hold',
    }),
  );

  const { dispatch, account, full_devices, account_media, device_id } = props;

  function currentDocValue() {
    try {
      const mediaObj = account_media.data.find(
        ({ id }) => id === full_devices[device_id].data.music_on_hold.media_id,
      );
      if (mediaObj) {
        return mediaObj.name;
      }
      return formatMessage({ id: 'telephony.default_music', defaultMessage: 'Default music' });
    } catch (e) {
      return formatMessage({ id: 'telephony.default_music', defaultMessage: 'Default music' });
    }
  }

  const fullSelectList = account_media.data
    ? account_media.data.concat({
        id: '',
        field_for_search: 'defaultmusiconhold',
        name: formatMessage({ id: 'telephony.music_on_hold', defaultMessage: 'Music on hold' }),
      })
    : [];

  useEffect(() => {
    if (!account_media.data) {
      dispatch({
        type: 'kz_account_media/refresh',
        payload: { method: 'GET', account_id: account.data.id },
      });
    }
    if (full_devices[device_id] && account_media.data) {
      setDataForSelect(fullSelectList);
      const currVal = currentDocValue();
      setCurrentValue(currVal);
      setModalTitle(
        `${formatMessage({
          id: 'telephony.music_on_hold',
          defaultMessage: 'Music on hold',
        })}: ${currVal}`,
      );
    }
  }, [account, full_devices, account_media]);

  const onModalConfirm = () => {
    const mediaJObj = account_media.data.find(({ id }) => id === selectedId);
    const mediaBag = mediaJObj ? { media_id: selectedId } : {};
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
    setButtonVisible(false);
  };

  const onSelect = event => {
    setSelectedId(event);
    setDataForSelect(fullSelectList);
  };

  const onModalCancel = () => {
    setCurrentValue(currentDocValue());
    setDataForSelect(fullSelectList);
    setButtonVisible(false);
  };

  const selectSearch = val => {
    const searchRes = _.filter(fullSelectList, o =>
      _.includes(_.toString(Object.values(o)).toLowerCase(), val.toLowerCase()),
    );
    setDataForSelect(searchRes);
  };

  const options = dataForSelect.map(media => (
    <Select.Option value={media.id} key={media.id}>
      {media.name}
    </Select.Option>
  ));

  return (
    <>
      {currentDocValue()}{' '}
      <Button type="link" onClick={() => setButtonVisible(true)}>
        <EditOutlined />
      </Button>
      <Modal
        title={modalTitle}
        visible={buttonVisible}
        onOk={onModalConfirm}
        onCancel={onModalCancel}
      >
        <div style={{ textAlign: 'center' }}>
          <Select
            style={{ width: '65%' }}
            onChange={onSelect}
            showSearch
            filterOption={false}
            onSearch={selectSearch}
            defaultValue={currentValue}
          >
            {options}
          </Select>
        </div>
      </Modal>
    </>
  );
};

export default connect(({ kz_account, kz_account_media, kz_full_devices }) => ({
  account: kz_account,
  full_devices: kz_full_devices,
  account_media: kz_account_media,
}))(DeviceMusicOnHold);
