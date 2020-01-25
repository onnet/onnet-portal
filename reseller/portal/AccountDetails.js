import React, { useEffect, Fragment } from 'react';
import { connect } from 'dva';
import * as _ from 'loadsh';
import { formatMessage } from 'umi-plugin-react/locale';
import funReactJson from '@/pages/onnet-portal/core/components/info_details';
import { Table, Button, Icon, Card, Switch, Typography } from 'antd';

import RsChildAccountParagraph from './components/RsChildAccountParagraph';
import styles from './style.less';
import { resellerStatus } from '@/pages/onnet-portal/core/services/kazoo';
import { runAndDispatch } from '@/pages/onnet-portal/core/utils/subroutine';
import { cardProps } from '@/pages/onnet-portal/core/utils/props';

const { Text } = Typography;

const AccountDetails = props => {
  const { dispatch, kazoo_account, rs_child_account } = props;

  useEffect(() => {
    if (kazoo_account.data) {
      dispatch({
        type: 'rs_children/refresh',
        payload: { account_id: kazoo_account.data.id },
      });
    }
  }, [kazoo_account]);

  function switchResellerStatus(checked) {
    if (checked) {
      console.log(`${rs_child_account.data.id} to on switchResellerStatus to ${checked}`);
      runAndDispatch(resellerStatus, 'rs_child_account/update', {
        method: 'PUT',
        account_id: rs_child_account.data.id,
        data: {},
      });
    } else {
      console.log(`${rs_child_account.data.id} to off switchResellerStatus to ${checked}`);
      runAndDispatch(resellerStatus, 'rs_child_account/update', {
        method: 'DELETE',
        account_id: rs_child_account.data.id,
      });
    }
  }

  const tableData = [
    {
      key: '1',
      name: 'Account Name',
      value: <RsChildAccountParagraph fieldKey="name" />,
    },
    {
      key: '2',
      name: formatMessage({
        id: 'reseller_portal.reseller_status',
        defaultMessage: 'Reseller status',
      }),
      value: (
        <Switch
          size="small"
          checked={rs_child_account.data ? rs_child_account.data.is_reseller : false}
          onChange={switchResellerStatus}
        />
      ),
    },
    {
      key: '3',
      name: 'Account status',
      value: rs_child_account.data ? (
        rs_child_account.data.enabled ? (
          <Text type="primary">Active</Text>
        ) : (
          <Text type="danger">Blocked</Text>
        )
      ) : null,
    },
  ];

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: '50%',
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      //    align: 'center',
    },
  ];

  return (
    <Card hoverable className={styles.card} {...cardProps}>
      <Card.Meta
        title={
          <Fragment>
            {formatMessage({
              id: 'reseller_portal.account_details',
              defaultMessage: 'Account details',
            })}
            <Button
              type="link"
              onClick={() => funReactJson(_.omit(rs_child_account, 'auth_token'))}
            >
              <Icon type="info-circle" />
            </Button>
          </Fragment>
        }
        description={
          <Table
            dataSource={tableData}
            columns={columns}
            pagination={false}
            showHeader={false}
            size="small"
          />
        }
      />
    </Card>
  );
};

export default connect(({ kazoo_login, kazoo_account, rs_children, rs_child_account }) => ({
  kazoo_login,
  kazoo_account,
  rs_children,
  rs_child_account,
}))(AccountDetails);
