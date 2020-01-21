/* eslint-disable @typescript-eslint/camelcase */

import React, { useState, useEffect } from 'react';
import { connect } from 'dva';

import { formatMessage } from 'umi-plugin-react/locale';
import { Button, Select, Icon, Modal, Dropdown, Menu } from 'antd';

import { runAndDispatch } from '@/pages/onnet-portal/core/services/kazoo';
import { isArrayEqual } from '@/pages/onnet-portal/core/utils/subroutine';
import { AccountCallflow } from '../../../services/kazoo-telephony';

const { confirm } = Modal;

const AccountOutboundRouting = props => {

  const [tzButtonVisible, setTzButtonVisible] = useState(false);
  const [routingModule, SetRoutingModule] = useState(false);
  const [huntAccountId, SetHuntAccountId] = useState(false);

  const { dispatch, kazoo_account, kz_cf_list, kz_cf_details } = props;

  useEffect(() => {
    if (kazoo_account.data) {
      if (kz_cf_list.data) {
        const CfJObj = kz_cf_list.data.find(({ numbers }) => isArrayEqual(numbers, ["no_match"]));
        if (kz_cf_details[CfJObj.id]) {
          SetRoutingModule(kz_cf_details[CfJObj.id].flow.module);
          SetHuntAccountId(kz_cf_details[CfJObj.id].flow.data.hunt_account_id);
        } else {
          dispatch({
            type: 'kz_cf_details/refresh',
            payload: { method: 'GET', account_id: kazoo_account.data.id, callflow_id: CfJObj.id },
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
	  console.log('onAccountOutboundRoutingSelect event: ', event),
	  console.log('onAccountOutboundRoutingSelect key: ', key),
    confirm({
      title: 'Outbound routing',
      content: <span style={{ paddingLeft: '4em' }}>
	         Change to <b>
	         {(key === 'general_routing') ?
	           'General routing'
	           :
	           'Account defined'}</b>
	         ?
	       </span>,
      onOk() {setOutboundRouting(key)},
      onCancel() {},
    });
  }

  function setOutboundRouting(routingType) {
    console.log('setOutboundRouting routingType: ', routingType);
  }

  return (

        <Dropdown overlay={menuAccountOutboundRouting} trigger={['click']}>
          <a className="ant-dropdown-link" href="#">
	  {
           ((routingModule == 'resources' && huntAccountId) || routingModule == 'offnet') ?
	   'General routing' : 
	   ((routingModule == 'resources' && !huntAccountId) ? 'Account defined' : 'undefined' )
          }
            <Icon type="down" />
          </a>
        </Dropdown>
  );
};

export default connect(({ kazoo_account, kz_cf_list, kz_cf_details }) => ({
  kazoo_account,
  kz_cf_list,
  kz_cf_details,
}))(AccountOutboundRouting);
