import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import {
  AccountCallflows,
  AccountCallflow,
} from '@/pages/onnet-portal/telephony/services/kazoo-telephony';

import { PageHeaderWrapper } from '@ant-design/pro-layout';

const CallflowBuilder = (props) => {
  const { kz_account } = props;

  const [, setDataCallFlows] = useState([]);
  const [, setSelectedCF] = useState({});

  useEffect(() => {
    if (kz_account.data) {
      setDataCallFlows([]);
      AccountCallflows({
        account_id: kz_account.data?.id,
        method: 'GET',
      })
        .then((resp) => {
          console.log('AccountCallflows resp: ', resp);
          setDataCallFlows(resp.data);
        })
        .catch(() => console.log('Oops errors!'));
      setSelectedCF({});
      AccountCallflow({
        account_id: kz_account.data?.id,
        callflow_id: 'ddd984204793f7d13acc877f4500748d',
        method: 'GET',
      })
        .then((resp) => {
          console.log('AccountCallflow resp: ', resp);
          setSelectedCF(resp.data);
 //         drawTree(resp.data);
        })
        .catch(() => console.log('Oops errors!'));
    }
  }, [kz_account]);

  return (
    <PageHeaderWrapper breadcrumb={false}>
      <div id="treeWrapper"></div>
    </PageHeaderWrapper>
  );
};

export default connect(({ kz_account }) => ({
  kz_account,
}))(CallflowBuilder);
