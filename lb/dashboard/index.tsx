import React, { useEffect } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { List } from 'antd';

import CardAccountDetails from './CardAccountDetails';
import CardBillingDetails from './CardBillingDetails';
import CardMonthlyFees from './CardMonthlyFees';
import CardTelephonyNumbers from './CardTelephonyNumbers';
import CardInternet from './CardInternet';

const LBAccountDashboard = props => {
  const { dispatch, kazoo_account } = props;

  useEffect(() => {
    if (kazoo_account.data) {
      dispatch({
        type: 'lb_account/refresh',
        payload: { account_id: kazoo_account.data.id },
      });
    }
  }, [kazoo_account]);

  const data = [
    <CardAccountDetails key="CardAccountDetails" />,
    <CardBillingDetails key="CardBillingDetails" />,
    <CardInternet key="CardInternet" />,
    <CardTelephonyNumbers key="CardTelephonyNumbers" />,
    <CardMonthlyFees key="CardMonthlyFees" />,
  ];

  return (
    <PageHeaderWrapper>
      <List
        grid={{ gutter: 24, xxl: 2, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
        dataSource={data}
        renderItem={item => <List.Item>{item}</List.Item>}
      />
    </PageHeaderWrapper>
  );
};

export default connect(({ kazoo_account }) => ({
  kazoo_account,
}))(LBAccountDashboard);
