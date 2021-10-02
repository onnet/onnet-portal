import ProLayout, {
  SettingDrawer,
} from '@ant-design/pro-layout';
import NumberFormat from 'react-number-format';
import React, { useEffect, useState } from 'react';
import { useIntl, Link, connect, FormattedMessage } from 'umi';
import Authorized from '../utils/Authorized';
import MenuSelectLang from '../components/MenuSelectLang';
import { Popconfirm } from 'antd';
import {
  LogoutOutlined,
  UserOutlined,
} from '@ant-design/icons';
import ResellerChildFlush from '@/pages/onnet-portal/reseller/portal/components/ResellerChildFlush';
import ResellerChildSearch from '@/pages/onnet-portal/reseller/portal/components/ResellerChildSearch';
import ResellerCreateChild from '@/pages/onnet-portal/reseller/portal/components/ResellerCreateChild';
import EditUserDrawer from '@/pages/onnet-portal/core/components/UsersList/EditUserDrawer';
import RsDemaskBtn from '@/pages/onnet-portal/reseller/portal/components/RsDemaskBtn';
import styles from '@/pages/onnet-portal/core/style.less';

import logo from '../assets/logo.svg';

const footerRender = () => <span />;

const BasicLayout = (props) => {
  const {
    dispatch,
    children,
    global,
    settings,
    kz_login,
    kz_account,
    kz_user,
    kz_registrations_count,
    authority,
    child_account,
    lb_account,
  } = props;

  const [isEditUserDrawerVisible, setIsEditUserDrawerVisible] = useState(false);

  const menuDataRender = (menuList) =>
    menuList.map((item) => {
      const localItem = { ...item, children: item.children ? menuDataRender(item.children) : [] };
      return Authorized.check(item.authority, localItem, null);
    });

  useEffect(() => {
    if (kz_login?.data) {
      if (dispatch) {
        if (!kz_account.data) {
          dispatch({
            type: 'kz_account/refresh',
            payload: { account_id: kz_login.data.account_id },
          });
        }
        if (!kz_user.data) {
          dispatch({
            type: 'kz_user/refresh',
            payload: {
              account_id: kz_login.data.account_id,
              owner_id: kz_login.data.owner_id,
            },
          });
        }
        if (!kz_registrations_count.data) {
          dispatch({
            type: 'kz_registrations_count/refresh',
            payload: { account_id: kz_login.data.account_id },
          });
        }
        if (kz_account.data) {
          dispatch({
            type: 'lb_account/refresh',
            payload: { account_id: kz_account.data.id },
          });
        }
      }
      const interval = setInterval(() => {
        console.log('tick');
        dispatch({
          type: 'kz_login/check_auth',
        });
      }, 60000);
      return () => {
        console.log('Unticking it!');
        dispatch({
          type: 'kz_login/check_auth',
        });
        clearInterval(interval);
      };
    }
    return () => {
      console.log('kz_login.data yet...');
    };
  }, [kz_account, kz_user, authority]);

  const { formatMessage } = useIntl();

  const handleMenuCollapse = (payload) =>
    dispatch &&
    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload,
    });

  const onEditUserDrawerClose = () => {
    setIsEditUserDrawerVisible(false);
  };

  const onLogoutConfirmed = () => {
    dispatch({
      type: 'kz_login/logout',
    });
  };

  const transform_style = { transform: `translateY(-50%)` };

  const extraConsumerContent = (
    <div className={styles.extraContent}>
      <div className={styles.statItem}>
        <p>
          {formatMessage({
            id: 'reseller_portal.Account_status',
            defaultMessage: 'Account status',
          })}
        </p>
        <p>Active</p>
      </div>
      <div className={styles.statItem}>
        <p>
          {formatMessage({
            id: 'reseller_portal.Current_balance',
            defaultMessage: 'Current balance',
          })}
        </p>
        {lb_account.data ? (
          <NumberFormat
            value={lb_account.data.account_balance}
            displayType="text"
            thousandSeparator=" "
            decimalScale={2}
            renderText={(value) => <div>{value} руб.</div>}
          />
        ) : null}
      </div>
      <div className={styles.statItem}>
        <p>
          {kz_user.data?.first_name ? `${kz_user.data.first_name} ` : ' '}
          {kz_user.data?.last_name ? kz_user.data.last_name : ' '}
        </p>
        <p>{kz_account.data?.name ? `${kz_account.data?.name}` : ' '}</p>
      </div>
      {kz_account.data && kz_account.data.id !== kz_login.data?.account_id ? (
        <div className={styles.statItem} style={transform_style}>
          <RsDemaskBtn />
        </div>
      ) : null}
    </div>
  );

  const extraResellerContent = kz_account?.data?.is_reseller ? (
    [
      <ResellerChildFlush key="extraFlush" />,
      <ResellerChildSearch key="extraSearch" />,
      <ResellerCreateChild key="extraCreate" />,
    ]
  ) : kz_account.data ? (
    kz_account.data.id !== kz_login.data?.account_id ? (
      <RsDemaskBtn />
    ) : null
  ) : null;

  return (
    <>
      <ProLayout
        logo={logo}
        onCollapse={handleMenuCollapse}
        menuItemRender={(menuItemProps, defaultDom) => {
          if (menuItemProps.isUrl) {
            return defaultDom;
          }

          return <Link to={menuItemProps.path}>{defaultDom}</Link>;
        }}
        breadcrumb={false}
        subTitle={
          child_account?.data ? (
            <span style={{ color: settings.primaryColor }}>{child_account?.data?.name}</span>
          ) : null
        }
        footerRender={footerRender}
        menuDataRender={menuDataRender}
        formatMessage={formatMessage}
        extra={kz_account?.data?.is_reseller ? extraResellerContent : extraConsumerContent}
        links={[
          <span key="profile_link_key"
            onClick={() => setIsEditUserDrawerVisible(true)}
          >
            <UserOutlined />
            {!global.collapsed ? (
              <span style={{ marginLeft: '10px' }}>
                <FormattedMessage id="menu.account_portal.profile" defaultMessage="Profile" />
              </span>
            ) : null}
          </span>,
          <MenuSelectLang key="menu_select_lang_link_key" />,

          <Popconfirm
            key="logout+link_key"
            title={`${formatMessage({
              id: 'menu.account.logout',
              defaultMessage: 'Logout',
            })}?`}
            okText={formatMessage({ id: 'core.Confirm', defaultMessage: 'Confirm' })}
            cancelText={formatMessage({ id: 'core.Cancel', defaultMessage: 'Cancel' })}
            onConfirm={() => {
              onLogoutConfirmed();
            }}
          >
            <LogoutOutlined />
            {!global.collapsed ? (
              <span style={{ marginLeft: '13px' }}>
                <FormattedMessage id="menu.account.logout" defaultMessage="logout" />
              </span>
            ) : null}
          </Popconfirm>,
        ]}
        {...props}
        {...settings}
      >
        {children}
      </ProLayout>
      <EditUserDrawer
        selectedUser={kz_user.data?.id}
        onDrawerClose={onEditUserDrawerClose}
        isDrawerVisible={isEditUserDrawerVisible}
      />
      <SettingDrawer
        settings={settings}
        onSettingChange={(config) =>
          dispatch({
            type: 'settings/changeSetting',
            payload: config,
          })
        }
      />
    </>
  );
};

export default connect(
  ({
    global,
    settings,
    kz_login,
    kz_account,
    kz_user,
    kz_registrations_count,
    authority,
    child_account,
    lb_account,
  }) => ({
    global,
    settings,
    kz_login,
    kz_account,
    kz_user,
    kz_registrations_count,
    authority,
    child_account,
    lb_account,
  }),
)(BasicLayout);
