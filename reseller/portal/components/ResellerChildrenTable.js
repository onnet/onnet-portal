import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Button, Table } from 'antd';
import info_details_fun from '@/pages/onnet-portal/core/components/info_details';

const ResellerChildrenTable = props => {
  const { settings, rs_children } = props;

  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    if (rs_children.data) {
      setDataSource(rs_children.data);
    }
  }, [rs_children]);

  const columns = [
    {
      title: formatMessage({ id: 'reseller_portal.account_name', defaultMessage: 'Account name' }),
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Button
          size="small"
          type="link"
          onClick={() => {
            window.g_app._store.dispatch({
              type: 'rs_child_account/refresh',
              payload: { account_id: record.id },
            });
            window.scrollTo({
              top: 0,
              left: 0,
              behavior: 'smooth',
            });
          }}
        >
          {text}
        </Button>
      ),
    },
    {
      title: formatMessage({ id: 'reseller_portal.realm', defaultMessage: 'Realm' }),
      dataIndex: 'realm',
      key: 'realm',
      align: 'center',
    },
    {
      title: formatMessage({
        id: 'reseller_portal.descendants_count',
        defaultMessage: 'Descendants count',
      }),
      dataIndex: 'descendants_count',
      key: 'descendants_count',
      align: 'center',
    },
    {
      //      title: 'Details',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      render: (text, record) => (
        <InfoCircleOutlined
          style={{ color: settings.primaryColor }}
          onClick={event => {
            console.log('event', event);
            const result = dataSource.find(({ id }) => id === record.id);
            console.log('result', result);
            info_details_fun(result);
          }}
        />
      ),
    },
  ];

  return (
    <Table
      dataSource={dataSource}
      rowKey="id"
      columns={columns}
      pagination={{ position: 'both' }}
      bordered
      //          loading={dataSourceLoading}
      style={{ backgroundColor: 'white' }}
    />
  );
};

export default connect(({ settings, rs_children }) => ({
  settings,
  rs_children,
}))(ResellerChildrenTable);
