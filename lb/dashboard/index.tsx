import React, { useEffect } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Spin } from 'antd';
import Masonry from 'react-masonry-css';

import CardAccountDetails from './CardAccountDetails';
import CardBillingDetails from './CardBillingDetails';
import CardMonthlyFees from './CardMonthlyFees';
import CardTelephonyNumbers from './CardTelephonyNumbers';
import CardInternet from './CardInternet';

import { masonryBreakpointCols } from '@/pages/onnet-portal/core/utils/props';

const LBAccountDashboard = props => {
  const { dispatch, kazoo_account, lb_account } = props;

  useEffect(() => {
    if (kazoo_account.data) {
      dispatch({
        type: 'lb_account/refresh',
        payload: { account_id: kazoo_account.data.id },
      });
    }
  }, [kazoo_account]);

  if (!lb_account.data) {
    return Spin;
  }

  if (!lb_account.data.account_info) {
    return Spin;
  }

  return (
    <PageHeaderWrapper title={lb_account.data.account_info.name}>
      <Masonry
        breakpointCols={masonryBreakpointCols}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        <CardBillingDetails key="CardBillingDetails" />
        <CardMonthlyFees key="CardMonthlyFees" />
        <CardAccountDetails key="CardAccountDetails" />
        <CardTelephonyNumbers key="CardTelephonyNumbers" />
        <CardInternet key="CardInternet" />
      </Masonry>
    </PageHeaderWrapper>
  );
};

export default connect(({ kazoo_account, lb_account }) => ({
  kazoo_account,
  lb_account,
}))(LBAccountDashboard);
