import React from 'react';
import { connect } from 'dva';
import { Collapse } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import RsUpdateUserPassword from '@/pages/onnet-portal/reseller/portal/components/RsUpdateUserPassword';
import ResellerUserCID from '@/pages/onnet-portal/reseller/portal/components/ResellerUserCID';
import ResellerUserDiversion from '@/pages/onnet-portal/reseller/portal/components/ResellerUserDiversion';
import ResellerUserMedia from '@/pages/onnet-portal/reseller/portal/components/ResellerUserMedia';
import ResellerUserRestrictions from '@/pages/onnet-portal/reseller/portal/components/ResellerUserRestrictions';

const { Panel } = Collapse;

const ResellerChildEditUser = props => {
  const { selectedUser, child_full_users } = props;

  if (!selectedUser) return null;
  if (!child_full_users[selectedUser]) return null;

  return (
    <Collapse accordion defaultActiveKey="1">
      <Panel header={formatMessage({ id: 'core.Telephony', defaultMessage: 'Telephony' })} key="1">
        <Collapse accordion>
          <Panel header={formatMessage({ id: 'core.CID', defaultMessage: 'CID' })} key="21">
            <ResellerUserCID owner_id={selectedUser} />
          </Panel>
          <Panel
            header={formatMessage({ id: 'core.Diversion', defaultMessage: 'Diversion' })}
            key="22"
          >
            <ResellerUserDiversion owner_id={selectedUser} />
          </Panel>
          <Panel header={formatMessage({ id: 'core.Media', defaultMessage: 'Media' })} key="23">
            <ResellerUserMedia owner_id={selectedUser} />
          </Panel>
          <Panel header={formatMessage({ id: 'core.Devices', defaultMessage: 'Devices' })} key="24">
            <p>`Hello21! ${child_full_users[selectedUser].data.username}`</p>
          </Panel>
          <Panel
            header={formatMessage({ id: 'core.Restrictions', defaultMessage: 'Restrictions' })}
            key="25"
          >
            <ResellerUserRestrictions owner_id={selectedUser} />
          </Panel>
        </Collapse>
      </Panel>
      <Panel
        header={formatMessage({ id: 'core.Change_password', defaultMessage: 'Change password' })}
        key="2"
      >
        <RsUpdateUserPassword owner_id={selectedUser} />
      </Panel>
    </Collapse>
  );
};

export default connect(({ child_full_users }) => ({
  child_full_users,
}))(ResellerChildEditUser);
