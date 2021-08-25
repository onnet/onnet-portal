import React from 'react';
import { connect } from 'umi';
import { Tag } from 'antd';

import { PageHeaderWrapper } from '@ant-design/pro-layout';

const CallflowBuilder = (props) => {
  const { kz_account } = props;

  return (
    <PageHeaderWrapper>
      <div>
        Hello from Callflow Builder for <Tag>{kz_account?.data?.name}</Tag>!
      </div>
    </PageHeaderWrapper>
  );
};

export default connect(({ kz_account }) => ({
  kz_account,
}))(CallflowBuilder);
