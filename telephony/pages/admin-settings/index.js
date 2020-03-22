/* eslint-disable @typescript-eslint/camelcase */

import React, { useEffect } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import Masonry from 'react-masonry-css';

import GeneralSettingsWidget from './GeneralSettingsWidget';
import { masonryBreakpointCols } from '@/pages/onnet-portal/core/utils/props';

const AdminSettings = props => {
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
    <PageHeaderWrapper>
      <Masonry
        breakpointCols={masonryBreakpointCols}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        <GeneralSettingsWidget key="GeneralSettingsWidgetKey" />
      </Masonry>
    </PageHeaderWrapper>
  );
};

export default connect(({ kz_account }) => ({
  kz_account,
}))(AdminSettings);
