import React from 'react';
import { connect } from 'dva';
import { Tag } from 'antd';

import { PageHeaderWrapper } from '@ant-design/pro-layout';

const CallflowBuilder = props => {
  const { kazoo_account } = props;

  return (
    <PageHeaderWrapper>
      <div>
        Hello from Callflow Builder for <Tag>{kazoo_account.data.name}</Tag>!
      </div>
    </PageHeaderWrapper>
  );
};

export default connect(({ kazoo_account }) => ({
  kazoo_account,
}))(CallflowBuilder);
