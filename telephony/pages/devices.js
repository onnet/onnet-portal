/* eslint-disable @typescript-eslint/camelcase */

import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import DevicesList from '@/pages/onnet-portal/core/components/DevicesList/index_short';

const TelephonyDevices = () => (
  <PageHeaderWrapper breadcrumb={false}>
    <DevicesList key="DevicesListKey" />
  </PageHeaderWrapper>
);

export default TelephonyDevices;
