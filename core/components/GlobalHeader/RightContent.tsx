import { Icon, Button, Tooltip } from 'antd';
import React from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import { ConnectProps, ConnectState } from '@/models/connect';

import Avatar from './AvatarDropdown';
import ResellerChildSearch from '@/pages/onnet-portal/reseller/portal/components/ResellerChildSearch';
import ResellerCreateChild from '@/pages/onnet-portal/reseller/portal/components/ResellerCreateChild';
import RsDemaskBtn from '@/pages/onnet-portal/reseller/portal/components/RsDemaskBtn';
import SelectLang from '../SelectLang';
import styles from './index.less';

export type SiderTheme = 'light' | 'dark';
export interface GlobalHeaderRightProps extends ConnectProps {
  theme?: SiderTheme;
  layout: 'sidemenu' | 'topmenu';
}

const GlobalHeaderRight: React.SFC<GlobalHeaderRightProps> = props => {
  const {
    dispatch,
    theme,
    layout,
    pathname,
    rs_child_account = {},
    kazoo_account = {},
    kazoo_login = {},
  } = props;
  let className = styles.right;

  const clearRsChild = () => {
    dispatch({
      type: 'rs_child_account/flush',
    });
    dispatch({
      type: 'rs_child_users/flush',
    });
  };

  if (theme === 'dark' && layout === 'topmenu') {
    className = `${styles.right}  ${styles.dark}`;
  }

  return (
    <div className={className}>
      {pathname === '/int/reseller_portal/accounts' ? (
        kazoo_account.data ? (
          kazoo_account.data.superduper_admin || kazoo_account.data.is_reseller ? (
            <React.Fragment>
              {rs_child_account.data ? (
                <Button type="link" onClick={clearRsChild}>
                  <Icon type="user-delete" />
                </Button>
              ) : null}
              <ResellerChildSearch />
              <ResellerCreateChild />
            </React.Fragment>
          ) : null
        ) : null
      ) : null}
      {kazoo_account.data ? (
        kazoo_account.data.id !== kazoo_login.data.account_id ? (
          <RsDemaskBtn />
        ) : null
      ) : null}
      <Avatar />
      <SelectLang className={styles.action} />
      <Tooltip
        title={formatMessage({
          id: 'menu.account.logout',
        })}
      >
        <span className={styles.action} onClick={() => dispatch({ type: 'kazoo_login/logout' })}>
          <Icon type="logout" />
        </span>
      </Tooltip>
    </div>
  );
};

export default connect(
  ({ settings, router, rs_child_account, kazoo_account, kazoo_login }: ConnectState) => ({
    theme: settings.navTheme,
    layout: settings.layout,
    pathname: router.location.pathname,
    rs_child_account,
    kazoo_account,
    kazoo_login,
  }),
)(GlobalHeaderRight);
