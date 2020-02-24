import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import { Button, Icon, Table, Collapse } from 'antd';
import info_details_fun from '@/pages/onnet-portal/core/components/info_details';

const { Panel } = Collapse;

const ResellerChildEditUser = props => {
  const { selectedUser, rs_child_user } = props;

  if (!selectedUser) return null;
  if (!rs_child_user[selectedUser]) return null;

  useEffect(() => {}, []);

  return (
    <Collapse accordion defaultActiveKey="1">
      <Panel header="This is panel header 1" key="1">
        <p>`Hello! ${rs_child_user[selectedUser].data.username}`</p>
      </Panel>
      <Panel header="This is panel header 2" key="2">
        <p>`Hello! ${rs_child_user[selectedUser].data.first_name}`</p>
      </Panel>
      <Panel header="This is panel header 3" key="3">
        <p>`Hello! ${rs_child_user[selectedUser].data.last_name}`</p>
      </Panel>
    </Collapse>
  );
};

export default connect(({ rs_child_user }) => ({
  rs_child_user,
}))(ResellerChildEditUser);
