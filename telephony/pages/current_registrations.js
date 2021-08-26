import React, { useState, useEffect, Fragment, useRef } from 'react';
import { connect, useIntl } from 'umi';
import { InfoCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { Tag, Button, Table, Modal, Input, Switch, Card } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import HeaderSearch from '@/pages/onnet-portal/core/components/HeaderSearch';
import Highlighter from 'react-highlight-words';
import { useMediaQuery } from 'react-responsive';
import gh_styles from '@/pages/onnet-portal/core/components/HeaderSearch/globhead.less';
import AccountName from '@/pages/onnet-portal/core/components/account_name';
import ResellerChildFlush from '@/pages/onnet-portal/reseller/portal/components/ResellerChildFlush';
import ResellerChildSearch from '@/pages/onnet-portal/reseller/portal/components/ResellerChildSearch';
import { getSIPRegistrations } from '@/pages/onnet-portal/core/services/kazoo';
import RegistrationDetailsDrawer from './components/RegistrationDetailsDrawer.jsx';
import styles from '@/pages/onnet-portal/core/style.less';
import { cardProps } from '@/pages/onnet-portal/core/utils/props';

const CurrentRegistrations = (props) => {
  const { dispatch, kz_login, kz_account, settings, child_account } = props;
  const [searchText, setSearchText] = useState('');
  const [currentTableLength, setCurrentTableLength] = useState(0);

  const [isPaginated, setIsPaginated] = useState({ position: 'bottom' });
  const [dataSource, setDataSource] = useState([]);
  const [dataRegistrations, setDataRegistrations] = useState([]);
  const [dataRegistrationsQty, setDataRegistrationsQty] = useState(0);
  const [isRegistrationDrawerVisible, setIsRegistrationDrawerVisible] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState({});
  const [dataSourceLoading, setDataSourceLoading] = useState(false);

  const isSmallDevice = useMediaQuery({ maxWidth: 991 });
  const { formatMessage } = useIntl();

  useEffect(() => {
    if (kz_account.data) {
      if ((kz_account?.data?.is_reseller && child_account?.data) || kz_account?.data)
        setRegistrationsState();
      dispatch({
        type: 'kz_children/refresh',
        payload: { account_id: kz_account.data.id, method: 'GET' },
      });
    }
  }, [kz_account, child_account]);

  function setRegistrationsState() {
    setDataSourceLoading(true);
    setDataRegistrations([]);
    setDataRegistrationsQty(0);
    setDataSource([]);
    getSIPRegistrations({
      account_id: kz_account.data.is_reseller ? child_account?.data?.id : kz_account.data.id,
      method: 'GET',
    })
      .then((resp) => {
        setDataRegistrationsQty(resp.data.length);
        setDataRegistrations(resp.data);
        setDataSource(resp.data);
        setDataSourceLoading(false);
      })
      .catch(() => console.log('Oops errors!'));
  }

  const handleSearch = (selectedKeys, confirm) => {
    confirm();
    setSearchText(selectedKeys[0]);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const countSelectedRegs = () => {
    const dsLength = dataSource.length;
    if (dsLength == 0) return 'No registrations found!';

    const drLength = dataRegistrations.length;
    if (drLength == dsLength) return `Registrations amount: ${drLength}`;

    return `Registrations selected: ${dsLength} / ${drLength}`;
  };

  const columns0 =
    kz_account?.data?.is_reseller && !child_account?.data
      ? [
          {
            title: 'Account Name',
            dataIndex: 'account_name',
            key: 'account_name',
            ellipsis: true,
            render: (text, record) =>
              record.account_name ? (
                <Button
                  size="small"
                  type="link"
                  onClick={() => {
                    dispatch({
                      type: 'child_account/refresh_by_realm',
                      payload: { realm: record.realm },
                    });
                    window.scrollTo({
                      top: 0,
                      left: 0,
                      behavior: 'smooth',
                    });
                  }}
                >
                  {record.account_name}
                </Button>
              ) : (
                <AccountName realm={record.realm} record={record} text={text} />
              ),
          },
        ]
      : [];

  const columns1 = [
    {
      title: 'Device',
      dataIndex: 'username',
      key: 'username',
      ellipsis: true,
    },
    {
      title: 'IP Address',
      dataIndex: 'source_ip',
      key: 'source_ip',
      align: 'center',
    },
    {
      title: 'User Agent',
      dataIndex: 'user_agent',
      key: 'user_agent',
      align: 'center',
      ellipsis: true,
    },
    {
      dataIndex: 'details',
      key: 'details',
      align: 'center',
      width: '5%',
      render: (text, record) => (
        <InfoCircleOutlined
          onClick={() => {
            onDrawerOpen(record);
          }}
        />
      ),
    },
  ];

  const columns = [...columns0, ...columns1];

  const onSearchChange = (value) => {
    if (value.length > 1) {
      console.log('onSearchChange dataRegistrations: ', dataRegistrations);
      const searchRes = _.filter(dataRegistrations, (o) =>
        _.includes(_.toString(Object.values(o)).toLowerCase(), value.toLowerCase()),
      );
      setDataSource(searchRes);
    } else {
      setDataSource(dataRegistrations);
    }
  };

  const handlePagination = (e) => {
    if (e) {
      setIsPaginated({ position: 'bottom' });
    } else {
      setIsPaginated(false);
    }
  };

  const onDrawerOpen = (record) => {
    setSelectedRegistration(record);
    setIsRegistrationDrawerVisible(true);
  };

  const onRegistrationDrawerClose = () => {
    setIsRegistrationDrawerVisible(false);
    setSelectedRegistration({});
  };

  return (
    <PageHeaderWrapper
      tags={
        <Tag color="blue">
          {dataRegistrations.length > 0 ? dataRegistrations.length : 'No registrations found!'}
        </Tag>
      }
      extra={[<ResellerChildFlush key="extraFlush" />, <ResellerChildSearch key="extraSearch" />]}
    >
      <Fragment>
        <Card hoverable className={styles.card} {...cardProps}>
          <Card.Meta
            title={
              <Fragment>
                <HeaderSearch
                  className={`${gh_styles.action} ${gh_styles.search}`}
                  style={{ marginLeft: '0.5em', display: 'inline-flex' }}
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
              </Fragment>
            }
            description={
              <Table
                dataSource={dataSource}
                columns={columns}
                pagination={isPaginated}
                loading={dataSourceLoading}
                size="small"
                bordered
                onChange={(pagination, filter, sorter, { currentDataSource }) => {
                  setCurrentTableLength(currentDataSource.length);
                }}
                footer={countSelectedRegs}
                style={{ backgroundColor: 'white' }}
                rowKey={(record) =>
                  record.event_timestamp.toString().replace(/[^A-Za-z0-9]/g, '') +
                  record.call_id.replace(/[^A-Za-z0-9]/g, '')
                }
              />
            }
          />
        </Card>
        <RegistrationDetailsDrawer
          selectedRegistration={selectedRegistration}
          onRegistrationDrawerClose={onRegistrationDrawerClose}
          isRegistrationDrawerVisible={isRegistrationDrawerVisible}
        />
      </Fragment>
    </PageHeaderWrapper>
  );
};

export default connect(({ kz_login, kz_account, child_account }) => ({
  kz_login,
  kz_account,
  child_account,
}))(CurrentRegistrations);
