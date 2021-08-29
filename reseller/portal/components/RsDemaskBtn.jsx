import React from 'react';
import { connect, history } from 'umi';
import { Button } from 'antd';

const RsDemaskBtn = (props) => {
  const { dispatch } = props;

  return (
    <Button
      type="primary"
      onClick={() => {
        console.log('dispatchDemask onClick');
        dispatch({ type: 'mask_history/demask' });
        history.push('/int/accounts/account');
      }}
    >
      Demask
    </Button>
  );
};

export default connect()(RsDemaskBtn);
