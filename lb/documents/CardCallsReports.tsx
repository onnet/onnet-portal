import React from 'react';
import { Table, Card } from 'antd';
import { useIntl } from 'umi';
import Moment from 'react-moment';
import styles from '@/pages/onnet-portal/core/style.less';
import LbDownloadDoc from './LbDownloadDoc';

const CardCallsReports = (props) => {
  const { calls_reports_pdf, account_id } = props;
  const { formatMessage } = useIntl();

  const columns = [
    {
      title: formatMessage({ id: 'reseller_portal.Period', defaultMessage: 'Period' }),
      dataIndex: 'period',
      render: (text) => (
        <Moment parse="YYYY-M" format="YYYY-MM">
          {' '}
          {text}{' '}
        </Moment>
      ),
      key: 'period',
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
          id: 'reseller_portal.Calls_report',
          defaultMessage: 'Calls report',
        })}
        description={
          <Table
            dataSource={calls_reports_pdf}
            columns={columns}
            pagination={false}
            size="small"
            rowKey={(record) => record.order_id.toString() + record.order_num.toString()}
            onRow={(record, rowIndex) => ({
              onClick: (event) => {
                console.log('Clicked row event: ', event);
                console.log('Clicked row rowIndex: ', rowIndex);
                console.log('Clicked row record: ', record);
              },
            })}
          />
        }
      />
    </Card>
  );
};

export default CardCallsReports;
