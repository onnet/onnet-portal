/* eslint-disable @typescript-eslint/camelcase */

import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import DevicesList from '@/pages/onnet-portal/core/components/DevicesList';

const TelephonyDevices = () => (
  <PageHeaderWrapper>
    <DevicesList key="DevicesListKey" />
  </PageHeaderWrapper>
);

export default TelephonyDevices;
