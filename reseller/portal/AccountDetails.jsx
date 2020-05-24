import React, { useEffect, Fragment } from 'react';
import { formatMessage, connect } from 'umi';
import * as _ from 'lodash';
import funReactJson from '@/pages/onnet-portal/core/components/info_details';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Table, Button, Card, Switch, Typography } from 'antd';

import RsChildAccountParagraph from './components/RsChildAccountParagraph';
import styles from './style.less';
import { resellerStatus } from '@/pages/onnet-portal/core/services/kazoo';
import { runAndDispatch } from '@/pages/onnet-portal/core/utils/subroutine';
import { cardProps } from '@/pages/onnet-portal/core/utils/props';

const { Text } = Typography;

const AccountDetails = props => {
  const { dispatch, kz_account, child_account } = props;

  useEffect(() => {
    if (kz_account.data) {
      dispatch({
        type: 'kz_children/refresh',
        payload: { account_id: kz_account.data.id },
      });
    }
  }, [kz_account]);

  function switchResellerStatus(checked) {
    if (checked) {
      console.log(`${child_account.data.id} to on switchResellerStatus to ${checked}`);
      runAndDispatch(resellerStatus, 'child_account/update', {
        method: 'PUT',
        account_id: child_account.data.id,
        data: {},
      });
    } else {
      console.log(`${child_account.data.id} to off switchResellerStatus to ${checked}`);
      runAndDispatch(resellerStatus, 'child_account/update', {
        method: 'DELETE',
        account_id: child_account.data.id,
      });
    }
  }

  const tableData = [
    {
      key: '1',
      name: 'Account Name',
      value: <RsChildAccountParagraph fieldKey="name" style={{ marginBottom: '0' }} />,
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
          checked={_.get(child_account, 'data.is_reseller', false)}
          onChange={switchResellerStatus}
        />
      ),
    },
    {
      key: '3',
      name: 'Account status',
      value: child_account.data ? (
        child_account.data.enabled ? (
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
            <Button type="link" onClick={() => funReactJson(_.omit(child_account, 'auth_token'))}>
              <InfoCircleOutlined />
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

export default connect(({ kz_login, kz_account, kz_children, child_account }) => ({
  kz_login,
  kz_account,
  kz_children,
  child_account,
}))(AccountDetails);
