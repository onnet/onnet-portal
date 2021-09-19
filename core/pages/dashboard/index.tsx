import React, { useEffect, useState } from 'react';
import { connect, Redirect } from 'umi';
import { Spin } from 'antd';
import LBAccountDashboard from '@/pages/onnet-portal/lb/dashboard';
import AccountDashboard from './account';

const DashboardSelector = (props) => {
  const { kz_login, kz_account = {}, lb_account = {} } = props;

  const [isReseller, setIsReseller] = useState(false);
  const [isSuperDuperAdmin, setIsSuperDuperAdmin] = useState(false);

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

  if (kz_account.data) {
    if (isSuperDuperAdmin) {
      //     return <SuperDuperDashboard />;
      return <Redirect to="/int/accounts" />;
    }

    if (isReseller) {
      //     return <ResellerDashboard />;
      return <Redirect to="/int/accounts" />;
    }

    return lb_account.data ? <LBAccountDashboard /> : <AccountDashboard />;
  }

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
