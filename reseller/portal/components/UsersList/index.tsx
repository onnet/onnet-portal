import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'dva';
import { DeleteOutlined, EditOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useMediaQuery } from 'react-responsive';
import { Drawer, Table, Card, Modal, Switch } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from '@/pages/onnet-portal/core/style.less';
import { cardProps } from '@/pages/onnet-portal/core/utils/props';
import ResellerCreateUser from '@/pages/onnet-portal/reseller/portal/components/ResellerCreateUser';
import ResellerChildEditUser from '@/pages/onnet-portal/reseller/portal/components/ResellerChildEditUser';
import RsChildUserParagraph from '@/pages/onnet-portal/reseller/portal/components/RsChildUserParagraph';
import RsChildUserPrivLevel from '@/pages/onnet-portal/reseller/portal/components/RsChildUserPrivLevel';
import info_details_fun from '@/pages/onnet-portal/core/components/info_details';
import { kzUser } from '@/pages/onnet-portal/core/services/kazoo';

const { confirm } = Modal;

const UsersList = props => {
  const { dispatch, settings, account, brief_users, full_users } = props;

  const [dataSource, setDataSource] = useState([]);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(false);
  const isSmallDevice = useMediaQuery({ maxWidth: 991 });

  useEffect(() => {
    if (brief_users.data) {
      setDataSource(brief_users.data);
    }
  }, [brief_users]);

  if (brief_users.data) {
    if (brief_users.data.length === 0) {
      return null;
    }
  } else {
    return null;
  }

  const deleteChildUser = record => {
    confirm({
      title: `Do you want to delete user ${record.username}?`,
      onOk() {
        kzUser({ method: 'DELETE', account_id: account.data.id, owner_id: record.id })
          .then(uRes => {
            console.log(uRes);
            dispatch({
              type: 'child_brief_users/refresh',
              payload: { account_id: account.data.id },
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
          checked={full_users[record.id] ? full_users[record.id].data.enabled : false}
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
              type: 'child_full_users/refresh',
              payload: { account_id: account.data.id, owner_id: record.id },
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
            info_details_fun(full_users[record.id].data);
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
          account_id: account.data.id,
          owner_id: record.id,
          data: { enabled: checked },
        })
          .then(uRes => {
            console.log(uRes);
            dispatch({
              type: 'child_full_users/refresh',
              payload: { account_id: account.data.id, owner_id: record.id },
            });
          })
          .catch(() => console.log('Oops errors!', record));
      },
      onCancel() {},
    });
  }

  return (
    <Fragment>
      <Card hoverable className={styles.card} {...cardProps}>
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
              dataSource={brief_users.data}
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
          full_users[selectedUser] ? (
            <span>
              {formatMessage({ id: 'core.Edit_user', defaultMessage: 'Edit user' })}
              <b style={{ color: settings.primaryColor }}>
                {' '}
                {full_users[selectedUser].data.username}
              </b>
            </span>
          ) : null
        }
        width={isSmallDevice ? '100%' : '50%'}
        placement="right"
        onClose={onDrawerClose}
        visible={isDrawerVisible}
      >
        <ResellerChildEditUser selectedUser={selectedUser} />
      </Drawer>
    </Fragment>
  );
};

export default connect(({ settings, child_account, child_brief_users, child_full_users }) => ({
  settings,
  account: child_account,
  brief_users: child_brief_users,
  full_users: child_full_users,
}))(UsersList);
