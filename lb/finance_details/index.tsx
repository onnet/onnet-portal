import React, { useEffect, Fragment } from 'react';
import { useIntl, connect } from 'umi';
import NumberFormat from 'react-number-format';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Row, Col } from 'antd';
import { cardProps } from '@/pages/onnet-portal/core/utils/props';
import styles from '../style.less';

import CardPaymentsList from './CardPaymentsList';
import CardOnlinePayments from './CardOnlinePayments';
import CardWireTransfer from './CardWireTransfer';

const LbFinanceDetails = (props) => {
  const { dispatch, lb_account, kz_account, kz_user } = props;
  const { formatMessage } = useIntl();

  useEffect(() => {
    if (kz_account.data) {
      dispatch({
        type: 'lb_account/refresh',
        payload: { account_id: kz_account.data.id },
      });
    }
  }, [kz_account]);

  return (
    <PageHeaderWrapper breadcrumb={false}>
      {lb_account.data ? (
        <Fragment>
          <Row gutter={24}>
            <Col key="colkey11" span={24}>
              <CardWireTransfer
                {...cardProps}
                lb_account={lb_account}
                account_id={kz_account.data.id}
              />
            </Col>
          </Row>
          <Row gutter={24}>
            <Col key="colkey12" span={24}>
              <CardOnlinePayments
                {...cardProps}
                lb_account={lb_account}
                account_id={kz_account.data.id}
              />
            </Col>
          </Row>
          <Row gutter={24}>
            <Col key="colkey2" span={24}>
              <CardPaymentsList {...cardProps} lb_account={lb_account} />
            </Col>
          </Row>
        </Fragment>
      ) : null}
    </PageHeaderWrapper>
  );
};

export default connect(({ lb_account, kz_account, kz_user }) => ({
  lb_account,
  kz_account,
  kz_user,
}))(LbFinanceDetails);
