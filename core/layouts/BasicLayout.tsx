import ProLayout, {
  MenuDataItem,
  BasicLayoutProps as ProLayoutProps,
  Settings,
  SettingDrawer,
} from '@ant-design/pro-layout';
import React, { useEffect } from 'react';
import { formatMessage, Link, connect } from 'umi';
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

const footerRender = () => <span />;

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
    kz_login,
    kz_account,
    kz_user,
    kz_registrations_count,
    authority,
  } = props;

  useEffect(() => {
    if (kz_login.data) {
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
  ({ global, settings, kz_login, kz_account, kz_user, kz_registrations_count, authority }) => ({
    collapsed: global.collapsed,
    settings,
    kz_login,
    kz_account,
    kz_user,
    kz_registrations_count,
    authority,
  }),
)(BasicLayout);
