/* eslint-disable @typescript-eslint/camelcase */

import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import * as _ from 'lodash';
import { Table } from 'antd';
import DeviceRestrictionLevel from './DeviceRestrictionLevel';

const DeviceRestrictions = props => {
  const [tableData, setTableData] = useState([]);

  const { dispatch, account, full_devices, kz_numbers_classifiers, device_id } = props;

  useEffect(() => {
    if (!kz_numbers_classifiers.data) {
      dispatch({
        type: 'kz_numbers_classifiers/refresh',
        payload: { account_id: account.data.id },
      });
    } else if (full_devices[device_id]) {
      const jobj = _.get(full_devices[device_id].data, 'call_restriction', {});
      const TabDat = Object.keys(kz_numbers_classifiers.data).map(key => ({
        key,
        action: jobj[key] ? jobj[key].action : null,
      }));
      console.log('TabDat: ', TabDat);
      setTableData(TabDat);
    }
  }, [full_devices[device_id], kz_numbers_classifiers]);

  if (!full_devices[device_id]) return null;
  if (!kz_numbers_classifiers.data) return null;

  const columns = [
    {
      title: 'Name',
      dataIndex: 'key',
      key: 'key',
      width: '50%',
      align: 'right',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (text, record) => (
        <DeviceRestrictionLevel
          device_id={device_id}
          classifier={record.key}
          text={text}
          style={{ marginBottom: '0' }}
        />
      ),
    },
  ];

  return (
    <Table
      dataSource={tableData}
      columns={columns}
      pagination={false}
      showHeader={false}
      size="small"
    />
  );
};

export default connect(({ kz_numbers_classifiers, kz_account, kz_full_devices }) => ({
  kz_numbers_classifiers,
  account: kz_account,
  full_devices: kz_full_devices,
}))(DeviceRestrictions);
