/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout, {
  MenuDataItem,
  BasicLayoutProps as ProLayoutProps,
  Settings,
  SettingDrawer,
} from '@ant-design/pro-layout';
import React, { useEffect } from 'react';
import Link from 'umi/link';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import Authorized from '../utils/Authorized';
import RightContent from '../components/GlobalHeader/RightContent';

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
/**
 * use Authorized check all menu item
 */

const menuDataRender = (menuList: MenuDataItem[]): MenuDataItem[] =>
  menuList.map(item => {
    const localItem = { ...item, children: item.children ? menuDataRender(item.children) : [] };
    return Authorized.check(item.authority, localItem, null) as MenuDataItem;
  });

const footerRender = () => <span></span>;

const breadcrumbRender = (routers = []) => {
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

const BasicLayout: React.FC = props => {
  const {
    dispatch,
    children,
    settings,
    kazoo_login,
    kazoo_account,
    kazoo_user,
    rs_registrations_count,
    authority,
  } = props;

  useEffect(() => {
    if (kazoo_login.data) {
      if (dispatch) {
        if (!kazoo_account.data) {
          dispatch({
            type: 'kazoo_account/refresh',
            payload: { account_id: kazoo_login.data.account_id },
          });
        }
        if (!kazoo_user.data) {
          dispatch({
            type: 'kazoo_user/refresh',
            payload: {
              account_id: kazoo_login.data.account_id,
              owner_id: kazoo_login.data.owner_id,
            },
          });
        }
        if (!rs_registrations_count.data) {
          dispatch({
            type: 'rs_registrations_count/refresh',
            payload: { account_id: kazoo_login.data.account_id },
          });
        }
        if (kazoo_account.data) {
          dispatch({
            type: 'lb_account/refresh',
            payload: { account_id: kazoo_account.data.id },
          });
        }
      }
      const interval = setInterval(() => {
        console.log('tick');
        dispatch({
          type: 'kazoo_login/check_auth',
        });
      }, 60000);
      return () => {
        console.log('Unticking it!');
        clearInterval(interval);
      };
    }
    return () => {
      console.log('kazoo_login.data yet...');
    };
  }, [kazoo_account, kazoo_user, authority]);

  const handleMenuCollapse = (payload: boolean): void =>
    dispatch &&
    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload,
    });

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
        breadcrumbRender={breadcrumbRender}
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
        rightContentRender={rightProps => <RightContent {...rightProps} />}
        {...props}
        {...settings}
      >
        {children}
      </ProLayout>
      <SettingDrawer
        settings={settings}
        onSettingChange={config =>
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
    kazoo_login,
    kazoo_account,
    kazoo_user,
    rs_registrations_count,
    authority,
  }) => ({
    collapsed: global.collapsed,
    settings,
    kazoo_login,
    kazoo_account,
    kazoo_user,
    rs_registrations_count,
    authority,
  }),
)(BasicLayout);
