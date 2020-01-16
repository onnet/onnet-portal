import React from 'react';
import { connect } from 'dva';
import { Tag } from 'antd';

import { PageHeaderWrapper } from '@ant-design/pro-layout';

const ResellerSettings = props => {
  const { kazoo_account } = props;

  return (
    <PageHeaderWrapper>
      <div>
        Hello from Reseller Settings for <Tag>{kazoo_account.data.name}</Tag>!
      </div>
    </PageHeaderWrapper>
  );
};

export default connect(({ kazoo_account }) => ({
  kazoo_account,
}))(ResellerSettings);
