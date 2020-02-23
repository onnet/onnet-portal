import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'dva';
import { Table, Card, Button, Icon } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from '@/pages/onnet-portal/core/style.less';
import { cardProps } from '@/pages/onnet-portal/core/utils/props';
import ResellerCreateUser from '@/pages/onnet-portal/reseller/portal/components/ResellerCreateUser';
import info_details_fun from '@/pages/onnet-portal/core/components/info_details';

const UsersList = props => {
  const { settings, rs_child_users } = props;

  if (rs_child_users.data) {
    if (rs_child_users.data.length === 0) {
      return null;
    }
  } else {
    return null;
  }

  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    if (rs_child_users.data) {
      setDataSource(rs_child_users.data);
    }
  }, [rs_child_users]);

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
    {
      dataIndex: 'id',
      key: 'edit_user',
      align: 'center',
      render: (text, record) => (
        <Icon
          type="edit"
          style={{ color: settings.primaryColor }}
          onClick={event => {
            console.log('event', event);
            const result = dataSource.find(({ id }) => id === record.id);
            console.log('result', result);
            info_details_fun(result);
          }}
        />
      ),
    },
    {
      dataIndex: 'id',
      key: 'delete_user',
      align: 'center',
      render: (text, record) => (
        <Icon
          type="delete"
          style={{ color: settings.primaryColor }}
          onClick={event => {
            console.log('event', event);
            const result = dataSource.find(({ id }) => id === record.id);
            console.log('result', result);
            info_details_fun(result);
          }}
        />
      ),
    },
    {
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      render: (text, record) => (
        <Icon
          type="info-circle"
          style={{ color: settings.primaryColor }}
          onClick={event => {
            console.log('event', event);
            const result = dataSource.find(({ id }) => id === record.id);
            console.log('result', result);
            info_details_fun(result);
          }}
        />
      ),
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
                           id: 'reseller_portal.accounts_users',
                           defaultMessage: "Account's Users",
                         })}
                         <ResellerCreateUser btnstyle={{ float: 'right' }} />
               </Fragment>
              }
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

export default connect(({ settings, rs_child_users }) => ({
  settings,
  rs_child_users,
}))(UsersList);
