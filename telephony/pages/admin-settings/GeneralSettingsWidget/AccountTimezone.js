/* eslint-disable @typescript-eslint/camelcase */

import React, { useState, useEffect } from 'react';
import { connect, useIntl } from 'umi';
import moment from 'moment';
import 'moment-timezone';

import { EditOutlined } from '@ant-design/icons';
import { Button, Select, Modal } from 'antd';

import { kzAccount } from '@/pages/onnet-portal/core/services/kazoo';
import { runAndDispatch } from '@/pages/onnet-portal/core/utils/subroutine';

const AccountTimezone = props => {
  const [tzButtonVisible, setTzButtonVisible] = useState(false);
  const [timezone, setTimezone] = useState('');
  const [modalTitle, setModalTitle] = useState(
    formatMessage({
      id: 'telephony.account_timezone',
      defaultMessage: 'Account timezone',
    }),
  );

  const { kz_account } = props;

  useEffect(() => {
    if (kz_account.data) {
      setTimezone(kz_account.data.timezone);
      setModalTitle(
        `${formatMessage({
          id: 'telephony.account_timezone',
          defaultMessage: 'Account timezone',
        })}: ${kz_account.data.timezone}`,
      );
    }
  }, [kz_account]);

  const { formatMessage } = useIntl();

  const onTimezoneSelect = event => {
    console.log('onTimezoneSelect event: ', event);
    setTimezone(event);
  };

  const onTimezoneConfirm = () => {
    runAndDispatch(kzAccount, 'kz_account/update', {
      method: 'PATCH',
      account_id: kz_account.data.id,
      data: { timezone },
    });
    setTzButtonVisible(false);
  };

  const onTimezoneCancel = () => {
    setTimezone(kz_account.data.timezone);
    setTzButtonVisible(false);
  };

  return (
    <>
      {kz_account.data ? kz_account.data.timezone : null}
      <Button type="link" onClick={() => setTzButtonVisible(true)}>
        <EditOutlined />
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
            showSearch
            defaultValue={kz_account.data ? kz_account.data.timezone : null}
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

export default connect(({ kz_account }) => ({
  kz_account,
}))(AccountTimezone);
