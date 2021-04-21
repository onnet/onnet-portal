import React from 'react';
import { Table, Card } from 'antd';

import { useIntl } from 'umi';
import Moment from 'react-moment';
import styles from '@/pages/onnet-portal/core/style.less';
import LbDownloadDoc from './LbDownloadDoc';

const CardVatInvoices = (props) => {
  const { proformas, account_id } = props;
  const { formatMessage } = useIntl();

  const columns = [
    {
      title: '№',
      dataIndex: 'order_num',
      key: 'order_num',
      width: '15%',
    },
    {
      title: formatMessage({ id: 'reseller_portal.Date', defaultMessage: 'Date' }),
      dataIndex: 'order_date',
      key: 'order_date',
      align: 'center',
      render: (text) => (
        <Moment parse="YYYY-M-D" format="YYYY-MM-DD">
          {' '}
          {text}{' '}
        </Moment>
      ),
    },
    {
      title: formatMessage({ id: 'reseller_portal.Counterparty', defaultMessage: 'Counterparty' }),
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: '',
      dataIndex: '',
      key: 'x',
      render: (record) => <LbDownloadDoc account_id={account_id} record={record} />,
    },
  ];

  return (
    <Card className={styles.card} {...props}>
      <Card.Meta
        title={formatMessage({
          id: 'reseller_portal.VAT_Invoices',
          defaultMessage: 'VAT Invoices',
        })}
        description={
          <Table
            dataSource={proformas}
            columns={columns}
            pagination={false}
            size="small"
            rowKey={(record) => record.order_id.toString() + record.order_num.toString()}
          />
        }
      />
    </Card>
  );
};

export default CardVatInvoices;
