import React, { useEffect, useState } from 'react';
import { useIntl, connect } from 'umi';
import { useMediaQuery } from 'react-responsive';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Button, Table, Card, Switch } from 'antd';
import info_details_fun from '@/pages/onnet-portal/core/components/info_details';
import gh_styles from '@/pages/onnet-portal/core/components/HeaderSearch/globhead.less';
import styles from '@/pages/onnet-portal/core/style.less';
import { cardProps } from '@/pages/onnet-portal/core/utils/props';
import HeaderSearch from '@/pages/onnet-portal/core/components/HeaderSearch';

const ResellerChildrenTable = (props) => {
  const { dispatch, settings, kz_children } = props;

  const [dataSource, setDataSource] = useState([]);

  const [isPaginated, setIsPaginated] = useState({ position: 'bottom' });
  const [dataSales, setDataSales] = useState([]);
  const [dataSourceLoading, setDataSourceLoading] = useState(true);
  const [isAccountDetailsDrawerIdVisible, setIsAccountDetailsDrawerIdVisible] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState(false);

  const isSmallDevice = useMediaQuery({ maxWidth: 991 });

  useEffect(() => {
    if (kz_children.data) {
      setDataSourceLoading(true);
      setDataSales(kz_children.data);
      setDataSource(kz_children.data);
      setDataSourceLoading(false);
    }
  }, [kz_children]);

  const { formatMessage } = useIntl();

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
            dispatch({
              type: 'child_account/refresh',
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
          onClick={(event) => {
            console.log('event', event);
            const result = dataSource.find(({ id }) => id === record.id);
            console.log('result', result);
            info_details_fun(result);
          }}
        />
      ),
    },
  ];

  const onSearchChange = (value) => {
    console.log('Value: ', value);
    if (value.length > 1) {
      const searchRes = _.filter(dataSales, (o) =>
        _.includes(_.toString(Object.values(o)).toLowerCase(), value.toLowerCase()),
      );
      setDataSource(searchRes);
    } else {
      setDataSource(dataSales);
    }
  };

  const handlePagination = (e) => {
    if (e) {
      setIsPaginated({ position: 'bottom' });
    } else {
      setIsPaginated(false);
    }
  };


  return (
      <Card hoverable className={styles.card} {...cardProps}>
        <Card.Meta
          title={
            <>
              <HeaderSearch
                className={`${gh_styles.action} ${gh_styles.search}`}
                style={{ marginLeft: '1em', display: 'inline-flex' }}
                onSearch={(value) => {
                  console.log('input', value);
                }}
                onChange={onSearchChange}
              />
              <p style={{ float: 'right', display: 'inline-flex' }}>
                {!isSmallDevice
                  ? `${formatMessage({
                      id: 'core.pagination',
                      defaultMessage: 'pagination',
                    })}: `
                  : null}
                <Switch
                  style={{ marginLeft: '1em', marginTop: '0.4em' }}
                  checked={!!isPaginated}
                  onChange={handlePagination}
                  size="small"
                />
              </p>
            </>
          }

	  description={

    <Table
      dataSource={dataSource}
      rowKey="id"
      columns={columns}
      pagination={{ position: 'both' }}
      bordered
      //          loading={dataSourceLoading}
      style={{ backgroundColor: 'white' }}
    />
          }
        />
      </Card>

  );
};

export default connect(({ settings, kz_children }) => ({
  settings,
  kz_children,
}))(ResellerChildrenTable);
