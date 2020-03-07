import React from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import { ConnectProps, ConnectState } from '@/models/connect';
import { LogoutOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';

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
  const { dispatch, theme, layout, kz_account = {}, kz_login = {} } = props;
  let className = styles.right;

  if (theme === 'dark' && layout === 'topmenu') {
    className = `${styles.right}  ${styles.dark}`;
  }

  return (
    <div className={className}>
      {kz_account.data ? (
        kz_account.data.id !== kz_login.data.account_id ? (
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
        <span className={styles.action} onClick={() => dispatch({ type: 'kz_login/logout' })}>
          <LogoutOutlined />
        </span>
      </Tooltip>
    </div>
  );
};

export default connect(({ settings, kz_account, kz_login }: ConnectState) => ({
  theme: settings.navTheme,
  layout: settings.layout,
  kz_account,
  kz_login,
}))(GlobalHeaderRight);
