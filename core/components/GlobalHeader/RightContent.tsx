import React from 'react';
import { connect } from 'umi';

import RsDemaskBtn from '@/pages/onnet-portal/reseller/portal/components/RsDemaskBtn';
import SelectLang from '../SelectLang';
import Avatar from './AvatarDropdown';
import styles from './index.less';

const GlobalHeaderRight = (props) => {
  const { theme, layout, kz_account = {}, kz_login = {} } = props;
  let className = styles.right;

  if (theme === 'dark' && layout === 'topmenu') {
    className = `${styles.right}  ${styles.dark}`;
  }

  return (
    <div className={className}>
      {kz_account.data ? (
        kz_account.data.id !== kz_login.data?.account_id ? (
          <RsDemaskBtn />
        ) : null
      ) : null}
      <Avatar />
      <SelectLang className={styles.action} />
    </div>
  );
};

export default connect(({ settings, kz_account, kz_login }) => ({
  theme: settings.navTheme,
  layout: settings.layout,
  kz_account,
  kz_login,
}))(GlobalHeaderRight);
