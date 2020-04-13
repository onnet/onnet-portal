import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import SuperDuperDashboard from './super_admin';
import ResellerDashboard from './reseller';
import AccountDashboard from './account';
import LBAccountDashboard from '@/pages/onnet-portal/lb/dashboard';

const DashboardSelector = props => {
  const { kz_login, kz_account = {}, lb_account = {} } = props;

  const [isReseller, setIsReseller] = useState(false);
  const [isSuperDuperAdmin, setIsSuperDuperAdmin] = useState(false);

console.log('IAM1');

  useEffect(() => {
    if (kz_account.data) {
      if (kz_account.data.superduper_admin) {
        setIsSuperDuperAdmin(true);
      } else {
        setIsSuperDuperAdmin(false);
      }

      if (kz_account.data.is_reseller) {
        setIsReseller(true);
      } else {
        setIsReseller(false);
      }
    }
  }, [kz_login, kz_account, lb_account]);

console.log('IAM2');
  if (kz_account.data) {
console.log('IAM3');
    if (isSuperDuperAdmin) {
console.log('IAM4');
      return <SuperDuperDashboard />;
    }

    if (isReseller) {
console.log('IAM5');
      return <ResellerDashboard />;
    }

console.log('IAM6');
    return lb_account.data ? <LBAccountDashboard /> : <AccountDashboard />;
  }

console.log('IAM7 kz_account: ', kz_account);
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        margin: 'auto',
        paddingTop: 100,
        textAlign: 'center',
      }}
    >
      <Spin size="large" />
    </div>
  );
};

export default connect(({ kz_login, kz_account, lb_account }) => ({
  kz_login,
  kz_account,
  lb_account,
}))(DashboardSelector);
