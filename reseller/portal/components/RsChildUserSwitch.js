/* eslint-disable @typescript-eslint/camelcase */

import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import * as _ from 'loadsh';

import { formatMessage } from 'umi-plugin-react/locale';
import { Switch, Modal } from 'antd';

import { kzUser } from '@/pages/onnet-portal/core/services/kazoo';

const { confirm } = Modal;

const RsChildUserSwitch = props => {
  const [fieldContent, setFieldContent] = useState(false);

  const { dispatch, rs_child_account, rs_child_user, owner_id, fieldKey, modal_title } = props;

  useEffect(() => {
    if (rs_child_user[owner_id]) {
      setFieldContent(_.get(rs_child_user[owner_id].data, fieldKey));
    }
  }, [rs_child_user[owner_id]]);

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
          account_id: rs_child_account.data.id,
          owner_id,
          data,
        }).then(() =>
          dispatch({
            type: 'rs_child_user/refresh',
            payload: { account_id: rs_child_account.data.id, owner_id },
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

export default connect(({ rs_child_account, rs_child_user }) => ({
  rs_child_account,
  rs_child_user,
}))(RsChildUserSwitch);
