/* eslint-disable @typescript-eslint/camelcase */

import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import * as _ from 'loadsh';

import { formatMessage } from 'umi-plugin-react/locale';
import { EditOutlined } from '@ant-design/icons';
import { Button, Select, Modal } from 'antd';

import { kzUser } from '@/pages/onnet-portal/core/services/kazoo';

const ResellerUserCIDSelect = props => {
  const [tzButtonVisible, setTzButtonVisible] = useState(false);
  const [mainNumber, setMainNumber] = useState(
    formatMessage({
      id: 'telephony.no_number_selected',
      defaultMessage: 'no number selected',
    }),
  );
  const [modalTitle, setModalTitle] = useState(
    formatMessage({
      id: 'telephony.Select_number',
      defaultMessage: 'Select number',
    }),
  );

  const {
    dispatch,
    rs_child_account,
    rs_child_user,
    rs_child_numbers,
    fieldKey,
    owner_id,
    modal_title,
  } = props;

  function NumberToShow() {
    try {
      console.log(
        'NumberToShow _.get(rs_child_user[owner_id].data, fieldKey): ',
        _.get(rs_child_user[owner_id].data, fieldKey),
      );
      return _.get(rs_child_user[owner_id].data, fieldKey);
    } catch (e) {
      console.log('NumberToShow error');
      console.log('NumberToShow fieldKey: ', fieldKey);
      console.log('NumberToShow rs_child_user[owner_id]: ', rs_child_user[owner_id]);
      return formatMessage({
        id: 'telephony.no_number_selected',
        defaultMessage: 'no number selected',
      });
    }
  }

  useEffect(() => {
    if (rs_child_user[owner_id]) {
      const extNUm = NumberToShow();
      setMainNumber(extNUm);
      setModalTitle(`${modal_title}: ${extNUm}`);
    }
  }, [rs_child_user[owner_id]]);

  const onMainNumberSelect = event => {
    console.log('onMainNumberSelect event: ', event);
    setMainNumber(event);
  };

  const onMainNumberConfirm = () => {
    const data = {};
    _.set(data, fieldKey, mainNumber);
    kzUser({
      method: 'PATCH',
      account_id: rs_child_account.data.id,
      owner_id,
      data,
    }).then(() =>
      dispatch({
        type: 'rs_child_user/refresh',
        payload: { account_id: rs_child_account.data.id, owner_id },
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
            {Object.keys(rs_child_numbers.data.numbers).map(number => (
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

export default connect(({ rs_child_account, rs_child_user, rs_child_numbers }) => ({
  rs_child_account,
  rs_child_user,
  rs_child_numbers,
}))(ResellerUserCIDSelect);
