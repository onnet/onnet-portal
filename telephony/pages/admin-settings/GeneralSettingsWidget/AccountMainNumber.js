/* eslint-disable @typescript-eslint/camelcase */

import React, { useState, useEffect } from 'react';
import { connect } from 'dva';

import { formatMessage } from 'umi-plugin-react/locale';
import { Button, Select, Icon, Modal } from 'antd';

import { runAndDispatch } from '@/pages/onnet-portal/core/services/kazoo';

const AccountMainNumber = props => {

  const [ tzButtonVisible, setTzButtonVisible ] = useState(false);
  const [ mainNumber, setMainNumber ] = useState('no number selected');
  const [ modalTitle, setModalTitle ] = useState('Account default Number');

  const { kazoo_account, kazoo_account_numbers } = props;

  function externalNumber() {
    try {
      return kazoo_account.data.caller_id.external.number;
    } catch (e) {
      return 'no number selected';
    }
  }

  useEffect(() => {
    if (kazoo_account.data) {
      setMainNumber(externalNumber());
      setModalTitle(`Account default mainNumber: ${kazoo_account.data.caller_id.external.number}`);
    }
  }, [kazoo_account]);

  const onMainNumberSelect = event => {
    console.log('onMainNumberSelect event: ', event);
    setMainNumber(event);
  }

  const onMainNumberConfirm = () => {
    runAndDispatch('kzAccount', 'kazoo_account/update', {
          method: 'PATCH',
          account_id: kazoo_account.data.id,
          data: { caller_id: { external: { number: mainNumber, name: mainNumber } } },
        });
    setTzButtonVisible(false);
  }

  const onMainNumberCancel = () => {
    setMainNumber(kazoo_account.data.mainNumber);
    setTzButtonVisible(false);
  }

  return (
	<> 
	  {externalNumber()} <Button type="link" onClick={() => setTzButtonVisible(true)} ><Icon type="edit" /></Button>
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
            showSearch={true}
	    defaultValue={mainNumber}
          >
            {Object.keys(kazoo_account_numbers.data.numbers).map(number => (
              <Select.Option value={number} key={number}>{number}</Select.Option>))}
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
