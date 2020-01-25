import React, { useEffect } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Row, Col } from 'antd';

import CardAccountDetails from './CardAccountDetails';
import CardBillingDetails from './CardBillingDetails';
import CardMonthlyFees from './CardMonthlyFees';
import CardTelephonyNumbers from './CardTelephonyNumbers';
import CardInternet from './CardInternet';
import { dashboardTopColProps, cardProps } from '@/pages/onnet-portal/core/utils/props';

const LBAccountDashboard = props => {
  const { dispatch, lb_account, kazoo_account } = props;

  useEffect(() => {
    if (kazoo_account.data) {
      dispatch({
        type: 'lb_account/refresh',
        payload: { account_id: kazoo_account.data.id },
      });
    }
  }, [kazoo_account]);

  return (
    <PageHeaderWrapper>
      {lb_account.data ? (
        <Row gutter={24}>
          <Col key="colkey1" {...dashboardTopColProps}>
            <CardAccountDetails {...cardProps} />
            <CardBillingDetails {...cardProps} />
            <CardMonthlyFees {...cardProps} />
            <CardInternet {...cardProps} />
            <CardTelephonyNumbers {...cardProps} />
          </Col>
        </Row>
      ) : null}
    </PageHeaderWrapper>
  );
};

export default connect(({ lb_account, kazoo_account }) => ({
  lb_account,
  kazoo_account,
}))(LBAccountDashboard);
