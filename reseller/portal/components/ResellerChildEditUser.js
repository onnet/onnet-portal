import React from 'react';
import { connect } from 'dva';
import { Collapse } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import RsUpdateUserPassword from '@/pages/onnet-portal/reseller/portal/components/RsUpdateUserPassword';

const { Panel } = Collapse;

const ResellerChildEditUser = props => {
  const { selectedUser, rs_child_user } = props;

  if (!selectedUser) return null;
  if (!rs_child_user[selectedUser]) return null;

  return (
    <Collapse accordion defaultActiveKey="1">
      <Panel
        header={formatMessage({ id: 'core.Change_password', defaultMessage: 'Change password' })}
        key="1"
      >
        <RsUpdateUserPassword owner_id={selectedUser} />
      </Panel>
      <Panel header="This is panel header 2" key="2">
        <p>`Hello! ${rs_child_user[selectedUser].data.username}`</p>
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
