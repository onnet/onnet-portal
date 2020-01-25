import React from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

const AccountDashboard = props => {
  const { kazoo_account } = props;

  if (!kazoo_account.data) {
    return <Spin />;
  }

  return (
    <PageHeaderWrapper>
      Account dashboard <b>{kazoo_account.data.name}</b>
    </PageHeaderWrapper>
  );
};

export default connect(({ kazoo_account }) => ({
  kazoo_account,
}))(AccountDashboard);
