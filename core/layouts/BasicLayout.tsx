import ProLayout, {
  MenuDataItem,
  BasicLayoutProps as ProLayoutProps,
  Settings,
  SettingDrawer,
} from '@ant-design/pro-layout';
import React, { useEffect, useState } from 'react';
import { useIntl, Link, connect, FormattedMessage } from 'umi';
import Authorized from '../utils/Authorized';
import RightContent from '../components/GlobalHeader/RightContent';
import MenuSelectLang from '../components/MenuSelectLang';
import { Popconfirm, Modal } from 'antd';
import {
  GlobalOutlined,
  LinkOutlined,
  BookOutlined,
  LogoutOutlined,
  UserOutlined,
} from '@ant-design/icons';
import EditUserDrawer from '@/pages/onnet-portal/core/components/UsersList/EditUserDrawer';
const { confirm } = Modal;

import logo from '../assets/logo.svg';

export interface BasicLayoutProps extends ProLayoutProps {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
  route: ProLayoutProps['route'] & {
    authority: string[];
  };
  settings: Settings;
  dispatch: Dispatch;
}

export type BasicLayoutContext = { [K in 'location']: BasicLayoutProps[K] } & {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
};

const footerRender = () => <span />;

const BreadcrumbRender = (routers = []) => {
  const { formatMessage } = useIntl();
  const pathList = [
    {
      path: '//dashboard',
      breadcrumbName: formatMessage({
        id: 'menu.home',
        defaultMessage: 'Home',
      }),
    },
    ...routers,
  ];
  return pathList;
};

const BasicLayout: React.FC = (props) => {
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
  } = props;

  const [isEditUserDrawerVisible, setIsEditUserDrawerVisible] = useState(false);

  const menuDataRender = (menuList: MenuDataItem[]): MenuDataItem[] =>
    menuList.map((item) => {
      const localItem = { ...item, children: item.children ? menuDataRender(item.children) : [] };
      return Authorized.check(item.authority, localItem, null) as MenuDataItem;
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

  const handleMenuCollapse = (payload: boolean): void =>
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
        breadcrumbRender={BreadcrumbRender}
        itemRender={(route, params, routes, paths) => {
          const first = routes.indexOf(route) === 0;
          return first ? (
            <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
          ) : (
            <span>{route.breadcrumbName}</span>
          );
        }}
        footerRender={footerRender}
        menuDataRender={menuDataRender}
        formatMessage={formatMessage}
        rightContentRender={(rightProps) => <RightContent {...rightProps} />}
        links={[
          <span onClick={() => setIsEditUserDrawerVisible(true)}>
            <UserOutlined />
            {!global.collapsed ? (
              <span style={{ marginLeft: '10px' }}>
                <FormattedMessage id="menu.account_portal.profile" defaultMessage="Profile" />
              </span>
            ) : null}
          </span>,
          <MenuSelectLang />,

          <Popconfirm
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
  ({ global, settings, kz_login, kz_account, kz_user, kz_registrations_count, authority }) => ({
    global,
    settings,
    kz_login,
    kz_account,
    kz_user,
    kz_registrations_count,
    authority,
  }),
)(BasicLayout);
