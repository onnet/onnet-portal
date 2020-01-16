import React, { useEffect } from 'react';

import { connect } from 'dva';
import router from 'umi/router';
import Redirect from 'umi/redirect';
import JSONPretty from 'react-json-pretty';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Tabs, Card, Table, List, Typography } from 'antd';

import styles from './style.less';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const ZoneInfo = props => {
  const { settings, kazoo_account = {}, kz_system_status = {}, location } = props;

  useEffect(() => {
    if (kazoo_account.data) {
      if (kazoo_account.data.superduper_admin) {
        router.push('/int/dashboard');
      }
    }
  }, [kazoo_account]);

  if (!kz_system_status.data) return <Redirect to="/int/dashboard" />;

  if (!kz_system_status.data[location.state.zone]) return <Redirect to="/int/dashboard" />;

  const kapps = Object.values(kz_system_status.data[location.state.zone].kazoo_apps);
  const kamailios = kz_system_status.data[location.state.zone].kamailio
    ? Object.values(kz_system_status.data[location.state.zone].kamailio)
    : [];
  const list = kapps.concat(kamailios);

  const getDataSource = item => {
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
          value: item.kapps.map(kapp => `${kapp} `),
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

  const select_avatar_img = item => {
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
    router.push({ pathname: '/int/zone', state: { zone: e } });
  }

  return (
    <PageHeaderWrapper
      title={
        <Title level={4}>
          Zone details:
          <Text className={styles.zoneLabel} style={{ color: settings.primaryColor }}>
            {location.state.zone}
          </Text>
        </Title>
      }
      extra={[
        <Tabs defaultActiveKey={location.state.zone} onChange={callback} key="zones_tabs">
          {kz_system_status.data
            ? Object.keys(kz_system_status.data)
                .reverse()
                .map(z => <TabPane key={z} tab={z} />)
            : null}
        </Tabs>,
      ]}
    >
      <div className={styles.cardList}>
        <List
          rowKey="id"
          grid={{ gutter: 24, xxl: 2, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
          dataSource={list}
          renderItem={item => (
            <List.Item key={item.node}>
              <Card hoverable className={styles.card}>
                <Card.Meta
                  avatar={
                    <img alt="" className={styles.cardAvatar} src={select_avatar_img(item)} />
                  }
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
            </List.Item>
          )}
        />
      </div>
    </PageHeaderWrapper>
  );
};

export default connect(
  ({ settings, kazoo_login, kazoo_account, kz_system_status, rs_registrations_count }) => ({
    settings,
    kazoo_login,
    kazoo_account,
    kz_system_status,
    rs_registrations_count,
  }),
)(ZoneInfo);
