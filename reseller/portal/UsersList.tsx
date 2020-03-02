import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'dva';
import { DeleteOutlined, EditOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Drawer, Table, Card, Modal, Switch } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from '@/pages/onnet-portal/core/style.less';
import { cardProps } from '@/pages/onnet-portal/core/utils/props';
import ResellerCreateUser from '@/pages/onnet-portal/reseller/portal/components/ResellerCreateUser';
import ResellerChildEditUser from '@/pages/onnet-portal/reseller/portal/components/ResellerChildEditUser';
import RsChildUserParagraph from './components/RsChildUserParagraph';
import RsChildUserPrivLevel from './components/RsChildUserPrivLevel';
import info_details_fun from '@/pages/onnet-portal/core/components/info_details';
import { kzUser } from '@/pages/onnet-portal/core/services/kazoo';

const { confirm } = Modal;

const UsersList = props => {
  const { dispatch, settings, rs_child_account, rs_child_users, rs_child_user } = props;

  const [dataSource, setDataSource] = useState([]);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(false);

  useEffect(() => {
    if (rs_child_users.data) {
      setDataSource(rs_child_users.data);
    }
  }, [rs_child_users]);

  if (rs_child_users.data) {
    if (rs_child_users.data.length === 0) {
      return null;
    }
  } else {
    return null;
  }

  const deleteChildUser = record => {
    confirm({
      title: `Do you want to delete user ${record.username}?`,
      onOk() {
        kzUser({ method: 'DELETE', account_id: rs_child_account.data.id, owner_id: record.id })
          .then(uRes => {
            console.log(uRes);
            dispatch({
              type: 'rs_child_users/refresh',
              payload: { account_id: rs_child_account.data.id },
            });
          })
          .catch(() => console.log('Oops errors!', record));
      },
      onCancel() {},
    });
  };

  const columns = [
    {
      dataIndex: 'id',
      key: 'isUserEnabled',
      align: 'center',
      render: (text, record) => (
        <Switch
          size="small"
          checked={rs_child_user[record.id] ? rs_child_user[record.id].data.enabled : false}
          onChange={checked => onUserEnableSwitch(checked, record)}
        />
      ),
    },
    {
      title: formatMessage({ id: 'core.Username', defaultMessage: 'Username' }),
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: formatMessage({ id: 'core.First_name', defaultMessage: 'First name' }),
      dataIndex: 'first_name',
      key: 'first_name',
      align: 'center',
      render: (text, record) => (
        <RsChildUserParagraph
          fieldKey="first_name"
          owner_id={record.id}
          style={{ marginBottom: '0' }}
        />
      ),
    },
    {
      title: formatMessage({ id: 'core.Last_name', defaultMessage: 'Last Name' }),
      dataIndex: 'last_name',
      key: 'last_name',
      align: 'center',
      render: (text, record) => (
        <RsChildUserParagraph
          fieldKey="last_name"
          owner_id={record.id}
          style={{ marginBottom: '0' }}
        />
      ),
    },
    {
      title: formatMessage({ id: 'core.Privilege', defaultMessage: 'Privilege' }),
      dataIndex: 'priv_level',
      key: 'priv_level',
      align: 'center',
      render: (text, record) => (
        <RsChildUserPrivLevel owner_id={record.id} style={{ marginBottom: '0' }} />
      ),
    },
    {
      dataIndex: 'id',
      key: 'edit_user',
      align: 'center',
      render: (text, record) => (
        <EditOutlined
          style={{ color: settings.primaryColor }}
          onClick={() => {
            setSelectedUser(record.id);
            dispatch({
              type: 'rs_child_user/refresh',
              payload: { account_id: rs_child_account.data.id, owner_id: record.id },
            });
            setIsDrawerVisible(true);
          }}
        />
      ),
    },
    {
      dataIndex: 'id',
      key: 'delete_user',
      align: 'center',
      render: (text, record) => (
        <DeleteOutlined
          style={{ color: settings.primaryColor }}
          onClick={() => deleteChildUser(record)}
        />
      ),
    },
    {
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      render: (text, record) => (
        <InfoCircleOutlined
          style={{ color: settings.primaryColor }}
          onClick={event => {
            console.log('event', event);
            const result = dataSource.find(({ id }) => id === record.id);
            console.log('result', result);
            info_details_fun(rs_child_user[record.id].data);
          }}
        />
      ),
    },
  ];

  const onDrawerClose = () => {
    setIsDrawerVisible(false);
  };

  function onUserEnableSwitch(checked, record) {
    confirm({
      title: (
        <p>
          {formatMessage({ id: 'core.User', defaultMessage: 'User' })}: {record.username}
        </p>
      ),
      content: (
        <span style={{ paddingLeft: '6em' }}>
          {checked
            ? formatMessage({ id: 'core.switch_on', defaultMessage: 'Switch ON' })
            : formatMessage({ id: 'core.switch_off', defaultMessage: 'Switch OFF' })}
        </span>
      ),
      onOk() {
        kzUser({
          method: 'PATCH',
          account_id: rs_child_account.data.id,
          owner_id: record.id,
          data: { enabled: checked },
        })
          .then(uRes => {
            console.log(uRes);
            dispatch({
              type: 'rs_child_user/refresh',
              payload: { account_id: rs_child_account.data.id, owner_id: record.id },
            });
          })
          .catch(() => console.log('Oops errors!', record));
      },
      onCancel() {},
    });
  }

  return (
    <Fragment>
      <Card className={styles.card} {...cardProps}>
        <Card.Meta
          title={
            <Fragment>
              {formatMessage({
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
      <Drawer
        title={
          rs_child_user[selectedUser] ? (
            <span>
              {formatMessage({ id: 'core.Edit_user', defaultMessage: 'Edit user' })}
              <b style={{ color: settings.primaryColor }}>
                {' '}
                {rs_child_user[selectedUser].data.username}
              </b>
            </span>
          ) : null
        }
        width="50%"
        placement="right"
        onClose={onDrawerClose}
        visible={isDrawerVisible}
      >
        <ResellerChildEditUser selectedUser={selectedUser} />
      </Drawer>
    </Fragment>
  );
};

export default connect(({ settings, rs_child_account, rs_child_users, rs_child_user }) => ({
  settings,
  rs_child_account,
  rs_child_users,
  rs_child_user,
}))(UsersList);
