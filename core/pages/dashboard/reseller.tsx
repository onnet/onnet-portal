import React, { useEffect } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

const ResellerDashboard = props => {
  const { kazoo_login, kazoo_account } = props;

  useEffect(() => {}, [kazoo_login, kazoo_account]);

  return <PageHeaderWrapper>Reseller dashboard</PageHeaderWrapper>;
};

export default connect(({ kazoo_login, kazoo_account }) => ({
  kazoo_login,
  kazoo_account,
}))(ResellerDashboard);
