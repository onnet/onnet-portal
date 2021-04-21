import React from 'react';
import NumberFormat from 'react-number-format';
import { Table, Card } from 'antd';

import { useIntl } from 'umi';

import styles from '@/pages/onnet-portal/core/style.less';

const CardPaymentsList = (props) => {
  const { lb_account } = props;
  const { formatMessage } = useIntl();

  const columns = [
    {
      title: formatMessage({ id: 'reseller_portal.Date', defaultMessage: 'Date' }),
      dataIndex: 'pay_date',
      key: 'pay_date',
      width: '15%',
    },
    {
      title: (
        <span>
          {formatMessage({ id: 'reseller_portal.Sum_rub', defaultMessage: 'Sum, rub.' })}
          <small>
            {' '}
            ({formatMessage({ id: 'reseller_portal.incl_vat', defaultMessage: 'incl VAT' })})
          </small>
        </span>
      ),
      dataIndex: 'amount',
      key: 'amount',
      render: (text, row) => (
        <NumberFormat
          value={row.amount}
          displayType="text"
          thousandSeparator=" "
          decimalScale={2}
          renderText={(value) => (
            <div>
              {value} руб.
              <small> (с учетом НДС)</small>
            </div>
          )}
        />
      ),
    },
    {
      title: formatMessage({ id: 'reseller_portal.Comment', defaultMessage: 'Comment' }),
      dataIndex: 'comment',
      key: 'comment',
      render: (text, row) => {
        if (row.comment.length > 0) {
          return <span>{row.comment}</span>;
        }
        return (
          <span>
            {formatMessage({
              id: 'reseller_portal.Wiretransfer',
              defaultMessage: 'Wire transfer',
            })}
          </span>
        );
      },
    },
  ];

  return (
    <Card className={styles.card} {...props}>
      <Card.Meta
        title={formatMessage({
          id: 'reseller_portal.Paymentslist',
          defaultMessage: 'Payments list',
        })}
        description={
          <Table
            dataSource={lb_account.data.account_payments}
            columns={columns}
            pagination
            showHeader
            size="small"
            rowKey={(record) =>
              record.amount.toString().replace(/[^A-Za-z0-9]/g, '') +
              record.pay_date.replace(/[^A-Za-z0-9]/g, '') +
              record.comment.replace(/[^A-Za-z0-9]/g, '')
            }
          />
        }
      />
    </Card>
  );
};

export default CardPaymentsList;
