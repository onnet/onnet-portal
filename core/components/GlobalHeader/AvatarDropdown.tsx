import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Menu } from 'antd';
import { ClickParam } from 'antd/es/menu';
import { FormattedMessage } from 'umi-plugin-react/locale';
import React from 'react';
import { connect } from 'dva';
import router from 'umi/router';

import { ConnectProps, ConnectState } from '@/models/connect';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

export interface GlobalHeaderRightProps extends ConnectProps {
  kz_user?: any;
  kz_account?: any;
}

class AvatarDropdown extends React.Component<GlobalHeaderRightProps> {
  onMenuClick = (event: ClickParam) => {
    const { key } = event;
    console.log('AvatarDropdown onMenuClick');
    console.log(event);
    console.log(key);
    if (key === 'logout') {
      const { dispatch } = this.props;
      if (dispatch) {
        dispatch({
          type: 'kz_login/logout',
        });
      }

      return;
    }
    router.push(`/int/${key}`);
  };

  render(): React.ReactNode {
    const { kz_user_data = {}, kz_account_data = {} } = this.props;
    const menuHeaderDropdown = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        <Menu.Item key="center">
          <UserOutlined />
          <FormattedMessage id="menu.account.center" defaultMessage="account center" />
        </Menu.Item>
        <Menu.Item key="settings">
          <SettingOutlined />
          <FormattedMessage id="menu.account.settings" defaultMessage="account settings" />
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout">
          <LogoutOutlined />
          <FormattedMessage id="menu.account.logout" defaultMessage="logout" />
        </Menu.Item>
      </Menu>
    );
    return (
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className={`${styles.action} ${styles.account}`}>
          <Avatar
            size="small"
            className={styles.avatar}
            src={
              kz_user_data.id
                ? `https://api.adorable.io/avatars/24/${encodeURIComponent(kz_user_data.id)}.png`
                : 'https://api.adorable.io/avatars/24/justfunnyaccount.png'
            }
            alt="avatar"
          />
          <span className={styles.name}>
            {kz_user_data.first_name ? `${kz_user_data.first_name} ` : ' '}
            {kz_user_data.last_name ? kz_user_data.last_name : ' '}
            {kz_account_data.name ? ` @ ${kz_account_data.name}` : ' '}
          </span>
        </span>
      </HeaderDropdown>
    );
  }
}
export default connect(({ kz_user, kz_account }: ConnectState) => ({
  kz_user_data: kz_user.data ? kz_user.data : {},
  kz_account_data: kz_account.data ? kz_account.data : {},
}))(AvatarDropdown);
