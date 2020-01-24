import React from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import { ConnectProps, ConnectState } from '@/models/connect';
import { Icon, Tooltip } from 'antd';

import Avatar from './AvatarDropdown';
import RsDemaskBtn from '@/pages/onnet-portal/reseller/portal/components/RsDemaskBtn';
import SelectLang from '../SelectLang';
import styles from './index.less';

export type SiderTheme = 'light' | 'dark';
export interface GlobalHeaderRightProps extends ConnectProps {
  theme?: SiderTheme;
  layout: 'sidemenu' | 'topmenu';
}

const GlobalHeaderRight: React.SFC<GlobalHeaderRightProps> = props => {
  const { dispatch, theme, layout, kazoo_account = {}, kazoo_login = {} } = props;
  let className = styles.right;

  if (theme === 'dark' && layout === 'topmenu') {
    className = `${styles.right}  ${styles.dark}`;
  }

  return (
    <div className={className}>
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

export default connect(({ settings, kazoo_account, kazoo_login }: ConnectState) => ({
  theme: settings.navTheme,
  layout: settings.layout,
  kazoo_account,
  kazoo_login,
}))(GlobalHeaderRight);
