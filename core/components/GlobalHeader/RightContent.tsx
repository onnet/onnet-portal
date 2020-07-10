import React from 'react';
import { connect } from 'umi';
import { ConnectProps, ConnectState } from '@/models/connect';

import RsDemaskBtn from '@/pages/onnet-portal/reseller/portal/components/RsDemaskBtn';
import SelectLang from '../SelectLang';
import Avatar from './AvatarDropdown';
import styles from './index.less';

export type SiderTheme = 'light' | 'dark';
export interface GlobalHeaderRightProps extends ConnectProps {
  theme?: SiderTheme;
  layout: 'sidemenu' | 'topmenu';
}

const GlobalHeaderRight: React.SFC<GlobalHeaderRightProps> = (props) => {
  const { theme, layout, kz_account = {}, kz_login = {} } = props;
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
    </div>
  );
};

export default connect(({ settings, kz_account, kz_login }: ConnectState) => ({
  theme: settings.navTheme,
  layout: settings.layout,
  kz_account,
  kz_login,
}))(GlobalHeaderRight);
