import React, { useState, useEffect } from 'react';
import * as _ from 'lodash';
import { connect, useIntl } from 'umi';
import { EditOutlined } from '@ant-design/icons';
import { Button, Select, Modal } from 'antd';

import { kzUser } from '@/pages/onnet-portal/core/services/kazoo';

const ResellerUserCIDSelect = (props) => {
  const { formatMessage } = useIntl();

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

  const {
    dispatch,
    child_account,
    child_full_users,
    child_numbers,
    fieldKey,
    owner_id,
    modal_title,
  } = props;

  function NumberToShow() {
    try {
      return _.get(child_full_users[owner_id].data, fieldKey);
    } catch (e) {
      return formatMessage({
        id: 'telephony.no_number_selected',
        defaultMessage: 'no number selected',
      });
    }
  }

  useEffect(() => {
    if (child_full_users[owner_id]) {
      const extNUm = NumberToShow();
      setMainNumber(extNUm);
      setModalTitle(`${modal_title}: ${extNUm}`);
    }
  }, [child_full_users[owner_id]]);

  const onMainNumberSelect = (event) => {
    setMainNumber(event);
  };

  const onMainNumberConfirm = () => {
    const data = {};
    _.set(data, fieldKey, mainNumber);
    kzUser({
      method: 'PATCH',
      account_id: child_account.data?.id,
      owner_id,
      data,
    }).then(() =>
      dispatch({
        type: 'child_full_users/refresh',
        payload: { account_id: child_account.data?.id, owner_id },
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
            {_.keys(_.get(child_numbers, 'data.numbers', {})).map((number) => (
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

export default connect(({ child_account, child_full_users, child_numbers }) => ({
  child_account,
  child_full_users,
  child_numbers,
}))(ResellerUserCIDSelect);
