/* eslint-disable @typescript-eslint/camelcase */

import React, { useState, useEffect } from 'react';
import { connect } from 'dva';

import moment from 'moment';
import 'moment-timezone';

import { formatMessage } from 'umi-plugin-react/locale';
import { Button, Select, Icon, Modal } from 'antd';

import { kzAccount } from '@/pages/onnet-portal/core/services/kazoo';
import { runAndDispatch } from '@/pages/onnet-portal/core/utils/subroutine';

const AccountTimezone = props => {
  const [tzButtonVisible, setTzButtonVisible] = useState(false);
  const [timezone, setTimezone] = useState('');
  const [modalTitle, setModalTitle] = useState('Account default timezone');

  const { kazoo_account } = props;

  useEffect(() => {
    if (kazoo_account.data) {
      setTimezone(kazoo_account.data.timezone);
      setModalTitle(`Account default timezone: ${kazoo_account.data.timezone}`);
    }
  }, [kazoo_account]);

  const onTimezoneSelect = event => {
    console.log('onTimezoneSelect event: ', event);
    setTimezone(event);
  };

  const onTimezoneConfirm = () => {
    runAndDispatch(kzAccount, 'kazoo_account/update', {
      method: 'PATCH',
      account_id: kazoo_account.data.id,
      data: { timezone },
    });
    setTzButtonVisible(false);
  };

  const onTimezoneCancel = () => {
    setTimezone(kazoo_account.data.timezone);
    setTzButtonVisible(false);
  };

  return (
    <>
      {kazoo_account.data ? kazoo_account.data.timezone : null}
      <Button type="link" onClick={() => setTzButtonVisible(true)}>
        <Icon type="edit" />
      </Button>
      <Modal
        title={modalTitle}
        visible={tzButtonVisible}
        onOk={onTimezoneConfirm}
        onCancel={onTimezoneCancel}
      >
        <div style={{ textAlign: 'center' }}>
          <Select
            style={{ width: '50%' }}
            onChange={onTimezoneSelect}
            showSearch={true}
            defaultValue={kazoo_account.data ? kazoo_account.data.timezone : null}
          >
            {moment.tz.names().map(tzname => (
              <Select.Option value={tzname} key={tzname}>
                {' '}
                {tzname}{' '}
              </Select.Option>
            ))}
          </Select>
        </div>
      </Modal>
    </>
  );
};

export default connect(({ kazoo_account }) => ({
  kazoo_account,
}))(AccountTimezone);
