import React, { useEffect, Fragment } from 'react';
import { connect } from 'dva';
import NumberFormat from 'react-number-format';
import { formatMessage } from 'umi-plugin-react/locale';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Row, Col } from 'antd';
import styles from '../style.less';

import CardPaymentsList from './CardPaymentsList';
import CardOnlinePayments from './CardOnlinePayments';
import CardWireTransfer from './CardWireTransfer';

const topColResponsiveProps = {
  xs: 24,
  sm: 24,
  md: 24,
  lg: 24,
  xl: 24,
  xxl: 12,
};

const CardProps = {
  style: { marginBottom: 24 },
};

const LbFinanceDetails = props => {
  const { dispatch, lb_account, kazoo_account } = props;

  useEffect(() => {
    if (kazoo_account.data) {
      dispatch({
        type: 'lb_account/refresh',
        payload: { account_id: kazoo_account.data.id },
      });
    }
  }, [kazoo_account]);

  const extraContent = (
    <div className={styles.extraContent}>
      <div className={styles.statItem}>
        <p>
          {formatMessage({
            id: 'reseller_portal.Account_status',
            defaultMessage: 'Account status',
          })}
        </p>
        <p>Active</p>
      </div>
      <div className={styles.statItem}>
        <p>
          {formatMessage({
            id: 'reseller_portal.Current_balance',
            defaultMessage: 'Current balance',
          })}
        </p>
        {lb_account.data ? (
          <NumberFormat
            value={lb_account.data.account_balance}
            displayType="text"
            thousandSeparator=" "
            decimalScale={2}
            renderText={value => <div>{value} руб.</div>}
          />
        ) : null}
      </div>
    </div>
  );

  return (
    <PageHeaderWrapper extra={extraContent}>
      {lb_account.data ? (
        <Fragment>
          <Row gutter={24}>
            <Col key="colkey11" {...topColResponsiveProps}>
              <CardWireTransfer
                {...CardProps}
                lb_account={lb_account}
                account_id={kazoo_account.data.id}
              />
            </Col>
            <Col key="colkey12" {...topColResponsiveProps}>
              <CardOnlinePayments
                {...CardProps}
                lb_account={lb_account}
                account_id={kazoo_account.data.id}
              />
            </Col>
          </Row>
          <Row gutter={24}>
            <Col key="colkey2" {...topColResponsiveProps}>
              <CardPaymentsList {...CardProps} lb_account={lb_account} />
            </Col>
          </Row>
        </Fragment>
      ) : null}
    </PageHeaderWrapper>
  );
};

export default connect(({ lb_account, kazoo_account }) => ({
  lb_account,
  kazoo_account,
}))(LbFinanceDetails);
