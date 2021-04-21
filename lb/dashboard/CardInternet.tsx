import React from 'react';
import { useIntl, connect } from 'umi';
import { Table, Tag, Card } from 'antd';
import { cardProps } from '@/pages/onnet-portal/core/utils/props';

import styles from '@/pages/onnet-portal/core/style.less';

const CardInternet = (props) => {
  const { lb_account = { data: {} }, settings = {} } = props;
  const { formatMessage } = useIntl();

  if (lb_account.data.ip_addresses_by_tariff) {
    if (lb_account.data.ip_addresses_by_tariff.length === 0) {
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
      title: 'IP addresses',
      dataIndex: 'vg_id_numbers',
      key: 'vg_id_numbers',
      render: (text, row, index) =>
        row.vg_id_ip_addresses.map((ip_address) => (
          <Tag key={index} color={settings.primaryColor} style={{ margin: '0.5em' }}>
            {ip_address}
          </Tag>
        )),
    },
  ];

  return (
    <Card className={styles.card} {...cardProps}>
      <Card.Meta
        title={formatMessage({ id: 'reseller_portal.Internet', defaultMessage: 'Internet' })}
        description={
          <Table
            dataSource={lb_account.data.ip_addresses_by_tariff}
            columns={columns}
            rowKey="tar_id"
            pagination={false}
            size="small"
          />
        }
      />
    </Card>
  );
};

export default connect(({ lb_account, settings }) => ({
  lb_account,
  settings,
}))(CardInternet);
