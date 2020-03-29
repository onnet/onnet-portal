import React from 'react';
import { connect } from 'dva';
import { Collapse } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import * as _ from 'lodash';

import RsUpdateUserPassword from '@/pages/onnet-portal/reseller/portal/components/RsUpdateUserPassword';
import ResellerUserCID from '@/pages/onnet-portal/reseller/portal/components/ResellerUserCID';
import ResellerUserDiversion from '@/pages/onnet-portal/reseller/portal/components/ResellerUserDiversion';
import ResellerUserMedia from '@/pages/onnet-portal/reseller/portal/components/ResellerUserMedia';
import ResellerUserRestrictions from '@/pages/onnet-portal/reseller/portal/components/ResellerUserRestrictions';

const { Panel } = Collapse;

const ResellerChildEditUser = props => {
  const { selectedUser, child_full_users, child_numbers } = props;

  if (!selectedUser) return null;
  if (!child_full_users[selectedUser]) return null;

  return (
    <Collapse accordion defaultActiveKey="2">
      {_.get(child_numbers, 'data.numbers', []).length > 0 ? (
        <Panel
          header={formatMessage({ id: 'core.Telephony', defaultMessage: 'Telephony' })}
          key="1"
        >
          <Collapse accordion>
            <Panel header={formatMessage({ id: 'core.CID', defaultMessage: 'CID' })} key="11">
              <ResellerUserCID owner_id={selectedUser} />
            </Panel>
            <Panel
              header={formatMessage({ id: 'core.Diversion', defaultMessage: 'Diversion' })}
              key="12"
            >
              <ResellerUserDiversion owner_id={selectedUser} />
            </Panel>
            <Panel header={formatMessage({ id: 'core.Media', defaultMessage: 'Media' })} key="13">
              <ResellerUserMedia owner_id={selectedUser} />
            </Panel>
            <Panel
              header={formatMessage({ id: 'core.Restrictions', defaultMessage: 'Restrictions' })}
              key="14"
            >
              <ResellerUserRestrictions owner_id={selectedUser} />
            </Panel>
          </Collapse>
        </Panel>
      ) : null}
      <Panel
        header={formatMessage({ id: 'core.Change_password', defaultMessage: 'Change password' })}
        key="2"
      >
        <RsUpdateUserPassword owner_id={selectedUser} />
      </Panel>
    </Collapse>
  );
};

export default connect(({ child_full_users, child_numbers }) => ({
  child_full_users,
  child_numbers,
}))(ResellerChildEditUser);
