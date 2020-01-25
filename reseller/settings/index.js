import React from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';

import { PageHeaderWrapper } from '@ant-design/pro-layout';

const ResellerSettings = props => {
  const { kazoo_account } = props;

  console.log('ResellerSettings kazoo_account: ', kazoo_account);

  if (!kazoo_account.data) {
    return <Spin />;
  }

  return (
    <PageHeaderWrapper>
      <div style={{ backgroundColor: 'white', display: 'flow-root' }}>
        Hello from Reseller Settings <b>{kazoo_account.data.name}</b>!
      </div>
    </PageHeaderWrapper>
  );
};

export default connect(({ kazoo_account }) => ({
  kazoo_account,
}))(ResellerSettings);
