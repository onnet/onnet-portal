import React from 'react';
import { connect } from 'dva';
import { Collapse } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import RsUpdateUserPassword from '@/pages/onnet-portal/reseller/portal/components/RsUpdateUserPassword';
import ResellerUserCID from '@/pages/onnet-portal/reseller/portal/components/ResellerUserCID';

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
      <Panel header={formatMessage({ id: 'core.Telephony', defaultMessage: 'Telephony' })} key="2">
        <Collapse accordion defaultActiveKey="21">
          <Panel header={formatMessage({ id: 'core.CID', defaultMessage: 'CID' })} key="21">
            <ResellerUserCID owner_id={selectedUser} />
          </Panel>
          <Panel
            header={formatMessage({ id: 'core.Diversion', defaultMessage: 'Diversion' })}
            key="22"
          >
            <p>`Hello21! ${rs_child_user[selectedUser].data.username}`</p>
          </Panel>
          <Panel header={formatMessage({ id: 'core.Media', defaultMessage: 'Media' })} key="23">
            <p>`Hello21! ${rs_child_user[selectedUser].data.username}`</p>
          </Panel>
          <Panel header={formatMessage({ id: 'core.Devices', defaultMessage: 'Devices' })} key="24">
            <p>`Hello21! ${rs_child_user[selectedUser].data.username}`</p>
          </Panel>
          <Panel
            header={formatMessage({ id: 'core.Restrictions', defaultMessage: 'Restrictions' })}
            key="25"
          >
            <p>`Hello21! ${rs_child_user[selectedUser].data.username}`</p>
          </Panel>
        </Collapse>
      </Panel>
      <Panel
        header={formatMessage({ id: 'core.Change_password', defaultMessage: 'Change password' })}
        key="3"
      >
        <p>`Hello! ${rs_child_user[selectedUser].data.last_name}`</p>
      </Panel>
    </Collapse>
  );
};

export default connect(({ rs_child_user }) => ({
  rs_child_user,
}))(ResellerChildEditUser);
