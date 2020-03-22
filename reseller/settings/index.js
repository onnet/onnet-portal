import React from 'react';
import { connect } from 'dva';
import { Spin, List } from 'antd';

import { PageHeaderWrapper } from '@ant-design/pro-layout';
import UsersList from '@/pages/onnet-portal/core/components/UsersList';

const ResellerSettings = props => {
  const { settings, kz_account } = props;

  if (!kz_account.data) {
    return <Spin />;
  }

  const data = [<UsersList key="UsersList1" />];

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
        Hello <b style={{color: settings.primaryColor}}>{kz_account.data.name}</b>!
      </div>

      <List
        grid={{ gutter: 24, xxl: 2, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
        dataSource={data}
        renderItem={item => <List.Item>{item}</List.Item>}
      />
    </PageHeaderWrapper>
  );
};

export default connect(({ settings, kz_account }) => ({
  settings,
  kz_account,
}))(ResellerSettings);
