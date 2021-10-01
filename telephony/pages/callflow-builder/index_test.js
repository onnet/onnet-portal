import React, { useState, useEffect, Fragment } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { connect } from 'umi';
import { Tag } from 'antd';
import {
  AccountCallflows,
  AccountCallflow,
} from '@/pages/onnet-portal/telephony/services/kazoo-telephony';

import { PageHeaderWrapper } from '@ant-design/pro-layout';

const CallflowBuilder = (props) => {
  const { kz_account } = props;

  const [dataCallFlows, setDataCallFlows] = useState([]);
  const [selectedCF, setSelectedCF] = useState({});

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
          drawTree(resp.data);
        })
        .catch(() => console.log('Oops errors!'));
    }
  }, [kz_account]);

  const tree = {
    name: 'rootNode',
    children: [
      {
        name: 'child1',
      },
      {
        name: 'child2',
        children: [
          {
            name: 'grandchild1',
            children: [{ name: 'grand granchild1' }, { name: 'grand granchild2' }],
          },
        ],
      },
      {
        name: 'child3',
        children: [
          { name: 'grandchild2' },
          { name: 'grandchild3' },
          { name: 'grandchild4' },
          { name: 'grandchild5' },
        ],
      },
    ],
  };

  return (
    <PageHeaderWrapper breadcrumb={false}>
      <div id="treeWrapper"></div>
    </PageHeaderWrapper>
  );
};

export default connect(({ kz_account }) => ({
  kz_account,
}))(CallflowBuilder);
