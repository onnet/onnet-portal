import React from 'react';
import { connect } from 'dva';
import { Spin, List } from 'antd';

import { PageHeaderWrapper } from '@ant-design/pro-layout';
import AccountDetails from '../portal/AccountDetails';

const ResellerSettings = props => {
  const { kazoo_account } = props;

  console.log('ResellerSettings kazoo_account: ', kazoo_account);

  if (!kazoo_account.data) {
    return <Spin />;
  }

  const data = [<AccountDetails key="AccountDetails1" />, <AccountDetails key="AccountDetails2" />];

  return (
    <PageHeaderWrapper>
      <div
        style={{
          backgroundColor: 'white',
          display: 'flow-root',
          marginBottom: '1em',
          padding: '1em',
        }}
      >
        Hello from Reseller Settings <b>{kazoo_account.data.name}</b>!
      </div>

      <List
        grid={{ gutter: 24, xxl: 2, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
        dataSource={data}
        renderItem={item => <List.Item>{item}</List.Item>}
      />
    </PageHeaderWrapper>
  );
};

export default connect(({ kazoo_account }) => ({
  kazoo_account,
}))(ResellerSettings);
