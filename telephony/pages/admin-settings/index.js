/* eslint-disable @typescript-eslint/camelcase */

import React, { useEffect } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { List } from 'antd';

import GeneralSettingsWidget from './GeneralSettingsWidget';
import UsersList from '@/pages/onnet-portal/core/components/UsersList';

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
      <List
        grid={{ gutter: 24, xxl: 2, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
        dataSource={[
	  <GeneralSettingsWidget key="GeneralSettingsWidgetKey" />,
          <UsersList key="UsersListKey" />,
        ]}
        renderItem={item => <List.Item>{item}</List.Item>}
      />
    </PageHeaderWrapper>
  );
};

export default connect(({ kz_account }) => ({
  kz_account,
}))(AdminSettings);
