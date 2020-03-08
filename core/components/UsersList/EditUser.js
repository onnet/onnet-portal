import React from 'react';
import { connect } from 'dva';
import { Collapse } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import UserPassword from './UserPassword';
import UserCID from './UserCID';
import UserDiversion from './UserDiversion';
import UserMedia from './UserMedia';
import UserRestrictions from './UserRestrictions';

const { Panel } = Collapse;

const EditUser = props => {
  const { selectedUser, full_users } = props;

  if (!selectedUser) return null;
  if (!full_users[selectedUser]) return null;

  return (
    <Collapse accordion defaultActiveKey="1">
      <Panel header={formatMessage({ id: 'core.Telephony', defaultMessage: 'Telephony' })} key="1">
        <Collapse accordion>
          <Panel header={formatMessage({ id: 'core.CID', defaultMessage: 'CID' })} key="21">
            <UserCID owner_id={selectedUser} />
          </Panel>
          <Panel
            header={formatMessage({ id: 'core.Diversion', defaultMessage: 'Diversion' })}
            key="22"
          >
            <UserDiversion owner_id={selectedUser} />
          </Panel>
          <Panel header={formatMessage({ id: 'core.Media', defaultMessage: 'Media' })} key="23">
            <UserMedia owner_id={selectedUser} />
          </Panel>
          <Panel header={formatMessage({ id: 'core.Devices', defaultMessage: 'Devices' })} key="24">
            <p>`Hello21! ${full_users[selectedUser].data.username}`</p>
          </Panel>
          <Panel
            header={formatMessage({ id: 'core.Restrictions', defaultMessage: 'Restrictions' })}
            key="25"
          >
            <UserRestrictions owner_id={selectedUser} />
          </Panel>
        </Collapse>
      </Panel>
      <Panel
        header={formatMessage({ id: 'core.Change_password', defaultMessage: 'Change password' })}
        key="2"
      >
        <UserPassword owner_id={selectedUser} />
      </Panel>
    </Collapse>
  );
};

export default connect(({ kz_full_users }) => ({
  full_users: kz_full_users,
}))(EditUser);
