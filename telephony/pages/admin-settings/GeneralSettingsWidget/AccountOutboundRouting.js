/* eslint-disable @typescript-eslint/camelcase */

import React, { useState, useEffect } from 'react';
import { connect } from 'dva';

import { formatMessage } from 'umi-plugin-react/locale';
import { Icon, Modal, Dropdown, Menu } from 'antd';

import { isArrayEqual, runAndDispatch } from '@/pages/onnet-portal/core/utils/subroutine';
import { AccountCallflow } from '../../../services/kazoo-telephony';

const { confirm } = Modal;

const AccountOutboundRouting = props => {
  const [noMatchId, SetNoMatchId] = useState(false);
  const [currRoutingMode, SetCurrRoutingMode] = useState('');

  const { dispatch, kazoo_account, kz_cf_list, kz_cf_details } = props;

  useEffect(() => {
    if (kazoo_account.data) {
      if (kz_cf_list.data) {
        const { id } = kz_cf_list.data.find(({ numbers }) => isArrayEqual(numbers, ['no_match']));
        if (kz_cf_details[id]) {
          SetNoMatchId(id);
          if (
            (kz_cf_details[id].flow.module === 'resources' &&
              kz_cf_details[id].flow.data.hunt_account_id) ||
            kz_cf_details[id].flow.module === 'offnet'
          ) {
            SetCurrRoutingMode('General routing');
          } else if (kz_cf_details[id].flow.module === 'resources') {
            SetCurrRoutingMode('Account defined');
          }
        } else {
          dispatch({
            type: 'kz_cf_details/refresh',
            payload: { method: 'GET', account_id: kazoo_account.data.id, callflow_id: id },
          });
        }
      }
    }
  }, [kazoo_account, kz_cf_list, kz_cf_details]);

  const menuAccountOutboundRouting = (
    <Menu selectedKeys={[]} onClick={onAccountOutboundRoutingSelect}>
      <Menu.Item key="general_routing">General routing</Menu.Item>
      <Menu.Item key="account_defined">Account defined</Menu.Item>
    </Menu>
  );

  function onAccountOutboundRoutingSelect(event) {
    const { key } = event;
    confirm({
      title: 'Outbound routing',
      content: (
        <span style={{ paddingLeft: '4em' }}>
          Change to <b>{key === 'general_routing' ? 'General routing' : 'Account defined'}</b>?
        </span>
      ),
      onOk() {
        setOutboundRouting(key);
      },
      onCancel() {},
    });
  }

  function setOutboundRouting(routingType) {
    if (routingType === 'general_routing') {
      runAndDispatch(AccountCallflow, 'kz_cf_details/update', {
        method: 'PATCH',
        account_id: kazoo_account.data.id,
        callflow_id: noMatchId,
        //       data: { flow: { data: { }, module: 'offnet' } },
        data: {
          flow: { data: { hunt_account_id: kazoo_account.data.reseller_id }, module: 'resources' },
        },
      });
    } else {
      runAndDispatch(AccountCallflow, 'kz_cf_details/update', {
        method: 'PATCH',
        account_id: kazoo_account.data.id,
        callflow_id: noMatchId,
        data: { flow: { data: {}, module: 'resources' } },
      });
    }
  }

  return (
    <Dropdown overlay={menuAccountOutboundRouting} trigger={['click']}>
      <a className="ant-dropdown-link" href="#">
        {currRoutingMode} <Icon type="down" />
      </a>
    </Dropdown>
  );
};

export default connect(({ kazoo_account, kz_cf_list, kz_cf_details }) => ({
  kazoo_account,
  kz_cf_list,
  kz_cf_details,
}))(AccountOutboundRouting);
