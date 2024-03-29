import React from 'react';
import { connect, useIntl } from 'umi';
import { Modal, Switch } from 'antd';

import { kzAccount } from '@/pages/onnet-portal/core/services/kazoo';
import { runAndDispatch } from '@/pages/onnet-portal/core/utils/subroutine';

const { confirm } = Modal;

const AccountCallsRecording = (props) => {
  const { kz_account } = props;
  const { formatMessage } = useIntl();

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
        runAndDispatch(kzAccount, 'kz_account/update', {
          method: 'PATCH',
          account_id: kz_account.data.id,
          data: { record_call: checked },
        });
      },
      onCancel() {},
    });
  }

  return (
    <Switch
      size="small"
      checked={kz_account.data ? kz_account.data.record_call : false}
      onChange={onCallRecordingSwitch}
    />
  );
};

export default connect(({ kz_account }) => ({
  kz_account,
}))(AccountCallsRecording);
