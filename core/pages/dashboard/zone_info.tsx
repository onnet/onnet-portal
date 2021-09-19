import React, { useEffect } from 'react';
import { connect, Redirect, history } from 'umi';
import JSONPretty from 'react-json-pretty';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Tabs, Card, Table, Typography, Spin } from 'antd';
import Masonry from 'react-masonry-css';
import SuperAdminPie from './super_admin_pie';

import { masonryBreakpointCols } from '@/pages/onnet-portal/core/utils/props';

import styles from './style.less';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const ZoneInfo = (props) => {
  const { dispatch, settings, kz_login, kz_account = {}, kz_system_status = {}, location } = props;

  useEffect(() => {
    if (kz_account.data) {
      if (!kz_account?.data?.superduper_admin) {
        history.push('/int/dashboard');
      }
    }
  }, [kz_account, kz_system_status]);

  if (kz_system_status.data) {
    if (!kz_system_status.data[location?.state?.zone] && location?.state?.zone !== 'pie') {
      console.log(
        'Absent zone name. Redirecting to dashboard. kz_system_status: ',
        kz_system_status,
      );
      //  return <Redirect to="/int/dashboard" />;
      return (
        <Redirect
          to={{
            pathname: '/int/zone',
            state: { zone: Object.keys(kz_system_status.data).reverse()[0] },
          }}
        />
      );
    }
  } else {
    dispatch({
      type: 'kz_system_status/refresh',
      payload: { account_id: kz_login?.data?.account_id },
    });
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          margin: 'auto',
          paddingTop: 100,
          textAlign: 'center',
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  const getDataSource = (item) => {
    if (item.node.includes('kamailio')) {
      return [
        {
          key: '1',
          name: 'Version',
          value: item.version,
        },
        {
          key: '2',
          name: 'Memory Usage',
          value: item.used_memory,
        },
        {
          key: '3',
          name: 'Broker',
          value: item.broker,
        },
        {
          key: '4',
          name: 'Registrations',
          value: item.roles.Registrar.Registrations,
        },
        {
          key: '5',
          name: 'Dispatcher',
          value: <JSONPretty id={item.node} data={item.roles.Dispatcher} />,
        },
      ];
    }
    if (item.node.includes('kazoo_apps')) {
      return [
        {
          key: '1',
          name: 'Version',
          value: item.version,
        },
        {
          key: '2',
          name: 'Memory Usage',
          value: item.used_memory,
        },
        {
          key: '3',
          name: 'Processes',
          value: item.processes,
        },
        {
          key: '4',
          name: 'Ports',
          value: item.ports,
        },
        {
          key: '5',
          name: 'Broker',
          value: item.broker,
        },
        {
          key: '6',
          name: 'Node Info',
          //     value: JSON.stringify(item.node_info, undefined, 2),
          value: <JSONPretty id={item.node} data={item.node_info} />,
        },
        {
          key: '7',
          name: 'Kapps',
          value: item.kapps.map((kapp) => `${kapp} `),
        },
        {
          key: '8',
          name: 'Registrations',
          value: item.registrations,
        },
      ];
    }
    if (item.node.includes('freeswitch')) {
      return [];
    }
    return [];
  };

  const select_avatar_img = (item) => {
    if (item.node.includes('kamailio')) {
      return '/icons/kamailioicon.svg';
    }
    if (item.node.includes('freeswitch')) {
      return '/icons/fsicon.svg';
    }
    return '/icons/2600hz.png';
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
    },
  ];

  function callback(e) {
    history.push({ pathname: '/int/zone', state: { zone: e } });
  }

  const kapps = kz_system_status.data[location.state.zone]
    ? Object.values(kz_system_status.data[location.state.zone].kazoo_apps)
    : [];
  const kamailios = kz_system_status.data[location.state.zone]?.kamailio
    ? Object.values(kz_system_status.data[location.state.zone].kamailio)
    : [];
  const list = kapps.concat(kamailios);

  const items = list.map((item) => (
    <Card hoverable className={styles.card} key={item.node}>
      <Card.Meta
        avatar={<img alt="" className={styles.cardAvatar} src={select_avatar_img(item)} />}
        title={<a>{item.node}</a>}
        description={
          <Table
            dataSource={getDataSource(item)}
            columns={columns}
            pagination={false}
            showHeader={false}
            size="small"
          />
        }
      />
    </Card>
  ));

  const pie_tab =
    Object.keys(kz_system_status.data).length > 1 ? [<TabPane key={'pie'} tab={'Pie'} />] : [];
  const my_tabs = kz_system_status.data
    ? Object.keys(kz_system_status.data)
        .reverse()
        .map((z) => <TabPane key={z} tab={z} />)
    : null;

  const my_title =
    location?.state?.zone !== 'pie' ? (
      <>
        Zone details:
        <Text className={styles.zoneLabel} style={{ color: settings.primaryColor }}>
          {location.state.zone}
        </Text>
      </>
    ) : (
      <Text className={styles.zoneLabel} style={{ color: settings.primaryColor }}>
        Pie
      </Text>
    );
  return (
    <PageHeaderWrapper
      title={<Title level={4}>{my_title}</Title>}
      extra={[
        <Tabs defaultActiveKey={location.state.zone} onChange={callback} key="zones_tabs">
          {[...my_tabs, ...pie_tab]}
        </Tabs>,
      ]}
    >
      {location?.state?.zone === 'pie' ? (
        <SuperAdminPie />
      ) : (
        <Masonry
          breakpointCols={masonryBreakpointCols}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {items}
        </Masonry>
      )}
    </PageHeaderWrapper>
  );
};

export default connect(
  ({ settings, kz_login, kz_account, kz_system_status, kz_registrations_count }) => ({
    settings,
    kz_login,
    kz_account,
    kz_system_status,
    kz_registrations_count,
  }),
)(ZoneInfo);
