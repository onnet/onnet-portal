import React, { useEffect } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { lbAccountInfo } from '@/pages/onnet-portal/core/services/zzlb';

const AccountDashboard = props => {
  const { kazoo_account } = props;

  useEffect(() => {
    if (kazoo_account.data) {
      lbAccountInfo({ account_id: kazoo_account.data.id }).then(respAccountInfo => {
        console.log('respAccountInfo');
        console.log(respAccountInfo);
      });
    }
  }, [kazoo_account]);

  return <PageHeaderWrapper>Account dashboard</PageHeaderWrapper>;
};

export default connect(({ kazoo_account }) => ({
  kazoo_account,
}))(AccountDashboard);
