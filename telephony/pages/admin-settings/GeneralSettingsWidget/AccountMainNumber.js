/* eslint-disable @typescript-eslint/camelcase */

import React, { useState, useEffect } from 'react';
import { connect } from 'dva';

import { formatMessage } from 'umi-plugin-react/locale';
import { Button, Select, Icon, Modal } from 'antd';

import { kzAccount } from '@/pages/onnet-portal/core/services/kazoo';
import { runAndDispatch } from '@/pages/onnet-portal/core/utils/subroutine';

const AccountMainNumber = props => {
  const [tzButtonVisible, setTzButtonVisible] = useState(false);
  const [mainNumber, setMainNumber] = useState(
    formatMessage({
      id: 'telephony.no_number_selected',
      defaultMessage: 'no number selected',
    }),
  );
  const [modalTitle, setModalTitle] = useState(
    formatMessage({
      id: 'telephony.account_default_number',
      defaultMessage: 'Account default Number',
    }),
  );

  const { kazoo_account, kazoo_account_numbers } = props;

  function externalNumber() {
    try {
      return kazoo_account.data.caller_id.external.number;
    } catch (e) {
      return formatMessage({
        id: 'telephony.no_number_selected',
        defaultMessage: 'no number selected',
      });
    }
  }

  useEffect(() => {
    if (kazoo_account.data) {
      const extNUm = externalNumber();
      setMainNumber(extNUm);
      setModalTitle(
        `${formatMessage({
          id: 'telephony.account_default_number',
          defaultMessage: 'Account default Number',
        })}: ${extNUm}`,
      );
    }
  }, [kazoo_account]);

  const onMainNumberSelect = event => {
    console.log('onMainNumberSelect event: ', event);
    setMainNumber(event);
  };

  const onMainNumberConfirm = () => {
    runAndDispatch(kzAccount, 'kazoo_account/update', {
      method: 'PATCH',
      account_id: kazoo_account.data.id,
      data: { caller_id: { external: { number: mainNumber, name: mainNumber } } },
    });
    setTzButtonVisible(false);
  };

  const onMainNumberCancel = () => {
    setMainNumber(kazoo_account.data.mainNumber);
    setTzButtonVisible(false);
  };

  return (
    <>
      {externalNumber()}{' '}
      <Button type="link" onClick={() => setTzButtonVisible(true)}>
        <Icon type="edit" />
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
            {Object.keys(kazoo_account_numbers.data.numbers).map(number => (
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

export default connect(({ kazoo_account, kazoo_account_numbers }) => ({
  kazoo_account,
  kazoo_account_numbers,
}))(AccountMainNumber);
