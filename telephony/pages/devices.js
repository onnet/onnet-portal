import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import DevicesListShort from '@/pages/onnet-portal/core/components/DevicesList/index_short';
import DevicesList from '@/pages/onnet-portal/core/components/DevicesList/index';

const TelephonyDevices = () => (
  <PageHeaderWrapper breadcrumb={false}>
    <DevicesListShort key="DevicesShortListKey" />
    <DevicesList key="DevicesListKey" />
  </PageHeaderWrapper>
);

export default TelephonyDevices;
