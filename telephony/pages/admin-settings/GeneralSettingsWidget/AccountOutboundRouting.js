/* eslint-disable @typescript-eslint/camelcase */

import React, { useState, useEffect } from 'react';
import { connect } from 'dva';

import { formatMessage } from 'umi-plugin-react/locale';
import { DownOutlined } from '@ant-design/icons';
import { Modal, Dropdown, Menu } from 'antd';

import { isArrayEqual, runAndDispatch } from '@/pages/onnet-portal/core/utils/subroutine';
import { AccountCallflow } from '../../../services/kazoo-telephony';

const { confirm } = Modal;

const AccountOutboundRouting = props => {
  const [noMatchId, SetNoMatchId] = useState(false);
  const [currRoutingMode, SetCurrRoutingMode] = useState('');

  const { dispatch, kz_account, kz_cf_list, kz_cf_details } = props;


  useEffect(() => {
    if (kz_account.data) {
      if (kz_cf_list) {
      if (_.find(kz_cf_list.data, { 'numbers': ['no_match'] })) {
    const noMatchCF = _.find(kz_cf_list.data, { 'numbers': ['no_match'] });
console.log('noMatchCF: ', noMatchCF);
console.log('no_match: ', kz_cf_list.data.find(({ numbers }) => isArrayEqual(numbers, ['no_match'])));
        const { id } = kz_cf_list.data.find(({ numbers }) => isArrayEqual(numbers, ['no_match']));
        if (kz_cf_details[id]) {
          SetNoMatchId(id);
          if (
            (kz_cf_details[id].flow.module === 'resources' &&
              kz_cf_details[id].flow.data.hunt_account_id) ||
            kz_cf_details[id].flow.module === 'offnet'
          ) {
            SetCurrRoutingMode(
              formatMessage({ id: 'telephony.general_routing', defaultMessage: 'General routing' }),
            );
          } else if (kz_cf_details[id].flow.module === 'resources') {
            SetCurrRoutingMode(
              formatMessage({ id: 'telephony.account_defined', defaultMessage: 'Account defined' }),
            );
          }
        } else {
          dispatch({
            type: 'kz_cf_details/refresh',
            payload: { method: 'GET', account_id: kz_account.data.id, callflow_id: id },
          });
        }
      }
      }
    }
  }, [kz_account, kz_cf_list, kz_cf_details]);

  if (!kz_cf_list.data) return null;

  const menuAccountOutboundRouting = (
    <Menu selectedKeys={[]} onClick={onAccountOutboundRoutingSelect}>
      <Menu.Item key="general_routing">
        {formatMessage({ id: 'telephony.general_routing', defaultMessage: 'General routing' })}
      </Menu.Item>
      <Menu.Item key="account_defined">
        {formatMessage({ id: 'telephony.account_defined', defaultMessage: 'Account defined' })}
      </Menu.Item>
    </Menu>
  );

  function onAccountOutboundRoutingSelect(event) {
    const { key } = event;
    confirm({
      title: formatMessage({
        id: 'telephony.outbound_routing',
        defaultMessage: 'Outbound routing',
      }),
      content: (
        <span style={{ paddingLeft: '4em' }}>
          {formatMessage({ id: 'core.change_to', defaultMessage: 'Change to' })}{' '}
          <b>
            {key === 'general_routing'
              ? formatMessage({
                  id: 'telephony.general_routing',
                  defaultMessage: 'General routing',
                })
              : formatMessage({
                  id: 'telephony.account_defined',
                  defaultMessage: 'Account defined',
                })}
          </b>
          ?
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
        account_id: kz_account.data.id,
        callflow_id: noMatchId,
        //       data: { flow: { data: { }, module: 'offnet' } },
        data: {
          flow: { data: { hunt_account_id: kz_account.data.reseller_id }, module: 'resources' },
        },
      });
    } else {
      runAndDispatch(AccountCallflow, 'kz_cf_details/update', {
        method: 'PATCH',
        account_id: kz_account.data.id,
        callflow_id: noMatchId,
        data: { flow: { data: {}, module: 'resources' } },
      });
    }
  }

  return (
    <Dropdown overlay={menuAccountOutboundRouting} trigger={['click']}>
      <a className="ant-dropdown-link" href="#">
        {currRoutingMode} <DownOutlined />
      </a>
    </Dropdown>
  );
};

export default connect(({ kz_account, kz_cf_list, kz_cf_details }) => ({
  kz_account,
  kz_cf_list,
  kz_cf_details,
}))(AccountOutboundRouting);
