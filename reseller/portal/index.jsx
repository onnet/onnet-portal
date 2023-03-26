import React, { useEffect, Fragment } from 'react';
import { useIntl, connect, history } from 'umi';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Menu, Dropdown, Modal, message, List } from 'antd';

import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ResellerCreateUser from '@/pages/onnet-portal/reseller/portal/components/ResellerCreateUser';
import { kzAccount } from '@/pages/onnet-portal/core/services/kazoo';
import ResellerChildrenTable from './components/ResellerChildrenTable';
import RsChildAccountParagraph from './components/RsChildAccountParagraph';

import AccountDetails from './AccountDetails';
import UsersList from './components/UsersList';

const { confirm } = Modal;

const ResellerPortal = (props) => {
  const { dispatch, kz_account, child_account, child_brief_users } = props;

  useEffect(() => {
    if (kz_account.data) {
      dispatch({
        type: 'kz_children/refresh',
        payload: { account_id: kz_account.data.id },
      });
    }
    if (!(kz_account.data?.is_reseller || kz_account.data?.superduper_admin))
      history.push('/int/dashboard');
  }, [kz_account]);

  const { formatMessage } = useIntl();

  const menuItems =
    _.get(child_account, 'data') && _.get(child_brief_users, 'data', []).length > 0
      ? [
          {
            key: 'no_user_defined',
            label: (
              <>
                <UserOutlined /> Faceless (User)
              </>
            ),
            id: 'no_user_defined',
            first_name: 'Faceless',
            last_name: '',
            username: 'User',
            priv_level: 'user',
          },
        ]
          .concat(child_brief_users.data)
          .map((u) => ({
            key: u.id,
            label: (
              <>
                <UserOutlined /> {u.first_name} {u.last_name} ({u.username})
              </>
            ),
            account_id: child_account.data.id,
            account_name: child_account.data.name,
            user_username: u.username,
            user_id: u.id,
          }))
      : null;

  function handleMenuClick({ key: eventKey }) {
    const selectedItem = menuItems.find(({ key }) => key === eventKey);
    message.info(`Masking as ${selectedItem.user_username} @ ${selectedItem.account_name}.`);
    dispatch({
      type: 'kz_account/refresh',
      payload: { account_id: selectedItem.account_id },
    });
    dispatch({
      type: 'kz_user/refresh',
      payload: { account_id: selectedItem.account_id, owner_id: selectedItem.user_id },
    });
    dispatch({
      type: 'mask_history/mask',
      payload: { account_id: selectedItem.account_id, owner_id: selectedItem.user_id },
    });
    dispatch({
      type: 'lb_account/refresh',
      payload: { account_id: selectedItem.account_id },
    });
    dispatch({
      type: 'child_account/flush',
    });
    dispatch({
      type: 'child_brief_users/flush',
    });
    dispatch({
      type: 'kz_children/flush',
    });
    dispatch({
      type: 'child_numbers/flush',
    });
    if (child_account.data.is_reseller) {
      history.push('/int/accounts/accounts');
    } else {
      history.push('/int/dashboard');
    }
  }

  function deleteChildAccount() {
    confirm({
      title: `Do you want to delete account ${child_account.data.name}`,
      content: `Account ID: ${child_account.data.id}`,
      onOk() {
        kzAccount({ method: 'DELETE', account_id: child_account.data.id })
          .then((delRes) => {
            console.log(delRes);
            dispatch({
              type: 'child_account/flush',
            });
            dispatch({
              type: 'kz_children/refresh',
              payload: { account_id: kz_account.data.id },
            });
            //    window.location.reload(true);
          })
          .catch(() => console.log('Oops errors!'));
      },
      onCancel() {},
    });
  }

  const data = [<AccountDetails key="AccountDetails" />, <UsersList key="UsersList" />];

  return (
    <PageHeaderWrapper key="pagewrapper" breadcrumb={false}>
      {child_account.data ? (
        <Fragment>
          <div style={{ backgroundColor: 'white', display: 'flow-root', marginBottom: '2em' }}>
            <span style={{ float: 'left', display: 'flex' }}>
              <RsChildAccountParagraph
                fieldKey="name"
                style={{
                  fontSize: '1.5em',
                  marginBottom: '0',
                  paddingLeft: '1em',
                  paddingTop: '.5em',
                }}
                currentText={child_account.data ? child_account.data.name : 'Loading...'}
              />
            </span>
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
            <Dropdown key="dropdownkey1" menu={{ onClick: handleMenuClick, items: menuItems }}>
              <Button
                key="buttonkey2"
                type="primary"
                style={{ float: 'right', margin: '1em 0em 1em 1em' }}
              >
                {formatMessage({
                  id: 'reseller_portal.mask_account',
                  defaultMessage: 'Mask Account',
                })}
                <DownOutlined />
              </Button>
            </Dropdown>
            {child_brief_users.data && child_brief_users.data.length === 0 ? (
              <ResellerCreateUser btnstyle={{ float: 'right', marginTop: '1em' }} />
            ) : null}
          </div>

          <List
            grid={{ gutter: 24, xxl: 2, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
            dataSource={data}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
        </Fragment>
      ) : (
        <ResellerChildrenTable />
      )}
    </PageHeaderWrapper>
  );
};

export default connect(
  ({ kz_login, kz_account, kz_children, child_account, child_brief_users }) => ({
    kz_login,
    kz_account,
    kz_children,
    child_account,
    child_brief_users,
  }),
)(ResellerPortal);
