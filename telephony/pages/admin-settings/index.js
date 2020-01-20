/* eslint-disable @typescript-eslint/camelcase */

import React, { useEffect } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Col, Row } from 'antd';

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
      <Row gutter={16}>
        <Col key="generalsettings" span={12}>
          <GeneralSettingsWidget />
        </Col>
        <Col key="colkey2" span={12}>
          <GeneralSettingsWidget />
        </Col>
      </Row>
    </PageHeaderWrapper>
  );
};

export default connect(({ kazoo_account }) => ({
  kazoo_account,
}))(AdminSettings);
