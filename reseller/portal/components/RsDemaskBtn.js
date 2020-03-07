import React from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Button } from 'antd';

const RsDemaskBtn = props => {
  const { dispatch } = props;

  return (
    <Button
      type="primary"
      onClick={() => {
        console.log('dispatchDemask onClick');
        dispatch({ type: 'mask_history/demask' });
        router.push('/int/reseller_portal/accounts');
      }}
    >
      Demask
    </Button>
  );
};

export default connect()(RsDemaskBtn);
