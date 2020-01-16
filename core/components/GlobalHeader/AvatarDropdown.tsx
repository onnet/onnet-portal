import { Avatar, Icon, Menu } from 'antd';
import { ClickParam } from 'antd/es/menu';
import { FormattedMessage } from 'umi-plugin-react/locale';
import React from 'react';
import { connect } from 'dva';
import router from 'umi/router';

import { ConnectProps, ConnectState } from '@/models/connect';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

export interface GlobalHeaderRightProps extends ConnectProps {
  kazoo_user?: any;
  kazoo_account?: any;
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
          type: 'kazoo_login/logout',
        });
      }

      return;
    }
    router.push(`/int/${key}`);
  };

  render(): React.ReactNode {
    const { kazoo_user_data = {}, kazoo_account_data = {} } = this.props;
    const menuHeaderDropdown = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        <Menu.Item key="center">
          <Icon type="user" />
          <FormattedMessage id="menu.account.center" defaultMessage="account center" />
        </Menu.Item>
        <Menu.Item key="settings">
          <Icon type="setting" />
          <FormattedMessage id="menu.account.settings" defaultMessage="account settings" />
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout">
          <Icon type="logout" />
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
              kazoo_user_data.id
                ? `https://api.adorable.io/avatars/24/${encodeURIComponent(kazoo_user_data.id)}.png`
                : 'https://api.adorable.io/avatars/24/justfunnyaccount.png'
            }
            alt="avatar"
          />
          <span className={styles.name}>
            {kazoo_user_data.first_name ? `${kazoo_user_data.first_name} ` : ' '}
            {kazoo_user_data.last_name ? kazoo_user_data.last_name : ' '}
            {kazoo_account_data.name ? ` @ ${kazoo_account_data.name}` : ' '}
          </span>
        </span>
      </HeaderDropdown>
    );
  }
}
export default connect(({ kazoo_user, kazoo_account }: ConnectState) => ({
  kazoo_user_data: kazoo_user.data ? kazoo_user.data : {},
  kazoo_account_data: kazoo_account.data ? kazoo_account.data : {},
}))(AvatarDropdown);
