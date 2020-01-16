import React, { useEffect } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Row, Col } from 'antd';

import CardAccountDetails from './CardAccountDetails';
import CardBillingDetails from './CardBillingDetails';
import CardMonthlyFees from './CardMonthlyFees';
import CardTelephonyNumbers from './CardTelephonyNumbers';
import CardInternet from './CardInternet';

const topColResponsiveProps = {
  xs: 24,
  sm: 24,
  md: 24,
  lg: 24,
  xl: 12,
  xxl: 12,
};

const CardProps = {
  style: { marginBottom: 24 },
};

const LBAccountDashboard = props => {
  const { dispatch, lb_account, kazoo_account, settings } = props;

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
          <Col key="colkey1" {...topColResponsiveProps}>
            <CardAccountDetails {...CardProps} lb_account={lb_account} />
            <CardBillingDetails {...CardProps} lb_account={lb_account} />
          </Col>
          <Col key="colkey2" {...topColResponsiveProps}>
            {lb_account.data.monthly_fees.length > 0 ? (
              <CardMonthlyFees {...CardProps} lb_account={lb_account} />
            ) : null}
            {lb_account.data.ip_addresses_by_tariff.length > 0 ? (
              <CardInternet {...CardProps} lb_account={lb_account} settings={settings} />
            ) : null}
            {lb_account.data.phone_numbers_by_tariff.length > 0 ? (
              <CardTelephonyNumbers {...CardProps} lb_account={lb_account} settings={settings} />
            ) : null}
          </Col>
        </Row>
      ) : null}
    </PageHeaderWrapper>
  );
};

export default connect(({ lb_account, kazoo_account, settings }) => ({
  lb_account,
  kazoo_account,
  settings,
}))(LBAccountDashboard);
