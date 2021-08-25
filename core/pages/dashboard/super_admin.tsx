/* eslint-disable func-names */

import React from 'react';
import { connect, Redirect, history } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SuperAdminPie from './super_admin_pie';

const SuperDuperDashboard = (props) => {
  const {
    kz_system_status = {},
  } = props;

  return (
    <PageHeaderWrapper>
      {kz_system_status.data && (Object.keys(kz_system_status.data).length === 1) ? (
          <Redirect
            to={{
              pathname: '/int/zone',
              state: { zone: Object.keys(kz_system_status.data)[0] },
            }}
          />
        ) : (
        <SuperAdminPie />
      )}
    </PageHeaderWrapper>
  );
};

export default connect(({ kz_system_status, }) => ({
  kz_system_status,
}))(SuperDuperDashboard);
