/* eslint-disable @typescript-eslint/camelcase */

import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import * as _ from 'lodash';
import { Table } from 'antd';
import RsChildUserRestrictionLevel from './RsChildUserRestrictionLevel';

const ResellerUserRestrictions = (props) => {
  const [tableData, setTableData] = useState([]);

  const { dispatch, child_account, child_full_users, kz_numbers_classifiers, owner_id } = props;

  useEffect(() => {
    if (!kz_numbers_classifiers.data) {
      dispatch({
        type: 'kz_numbers_classifiers/refresh',
        payload: { account_id: child_account.data.id },
      });
    } else if (child_full_users[owner_id]) {
      const jobj = _.get(child_full_users[owner_id].data, 'call_restriction', {});
      const TabDat = Object.keys(kz_numbers_classifiers.data).map((key) => ({
        key,
        action: jobj[key] ? jobj[key].action : null,
      }));
      console.log('TabDat: ', TabDat);
      setTableData(TabDat);
    }
  }, [child_full_users[owner_id], kz_numbers_classifiers]);

  if (!child_full_users[owner_id]) return null;
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
        <RsChildUserRestrictionLevel
          owner_id={owner_id}
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

export default connect(({ kz_numbers_classifiers, child_account, child_full_users }) => ({
  kz_numbers_classifiers,
  child_account,
  child_full_users,
}))(ResellerUserRestrictions);
