import React from 'react';
import { useIntl, connect } from 'umi';
import { Table, Tag, Card } from 'antd';
import { findNumbers } from 'libphonenumber-js';
import { cardProps } from '@/pages/onnet-portal/core/utils/props';

/* import styles from '@/pages/onnet-portal/core/style.less'; */
import styles from '../style.less';

const CardTelephonyNumbers = (props) => {
  const { lb_account = { data: {} }, settings = {} } = props;
  const { formatMessage } = useIntl();

  if (lb_account.data.phone_numbers_by_tariff) {
    if (lb_account.data.phone_numbers_by_tariff.length === 0) {
      return null;
    }
  } else {
    return null;
  }

  const columns = [
    {
      title: 'Tariff name',
      dataIndex: 'tar_descr',
      key: 'tar_descr',
      width: '35%',
    },
    {
      title: 'Phone numbers',
      dataIndex: 'vg_id_numbers',
      key: 'vg_id_numbers',
      render: (text, row, index) =>
        row.vg_id_numbers.map((phone) => {
          const phoneNumber = findNumbers(phone, 'RU', { v2: true })[0].number;
          return (
            <Tag
              key={`${index}tagkey${phone.replace(/[^A-Za-z0-9]/g, '')}`}
              color={settings.primaryColor}
              style={{ margin: '0.5em' }}
            >
              {phoneNumber.formatNational()}
            </Tag>
          );
        }),
    },
  ];

  return (
    <Card className={styles.card} {...cardProps}>
      <Card.Meta
        title={formatMessage({ id: 'reseller_portal.Telephony', defaultMessage: 'Telephony' })}
        description={
          <Table
            dataSource={lb_account.data.phone_numbers_by_tariff}
            columns={columns}
            pagination={false}
            size="small"
            rowKey={(record) =>
              record.tar_id +
              record.tar_descr.replace(/[^A-Za-z0-9]/g, '') +
              record.vg_id_numbers[0].replace(/[^0-9]/g, '')
            }
          />
        }
      />
    </Card>
  );
};

export default connect(({ lb_account, settings }) => ({
  lb_account,
  settings,
}))(CardTelephonyNumbers);
