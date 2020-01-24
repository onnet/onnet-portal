import React, { useEffect, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import * as _ from 'loadsh';
import { formatMessage } from 'umi-plugin-react/locale';
import funReactJson from '@/pages/onnet-portal/core/components/info_details';
import {
  Table,
  Button,
  Icon,
  Menu,
  Dropdown,
  Row,
  Modal,
  message,
  Avatar,
  Card,
  Col,
  Switch,
  Typography,
} from 'antd';

import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ResellerChildFlush from '@/pages/onnet-portal/reseller/portal/components/ResellerChildFlush';
import ResellerChildSearch from '@/pages/onnet-portal/reseller/portal/components/ResellerChildSearch';
import ResellerCreateChild from '@/pages/onnet-portal/reseller/portal/components/ResellerCreateChild';
import ResellerChildrenTable from './components/ResellerChildrenTable';
import RsChildAccountParagraph from './components/RsChildAccountParagraph';
import styles from './style.less';
import { resellerStatus, kzAccount } from '@/pages/onnet-portal/core/services/kazoo';
import { runAndDispatch } from '@/pages/onnet-portal/core/utils/subroutine';

const { Paragraph, Text } = Typography;

const { confirm } = Modal;

const ResellerPortal = props => {
  const { dispatch, kazoo_account, rs_child_account, rs_child_users } = props;

  useEffect(() => {
    if (kazoo_account.data) {
      dispatch({
        type: 'rs_children/refresh',
        payload: { account_id: kazoo_account.data.id },
      });
    }
  }, [kazoo_account]);

  const menu = (
    <Menu onClick={handleMenuClick}>
      {rs_child_account.data && rs_child_users.data
        ? [
            {
              id: 'no_user_defined',
              first_name: 'Faceless',
              last_name: '',
              username: 'User',
              priv_level: 'user',
            },
          ]
            .concat(rs_child_users.data)
            .map(u => (
              <Menu.Item
                key={u.id}
                account_id={rs_child_account.data.id}
                account_name={rs_child_account.data.name}
                user_username={u.username}
                user_id={u.id}
              >
                <Icon type="user" />
                {u.first_name} {u.last_name} ({u.username})
              </Menu.Item>
            ))
        : null}
    </Menu>
  );

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

  function handleMenuClick(e) {
    message.info(`Masking as ${e.item.props.user_username} @ ${e.item.props.account_name}.`);
    console.log('click', e.item.props);
    dispatch({
      type: 'kazoo_account/refresh',
      payload: { account_id: e.item.props.account_id },
    });
    dispatch({
      type: 'kazoo_user/refresh',
      payload: { account_id: e.item.props.account_id, owner_id: e.item.props.user_id },
    });
    dispatch({
      type: 'rs_mask_history/mask',
      payload: { account_id: e.item.props.account_id, owner_id: e.item.props.user_id },
    });
    dispatch({
      type: 'lb_account/refresh',
      payload: { account_id: e.item.props.account_id },
    });
    dispatch({
      type: 'rs_child_account/flush',
    });
    dispatch({
      type: 'rs_child_users/flush',
    });
    dispatch({
      type: 'rs_children/flush',
    });
    if (rs_child_account.data.is_reseller) {
      router.push('/int/reseller_portal/accounts');
    } else {
      router.push('/int/dashboard');
    }
  }

  function deleteChildAccount() {
    confirm({
      title: `Do you want to delete account ${rs_child_account.data.name}`,
      content: `When clicked the OK button, this dialog will be closed after 1 second ${rs_child_account.data.id}`,
      onOk() {
        kzAccount({ method: 'DELETE', account_id: rs_child_account.data.id })
          .then(delRes => {
            console.log(delRes);
            dispatch({
              type: 'rs_child_account/flush',
            });
            dispatch({
              type: 'rs_children/refresh',
              payload: { account_id: kazoo_account.data.id },
            });
            //    window.location.reload(true);
          })
          .catch(() => console.log('Oops errors!'));
      },
      onCancel() {},
    });
  }

  const tableData = [
    {
      key: '1',
      name: 'Account Name',
      value: (
        <Paragraph
          editable={{
            onChange: updatedText => {
              if (rs_child_account.data) {
                if (rs_child_account.data.name !== updatedText) {
                  runAndDispatch(kzAccount, 'rs_child_account/update', {
                    method: 'PATCH',
                    account_id: rs_child_account.data.id,
                    data: { name: updatedText },
                  });
                }
              }
            },
          }}
        >
          {rs_child_account.data ? rs_child_account.data.name : null}
        </Paragraph>
      ),
    },
    {
      key: '2',
      name: formatMessage({
        id: 'reseller_portal.reseller_status',
        defaultMessage: 'Reseller status',
      }),
      value: (
        <Switch
          checked={rs_child_account.data ? rs_child_account.data.is_reseller : false}
          onChange={switchResellerStatus}
        />
      ),
    },
    {
      key: '4',
      name: 'RsChildAccountParagraph',
      value: (
        <RsChildAccountParagraph
          fieldKey="name"
          currentText={rs_child_account.data ? rs_child_account.data.name : 'Loading...'}
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
      align: 'center',
    },
  ];

  return (
    <div>
      <PageHeaderWrapper
        key="pagewrapper"
        extra={[<ResellerChildFlush />, <ResellerChildSearch />, <ResellerCreateChild />]}
      >
        {rs_child_account.data ? (
          <>
            <div style={{ backgroundColor: 'white', display: 'flow-root', marginBottom: '2em' }}>
              <Button
                key="test1122"
                type="link"
                style={{ float: 'left', margin: '1em', display: 'flex' }}
              >
                <Avatar
                  src={
                    rs_child_account.data.name
                      ? `https://api.adorable.io/avatars/24/${encodeURIComponent(
                          rs_child_account.data.name,
                        )}.png`
                      : 'https://api.adorable.io/avatars/24/justfunnyaccount.png'
                  }
                />
                <RsChildAccountParagraph
                  fieldKey="name"
                  style={{ fontSize: '1.5em', paddingLeft: '1em' }}
                  currentText={rs_child_account.data ? rs_child_account.data.name : 'Loading...'}
                />
              </Button>
              <Button
                key="buttonkey3"
                type="danger"
                style={{ float: 'right', margin: '1em' }}
                onClick={deleteChildAccount}
              >
                {formatMessage({
                  id: 'reseller_portal.delete_account',
                  defaultMessage: 'Delete Account',
                })}
              </Button>
              <Dropdown key="dropdownkey1" overlay={menu}>
                <Button
                  key="buttonkey2"
                  type="primary"
                  style={{ float: 'right', margin: '1em 0em 1em 1em' }}
                >
                  {formatMessage({
                    id: 'reseller_portal.mask_account',
                    defaultMessage: 'Mask Account',
                  })}
                  <Icon type="down" />
                </Button>
              </Dropdown>
            </div>

            <Row gutter={16}>
              <Col key="colkey1" span={12}>
                <Card hoverable className={styles.card}>
                  <Card.Meta
                    avatar={
                      <img
                        alt=""
                        className={styles.cardAvatar}
                        src="https://api.adorable.io/avatars/24/accountdetails.png"
                      />
                    }
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
              </Col>
              <Col key="colkey2" span={12}>
                <Card hoverable className={styles.card}>
                  <Card.Meta
                    avatar={
                      <img
                        alt=""
                        className={styles.cardAvatar}
                        src="https://api.adorable.io/avatars/24/billingdetails.png"
                      />
                    }
                    title={<a>Billing details</a>}
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
              </Col>
            </Row>
          </>
        ) : (
          <ResellerChildrenTable />
        )}
      </PageHeaderWrapper>
    </div>
  );
};

export default connect(
  ({ kazoo_login, kazoo_account, rs_children, rs_child_account, rs_child_users }) => ({
    kazoo_login,
    kazoo_account,
    rs_children,
    rs_child_account,
    rs_child_users,
  }),
)(ResellerPortal);
