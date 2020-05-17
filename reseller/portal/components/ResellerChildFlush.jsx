import React from 'react';
import { connect } from 'dva';
import { UserDeleteOutlined } from '@ant-design/icons';
import { Button } from 'antd';

const ResellerChildFlush = props => {
  const { dispatch, child_account } = props;

  const clearRsChild = () => {
    dispatch({
      type: 'child_account/flush',
    });
    dispatch({
      type: 'child_brief_users/flush',
    });
    dispatch({
      type: 'child_numbers/flush',
    });
  };

  if (!child_account.data) {
    return null;
  }

  return (
    <Button key="ResellerChildFlushKey" type="link" onClick={clearRsChild}>
      <UserDeleteOutlined />
    </Button>
  );
};

export default connect(({ child_account }) => ({ child_account }))(ResellerChildFlush);
