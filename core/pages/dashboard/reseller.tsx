import React, { useEffect } from 'react';
import { connect } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

const ResellerDashboard = (props) => {
  const { kz_login, kz_account } = props;

  useEffect(() => {}, [kz_login, kz_account]);

  return <PageHeaderWrapper>Reseller dashboard</PageHeaderWrapper>;
};

export default connect(({ kz_login, kz_account }) => ({
  kz_login,
  kz_account,
}))(ResellerDashboard);
