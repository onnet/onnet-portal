/* eslint-disable @typescript-eslint/camelcase */

import React, { useEffect } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { List } from 'antd';

import GeneralSettingsWidget from './GeneralSettingsWidget';

const AdminSettings = props => {
  const { dispatch, kazoo_account } = props;

  useEffect(() => {
    if (kazoo_account.data) {
      dispatch({
        type: 'kazoo_account_numbers/refresh',
        payload: { method: 'GET', account_id: kazoo_account.data.id },
      });
      dispatch({
        type: 'kazoo_account_media/refresh',
        payload: { method: 'GET', account_id: kazoo_account.data.id },
      });
      dispatch({
        type: 'kz_cf_list/refresh',
        payload: { method: 'GET', account_id: kazoo_account.data.id },
      });
    }
  }, [kazoo_account]);

  return (
    <PageHeaderWrapper>
      <List
        grid={{ gutter: 24, xxl: 2, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
        dataSource={[
          <GeneralSettingsWidget key="GeneralSettingsWidget1" />,
          <GeneralSettingsWidget key="GeneralSettingsWidget2" />,
          <GeneralSettingsWidget key="GeneralSettingsWidget3" />,
        ]}
        renderItem={item => <List.Item>{item}</List.Item>}
      />
    </PageHeaderWrapper>
  );
};

export default connect(({ kazoo_account }) => ({
  kazoo_account,
}))(AdminSettings);
