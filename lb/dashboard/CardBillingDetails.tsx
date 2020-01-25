import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Table, Card } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import MoneyFormat from '@/pages/onnet-portal/core/components/MoneyFormat';

import styles from '@/pages/onnet-portal/core/style.less';

const CardBillingDetails = props => {
  const { lb_account } = props;

  if (!lb_account.data) {
    return null;
  }

  const tableData = [
    {
      key: '1',
      name: 'Account status',
      value: lb_account.data.account_status.status ? <b>Active</b> : <b>Blocked</b>,
    },
    {
      key: '2',
      name: 'Current balance',
      value: (
        <Fragment>
          <MoneyFormat amount={lb_account.data.account_balance} />
          <small> (с учетом НДС)</small>
        </Fragment>
      ),
    },
    {
      key: '3',
      name: 'Previous payment',
      value: lb_account.data.account_payments[0] ? (
        <Fragment>
          {lb_account.data.account_payments[0].pay_date}
          <MoneyFormat amount={lb_account.data.account_payments[0].amount} prefix=" - " />
          <small> (с учетом НДС)</small>
        </Fragment>
      ) : null,
    },
  ];

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: '35%',
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
    },
  ];

  return (
    <Card className={styles.card} {...props}>
      <Card.Meta
        avatar={
          <img
            alt=""
            className={styles.cardAvatar}
            src="https://api.adorable.io/avatars/24/billingdetails.png"
          />
        }
        title={formatMessage({ id: 'reseller_portal.Account', defaultMessage: 'Account' })}
        description={
          <Table
            dataSource={tableData}
            columns={columns}
            pagination={false}
            showHeader={false}
            size="small"
          />
        }
      />
    </Card>
  );
};

export default connect(({ lb_account }) => ({
  lb_account,
}))(CardBillingDetails);
