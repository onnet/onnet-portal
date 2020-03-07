import React from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

const AccountDashboard = props => {
  const { kz_account } = props;

  if (!kz_account.data) {
    return <Spin />;
  }

  return (
    <PageHeaderWrapper>
      Account dashboard <b>{kz_account.data.name}</b>
    </PageHeaderWrapper>
  );
};

export default connect(({ kz_account }) => ({
  kz_account,
}))(AccountDashboard);
