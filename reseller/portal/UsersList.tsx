import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Table, Card, Button } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from '@/pages/onnet-portal/core/style.less';
import { cardProps } from '@/pages/onnet-portal/core/utils/props';

const UsersList = props => {
  const { rs_child_users } = props;

  if (rs_child_users.data) {
    if (rs_child_users.data.length === 0) {
      return null;
    }
  } else {
    return null;
  }

  const columns = [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      width: '65%',
    },
    {
      title: 'First name',
      dataIndex: 'first_name',
      key: 'first_name',
      align: 'center',
    },
    {
      title: 'Last Name',
      dataIndex: 'last_name',
      key: 'last_name',
      align: 'center',
    },
  ];

  return (
    <Card className={styles.card} {...cardProps}>
      <Card.Meta
        avatar={
          <img
            alt=""
            className={styles.cardAvatar}
            src="https://api.adorable.io/avatars/24/CardMonthlyFees.png"
          />
        }
        title={<Fragment>{formatMessage({
          id: 'reseller_portal.account_users_list',
          defaultMessage: 'Account users list',
        })}<Button size="small" type="primary" style={{ float: 'right' }}>create new user</Button></Fragment>}
        description={
          <Table
            dataSource={rs_child_users.data}
            columns={columns}
            pagination={false}
            size="small"
            rowKey={record => record.id}
          />
        }
      />
    </Card>
  );
};

export default connect(({ rs_child_users }) => ({
  rs_child_users,
}))(UsersList);
