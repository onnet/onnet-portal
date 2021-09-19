import React, { useEffect } from 'react';
import { connect, useIntl } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import Masonry from 'react-masonry-css';
import { masonryBreakpointCols } from '@/pages/onnet-portal/core/utils/props';
import GeneralSettingsWidget from './GeneralSettingsWidget';
import UsersList from '@/pages/onnet-portal/core/components/UsersList';
import DevicesListShort from '@/pages/onnet-portal/core/components/DevicesList/index_short';

const AdminSettings = (props) => {
  const { dispatch, kz_account } = props;

  useEffect(() => {
    if (kz_account.data) {
      dispatch({
        type: 'kz_account_numbers/refresh',
        payload: { method: 'GET', account_id: kz_account.data.id },
      });
      dispatch({
        type: 'kz_account_media/refresh',
        payload: { method: 'GET', account_id: kz_account.data.id },
      });
      dispatch({
        type: 'kz_cf_list/refresh',
        payload: { method: 'GET', account_id: kz_account.data.id },
      });
    }
  }, [kz_account]);

  return (
    <PageHeaderWrapper breadcrumb={false}>
      <Masonry
        breakpointCols={masonryBreakpointCols}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        <GeneralSettingsWidget key="GeneralSettingsWidgetKey" />
        <UsersList />
        <DevicesListShort />
      </Masonry>
    </PageHeaderWrapper>
  );
};

export default connect(({ kz_account }) => ({
  kz_account,
}))(AdminSettings);
