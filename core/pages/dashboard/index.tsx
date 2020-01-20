import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import SuperDuperDashboard from './super_admin';
import ResellerDashboard from './reseller';
import AccountDashboard from './account';
import LBAccountDashboard from '@/pages/onnet-portal/lb/dashboard';

const DashboardSelector = props => {
  const { kazoo_login, kazoo_account = {}, lb_account = {} } = props;

  const [isReseller, setIsReseller] = useState(false);
  const [isSuperDuperAdmin, setIsSuperDuperAdmin] = useState(false);

  useEffect(() => {
    if (kazoo_account.data) {
      if (kazoo_account.data.superduper_admin) {
        setIsSuperDuperAdmin(true);
      } else {
        setIsSuperDuperAdmin(false);
      }

      if (kazoo_account.data.is_reseller) {
        setIsReseller(true);
      } else {
        setIsReseller(false);
      }
    }
  }, [kazoo_login, kazoo_account, lb_account]);

  if (kazoo_account.data) {
    if (isSuperDuperAdmin) {
      return <SuperDuperDashboard />;
    }

    if (isReseller) {
      return <ResellerDashboard />;
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

export default connect(({ kazoo_login, kazoo_account, lb_account }) => ({
  kazoo_login,
  kazoo_account,
  lb_account,
}))(DashboardSelector);
