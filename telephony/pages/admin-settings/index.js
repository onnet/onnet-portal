/* eslint-disable @typescript-eslint/camelcase */

import React, { useEffect } from 'react';
import { connect, useIntl } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import Masonry from 'react-masonry-css';
import { masonryBreakpointCols } from '@/pages/onnet-portal/core/utils/props';
import GeneralSettingsWidget from './GeneralSettingsWidget';

const AdminSettings = (props) => {
  const { dispatch, kz_account, child_account } = props;

  const { formatMessage } = useIntl();

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
    <PageHeaderWrapper
      title={
        child_account.data
          ? child_account?.data?.name
          : formatMessage({ id: 'telephony.Statistics', defaultMessage: 'Statistics' })
      }
    >
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

export default connect(({ kz_account, child_account }) => ({
  kz_account,
  child_account,
}))(AdminSettings);
