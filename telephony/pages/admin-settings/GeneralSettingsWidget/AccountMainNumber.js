import React, { useState, useEffect } from 'react';
import { connect, useIntl } from 'umi';
import * as _ from 'lodash';
import { EditOutlined } from '@ant-design/icons';
import { Button, Select, Modal } from 'antd';

import { kzAccount } from '@/pages/onnet-portal/core/services/kazoo';
import { runAndDispatch } from '@/pages/onnet-portal/core/utils/subroutine';

const AccountMainNumber = (props) => {
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
      id: 'telephony.account_default_number',
      defaultMessage: 'Account default Number',
    }),
  );

  const { kz_account, kz_account_numbers } = props;

  function externalNumber() {
    try {
      return kz_account.data.caller_id.external.number;
    } catch (e) {
      return formatMessage({
        id: 'telephony.no_number_selected',
        defaultMessage: 'no number selected',
      });
    }
  }

  useEffect(() => {
    if (kz_account.data) {
      const extNUm = externalNumber();
      setMainNumber(extNUm);
      setModalTitle(
        `${formatMessage({
          id: 'telephony.account_default_number',
          defaultMessage: 'Account default Number',
        })}: ${extNUm}`,
      );
    }
  }, [kz_account]);

  const onMainNumberSelect = (event) => {
    setMainNumber(event);
  };

  const onMainNumberConfirm = () => {
    runAndDispatch(kzAccount, 'kz_account/update', {
      method: 'PATCH',
      account_id: kz_account.data.id,
      data: { caller_id: { external: { number: mainNumber, name: mainNumber } } },
    });
    setTzButtonVisible(false);
  };

  const onMainNumberCancel = () => {
    setMainNumber(externalNumber());
    setTzButtonVisible(false);
  };

  return (
    <>
      {externalNumber()}{' '}
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
            {_.isUndefined(kz_account_numbers.data.numbers)
              ? _.keys(kz_account_numbers.data.numbers).map((number) => (
                  <Select.Option value={number} key={number}>
                    {number}
                  </Select.Option>
                ))
              : null}
          </Select>
        </div>
      </Modal>
    </>
  );
};

export default connect(({ kz_account, kz_account_numbers }) => ({
  kz_account,
  kz_account_numbers,
}))(AccountMainNumber);
