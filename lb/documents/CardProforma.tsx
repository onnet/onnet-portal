import React from 'react';
import { Table, Card } from 'antd';

import { formatMessage } from 'umi-plugin-react/locale';
import Moment from 'react-moment';
import LbDownloadDoc from './LbDownloadDoc';

import styles from '@/pages/onnet-portal/core/style.less';

const CardProforma = props => {
  const { proformas, account_id } = props;

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
      render: text => (
        <Moment parse="YYYY-M-D" format="YYYY-MM-DD">
          {' '}
          {text}{' '}
        </Moment>
      ),
      align: 'center',
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
      render: record => <LbDownloadDoc account_id={account_id} record={record} />,
    },
  ];

  return (
    <Card className={styles.card} {...props}>
      <Card.Meta
        avatar={
          <img
            alt=""
            className={styles.cardAvatar}
            src="https://api.adorable.io/avatars/24/CardProforma.png"
          />
        }
        title={formatMessage({ id: 'reseller_portal.Invoices', defaultMessage: 'Invoices' })}
        description={
          <Table
            dataSource={proformas}
            columns={columns}
            pagination={false}
            size="small"
            rowKey={record => record.order_id.toString() + record.order_num.toString()}
          />
        }
      />
    </Card>
  );
};

export default CardProforma;
