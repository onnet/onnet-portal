import React, { useState, useEffect, Fragment, useRef } from 'react';
import { connect, useIntl } from 'umi';
import { InfoCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { Tag, Button, Table, Modal, Input, Switch, Card } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import HeaderSearch from '@/pages/onnet-portal/core/components/HeaderSearch';
import Highlighter from 'react-highlight-words';
import ReactJson from 'react-json-view';
import { useMediaQuery } from 'react-responsive';
import gh_styles from '@/pages/onnet-portal/core/components/HeaderSearch/globhead.less';
import AccountName from '@/pages/onnet-portal/core/components/account_name';
import { reactJsonProps } from '@/pages/onnet-portal/core/utils/props';
import ResellerChildFlush from '@/pages/onnet-portal/reseller/portal/components/ResellerChildFlush';
import ResellerChildSearch from '@/pages/onnet-portal/reseller/portal/components/ResellerChildSearch';
import { getSIPRegistrations } from '@/pages/onnet-portal/core/services/kazoo';
import RegistrationDetailsDrawer from './components/RegistrationDetailsDrawer.jsx';
import styles from '@/pages/onnet-portal/core/style.less';
import { cardProps } from '@/pages/onnet-portal/core/utils/props';

function info(reg_details) {
  Modal.info({
    title: 'Registration details',
    width: 'max-content',
    maskClosable: true,
    content: <ReactJson src={reg_details} {...reactJsonProps} />,
    onOk() {},
  });
}

const CurrentRegistrations = (props) => {
  const { dispatch, kz_login, kz_account, rs_registrations, settings, child_account } = props;
  const [searchText, setSearchText] = useState('');
  const [currentTableLength, setCurrentTableLength] = useState(0);

  const [isPaginated, setIsPaginated] = useState({ position: 'bottom' });
  const [dataSource, setDataSource] = useState([]);
  const [dataRegistrations, setDataRegistrations] = useState([]);
  const [dataRegistrationsQty, setDataRegistrationsQty] = useState(0);
  const [isRegistrationDrawerVisible, setIsRegistrationDrawerVisible] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState(false);
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
        console.log('getSIPRegistrations resp: ', resp);
        console.log('getSIPRegistrations resp.data: ', resp.data);
        let formattedRegs;
        formattedRegs = resp.data.map((u, i) => ({
          key: `idx_${i}_reg_${u.username}@${u.realm}`,
          username: `${u.username}@${u.realm}`,
          source_ip: u.source_ip,
          user_agent: u.user_agent,
        }));
        console.log('getSIPRegistrations formattedRegs: ', formattedRegs);
        setDataRegistrationsQty(resp.data.length);
        setDataRegistrations(resp.data);
        setDataSource(formattedRegs);
        setDataSourceLoading(false);
      })
      .catch(() => console.log('Oops errors!'));
  }

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => handleSearch(selectedKeys, confirm)}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          Reset
        </Button>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.select());
      }
    },
    render: (text) => (
      <Highlighter
        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
        searchWords={[searchText]}
        autoEscape
        textToHighlight={text.toString()}
      />
    ),
  });

  const handleSearch = (selectedKeys, confirm) => {
    confirm();
    setSearchText(selectedKeys[0]);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const countSelectedRegs = () => {
    if (currentTableLength) {
      return `Registrations amount: ${currentTableLength}`;
    }
    return rs_registrations?.data
      ? `Registrations amount: ${rs_registrations.data.length}`
      : 'No registrations found!';
  };

  const columns0 =
    kz_account?.data?.is_reseller && !child_account?.data
      ? [
          {
            title: 'Account Name',
            dataIndex: 'account_name',
            key: 'account_name',
            ellipsis: true,
            render: (text, record) => <AccountName realm={record.key?.split('@').pop(-1)} />,
          },
        ]
      : [];

  const columns1 = [
    {
      title: 'Device',
      dataIndex: 'username',
      key: 'username',
      ellipsis: true,
      ...getColumnSearchProps('username'),
    },
    {
      title: 'IP Address',
      dataIndex: 'source_ip',
      key: 'source_ip',
      align: 'center',
      ...getColumnSearchProps('source_ip'),
    },
    {
      title: 'User Agent',
      dataIndex: 'user_agent',
      key: 'user_agent',
      align: 'center',
      ellipsis: true,
      ...getColumnSearchProps('user_agent'),
    },
    {
      dataIndex: 'details',
      key: 'details',
      align: 'center',
      width: '5%',
      render: (text, record) => (
        <InfoCircleOutlined
          onClick={() => {
            const result = dataRegistrations.find(
              ({ username, realm }) => `${username}@${realm}` === record.username,
            );
            onDrawerOpen(result);
            //        info(result);
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
    setSelectedRegistration(false);
  };

  return (
    <PageHeaderWrapper
      tags={
        <Tag color="blue">
          {rs_registrations.data ? rs_registrations.data.length : 'No registrations found!'}
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

export default connect(({ kz_login, kz_account, rs_registrations, child_account }) => ({
  kz_login,
  kz_account,
  rs_registrations,
  child_account,
}))(CurrentRegistrations);
