/* eslint-disable @typescript-eslint/camelcase */

import React, { useState, useEffect } from 'react';
import { connect } from 'dva';

import { formatMessage } from 'umi-plugin-react/locale';
import { EditOutlined } from '@ant-design/icons';
import { Button, Select, Modal } from 'antd';

import { kzDevice } from '@/pages/onnet-portal/core/services/kazoo';

const DeviceAssignTo = props => {
  const [buttonVisible, setButtonVisible] = useState(false);
  const [selectedId, setSelectedId] = useState('');
  const [currentValue, setCurrentValue] = useState(
    formatMessage({
      id: 'core.No_owner',
      defaultMessage: '-No owner-',
    }),
  );
  const [modalTitle, setModalTitle] = useState(
    formatMessage({
      id: 'core.Assign_to',
      defaultMessage: 'Assign to',
    }),
  );

  const { dispatch, account, full_devices, brief_users, full_users, device_id } = props;

  function currentDocValue() {
    try {
      const ownerId = full_devices[device_id].data.owner_id;
      if (ownerId) {
        return full_users[ownerId].data.username;
      } else {
        return formatMessage({ id: 'core.No_owner', defaultMessage: '-No owner-' });
      }
    } catch (e) {
      return formatMessage({ id: 'core.No_owner', defaultMessage: '-No owner-', });
    }
  }

  useEffect(() => {
    if (account.data && full_devices[device_id]) {
      const currVal = currentDocValue();
      setCurrentValue(currVal);
      setModalTitle(
        `${formatMessage({
          id: 'core.Assign_to',
          defaultMessage: 'Assign to',
        })}: ${currVal}`,
      );
    }
  }, [account, full_devices, full_users]);

  const onSelect = event => {
    console.log('onSelect event: ', event);
    setSelectedId(event);
  };

  const onModalConfirm = props => {
    if (selectedId === "no_owner_key") {
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
        data: { owner_id: selectedId },
      }).then(() =>
        dispatch({
          type: 'kz_full_devices/refresh',
          payload: { account_id: account.data.id, device_id },
        }),
      );
    }
    setButtonVisible(false);
  };

  const onModalCancel = () => {
    setCurrentValue(currentDocValue());
    setButtonVisible(false);
  };

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
            style={{ width: '50%' }}
            onChange={onSelect}
            showSearch
            defaultValue={currentValue}
          >
            {brief_users.data.map(user => (
              <Select.Option value={user.id} key={user.id}>{user.username}</Select.Option>
            ))}
            <Select.Option value="no_owner_key" key="no_owner_key">
              {formatMessage({ id: 'core.No_owner', defaultMessage: '-No owner-' })}
            </Select.Option>
          </Select>
        </div>
      </Modal>
    </>
  );
};

export default connect(({ kz_account, kz_full_devices, kz_brief_users, kz_full_users }) => ({
  account: kz_account,
  full_devices: kz_full_devices,
  brief_users: kz_brief_users,
  full_users: kz_full_users,
}))(DeviceAssignTo);
