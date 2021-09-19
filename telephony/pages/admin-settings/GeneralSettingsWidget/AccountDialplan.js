import React, { useState, useEffect } from 'react';
import { connect, useIntl } from 'umi';
import { DownOutlined } from '@ant-design/icons';
import { Modal, Dropdown, Menu } from 'antd';

import { kzAccount, AccountDialplans } from '@/pages/onnet-portal/core/services/kazoo';
import { runAndDispatch } from '@/pages/onnet-portal/core/utils/subroutine';

const { confirm } = Modal;

const AccountDialplan = (props) => {
  const [accountDialplans, setAccountDialplans] = useState({});

  const { kz_account } = props;

  useEffect(() => {
    if (kz_account.data) {
      AccountDialplans({ account_id: kz_account.data.id }).then((res) => {
        if (res.data) setAccountDialplans(res.data);
      });
    }
  }, [kz_account]);

  const { formatMessage } = useIntl();

  const menuAccountDialplan = (
    <Menu selectedKeys={[]} onClick={onAccountDialplanSelect}>
      {Object.keys(accountDialplans).map((dpKey) => (
        <Menu.Item key={dpKey}>{dpKey}</Menu.Item>
      ))}
    </Menu>
  );

  function onAccountDialplanSelect({ key }) {
    confirm({
      title: formatMessage({
        id: 'telephony.dialplan',
        defaultMessage: 'Dialplan',
      }),
      content: (
        <span style={{ paddingLeft: '4em' }}>
          {formatMessage({ id: 'core.change_to', defaultMessage: 'Change to' })} <b>{key}</b>
        </span>
      ),
      onOk() {
        runAndDispatch(kzAccount, 'kz_account/update', {
          method: 'PATCH',
          account_id: kz_account.data.id,
          data: { dial_plan: { system: [key] } },
        });
      },
      onCancel() {},
    });
  }

  return (
    <Dropdown overlay={menuAccountDialplan} trigger={['click']}>
      <a className="ant-dropdown-link" href="#">
        {kz_account.data
          ? kz_account.data.dial_plan
            ? kz_account.data.dial_plan.system
            : null
          : null}{' '}
        <DownOutlined />
      </a>
    </Dropdown>
  );
};

export default connect(({ kz_account }) => ({
  kz_account,
}))(AccountDialplan);
