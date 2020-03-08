/* eslint-disable @typescript-eslint/camelcase */

import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import * as _ from 'loadsh';

import { formatMessage } from 'umi-plugin-react/locale';
import { Switch, Modal } from 'antd';

import { kzUser } from '@/pages/onnet-portal/core/services/kazoo';

const { confirm } = Modal;

const UserSwitch = props => {
  const [fieldContent, setFieldContent] = useState(false);

  const { dispatch, account, full_users, owner_id, fieldKey, modal_title } = props;

  useEffect(() => {
    if (full_users[owner_id]) {
      setFieldContent(_.get(full_users[owner_id].data, fieldKey));
    }
  }, [full_users[owner_id]]);

  function onSwitchChange(value) {
    confirm({
      title: modal_title,
      content: (
        <span style={{ paddingLeft: '6em' }}>
          {value
            ? formatMessage({ id: 'core.switch_on', defaultMessage: 'Switch ON' })
            : formatMessage({ id: 'core.switch_off', defaultMessage: 'Switch OFF' })}
        </span>
      ),
      onOk() {
        const data = {};
        _.set(data, fieldKey, value);
        kzUser({
          method: 'PATCH',
          account_id: account.data.id,
          owner_id,
          data,
        }).then(() =>
          dispatch({
            type: 'kz_full_users/refresh',
            payload: { account_id: account.data.id, owner_id },
          }),
        );
      },
      onCancel() {},
    });
  }

  return (
    <Switch size="small" checked={fieldContent} onChange={checked => onSwitchChange(checked)} />
  );
};

export default connect(({ kz_account, kz_full_users }) => ({
  account: kz_account,
  full_users: kz_full_users,
}))(UserSwitch);
