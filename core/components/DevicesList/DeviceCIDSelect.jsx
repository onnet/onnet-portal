/* eslint-disable @typescript-eslint/camelcase */

import React, { useState, useEffect } from 'react';
import { connect, useIntl } from 'umi';
import * as _ from 'lodash';
import { EditOutlined } from '@ant-design/icons';
import { Button, Select, Modal } from 'antd';

import { kzDevice } from '../../services/kazoo';

const CIDSelect = props => {
  const [tzButtonVisible, setTzButtonVisible] = useState(false);
  const [mainNumber, setMainNumber] = useState(
    formatMessage({
      id: 'telephony.no_number_selected',
      defaultMessage: 'no number selected',
    }),
  );
  const [modalTitle, setModalTitle] = useState(
    formatMessage({
      id: 'core.Select_number',
      defaultMessage: 'Select number',
    }),
  );

  const { dispatch, account, full_devices, numbers, fieldKey, device_id, modal_title } = props;
  const { formatMessage } = useIntl();

  function NumberToShow() {
    try {
      return _.get(full_devices[device_id].data, fieldKey);
    } catch (e) {
      return formatMessage({
        id: 'telephony.no_number_selected',
        defaultMessage: 'no number selected',
      });
    }
  }

  useEffect(() => {
    if (full_devices[device_id]) {
      const extNUm = NumberToShow();
      setMainNumber(extNUm);
      setModalTitle(`${modal_title}: ${extNUm}`);
    }
  }, [full_devices[device_id]]);

  const onMainNumberSelect = event => {
    setMainNumber(event);
  };

  const onMainNumberConfirm = () => {
    const data = {};
    _.set(data, fieldKey, mainNumber);
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

    setTzButtonVisible(false);
  };

  const onMainNumberCancel = () => {
    setMainNumber(NumberToShow());
    setTzButtonVisible(false);
  };

  return (
    <>
      {NumberToShow()}{' '}
      <Button type="link" onClick={() => setTzButtonVisible(true)}>
        <EditOutlined />
      </Button>
      <Modal
        title={modalTitle}
        visible={tzButtonVisible}
        onOk={onMainNumberConfirm}
        onCancel={onMainNumberCancel}
      >
        <div style={{ textAlign: 'center' }}>
          <Select
            style={{ width: '50%' }}
            onChange={onMainNumberSelect}
            showSearch
            defaultValue={mainNumber}
          >
            {Object.keys(numbers.data.numbers).map(number => (
              <Select.Option value={number} key={number}>
                {number}
              </Select.Option>
            ))}
          </Select>
        </div>
      </Modal>
    </>
  );
};

export default connect(({ kz_account, kz_full_devices, kz_numbers }) => ({
  account: kz_account,
  full_devices: kz_full_devices,
  numbers: kz_numbers,
}))(CIDSelect);
