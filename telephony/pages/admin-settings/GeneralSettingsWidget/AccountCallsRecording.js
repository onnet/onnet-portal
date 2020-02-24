/* eslint-disable @typescript-eslint/camelcase */

import React from 'react';
import { connect } from 'dva';

import { formatMessage } from 'umi-plugin-react/locale';
import { Modal, Switch } from 'antd';

import { kzAccount } from '@/pages/onnet-portal/core/services/kazoo';
import { runAndDispatch } from '@/pages/onnet-portal/core/utils/subroutine';

const { confirm } = Modal;

const AccountCallsRecording = props => {
  const { kazoo_account } = props;

  function onCallRecordingSwitch(checked) {
    confirm({
      title: formatMessage({
        id: 'telephony.all_calls_recording',
        defaultMessage: 'Calls recording',
      }),
      content: (
        <span style={{ paddingLeft: '6em' }}>
          {checked
            ? formatMessage({ id: 'core.switch_on', defaultMessage: 'Switch ON' })
            : formatMessage({ id: 'core.switch_off', defaultMessage: 'Switch OFF' })}
        </span>
      ),
      onOk() {
        runAndDispatch(kzAccount, 'kazoo_account/update', {
          method: 'PATCH',
          account_id: kazoo_account.data.id,
          data: { record_call: checked },
        });
      },
      onCancel() {},
    });
  }

  return (
    <Switch
      size="small"
      checked={kazoo_account.data ? kazoo_account.data.record_call : false}
      onChange={onCallRecordingSwitch}
    />
  );
};

export default connect(({ kazoo_account }) => ({
  kazoo_account,
}))(AccountCallsRecording);
