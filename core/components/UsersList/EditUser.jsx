import React from 'react';
import { Collapse } from 'antd';
import * as _ from 'lodash';
import { connect,formatMessage } from 'umi';
import ReactJson from 'react-json-view';
import UserPassword from './UserPassword';
import UserCID from './UserCID';
import UserDiversion from './UserDiversion';
import UserDevices from './UserDevices';
import UserMedia from './UserMedia';
import UserRestrictions from './UserRestrictions';
import { reactJsonProps } from '../../utils/props';

const { Panel } = Collapse;

const EditUser = props => {
  const { selectedUser, full_users, account_numbers, brief_devices } = props;

  if (!selectedUser) return null;
  if (!full_users[selectedUser]) return null;

  return (
    <Collapse accordion defaultActiveKey="1">
      {_.get(account_numbers, 'data.numbers', []).length > 0 ||
      _.get(brief_devices, 'data', []).length > 0 ? (
        <Panel
          header={formatMessage({ id: 'core.Telephony', defaultMessage: 'Telephony' })}
          key="1"
        >
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
            <Panel
              header={formatMessage({ id: 'core.Devices', defaultMessage: 'Devices' })}
              key="24"
            >
              <UserDevices owner_id={selectedUser} />
            </Panel>
            <Panel
              header={formatMessage({ id: 'core.Restrictions', defaultMessage: 'Restrictions' })}
              key="25"
            >
              <UserRestrictions owner_id={selectedUser} />
            </Panel>
          </Collapse>
        </Panel>
      ) : null}
      <Panel
        header={formatMessage({ id: 'core.Change_password', defaultMessage: 'Change password' })}
        key="2"
      >
        <UserPassword owner_id={selectedUser} />
      </Panel>
      <Panel header={formatMessage({ id: 'core.Details', defaultMessage: 'Details' })} key="3">
        <ReactJson src={full_users[selectedUser].data} {...reactJsonProps} />
      </Panel>
    </Collapse>
  );
};

export default connect(({ kz_full_users, kz_account_numbers, kz_brief_devices }) => ({
  full_users: kz_full_users,
  account_numbers: kz_account_numbers,
  brief_devices: kz_brief_devices,
}))(EditUser);
