import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import UsersList from '@/pages/onnet-portal/core/components/UsersList';

const TelephonyUsers = () => (
  <PageHeaderWrapper breadcrumb={false}>
    <UsersList key="UsersListKey" />
  </PageHeaderWrapper>
);

export default TelephonyUsers;
