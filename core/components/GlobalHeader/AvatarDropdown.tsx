import React, { useState } from 'react';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Menu } from 'antd';
import { ClickParam } from 'antd/es/menu';
import { history, connect, FormattedMessage } from 'umi';
import EditUserDrawer from '@/pages/onnet-portal/core/components/UsersList/EditUserDrawer';

import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

const AvatarDropdown = (props) => {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const { dispatch, kz_user_data = {}, kz_account_data = {} } = props;

  const onMenuClick = (event: ClickParam) => {
    const { key } = event;
    console.log('AvatarDropdown onMenuClick');
    console.log(event);
    console.log(key);
    if (key === 'logout') {
      if (dispatch) {
        dispatch({
          type: 'kz_login/logout',
        });
      }
    } else if (key === 'user_profile') {
      setIsDrawerVisible(true);
    } else {
      history.push(`/int/${key}`);
    }
  };

  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      <Menu.Item key="user_profile">
        <UserOutlined />
        <FormattedMessage id="core.User_profile" defaultMessage="User profile" />
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout">
        <LogoutOutlined />
        <FormattedMessage id="menu.account.logout" defaultMessage="logout" />
      </Menu.Item>
    </Menu>
  );

  const onDrawerClose = () => {
    setIsDrawerVisible(false);
  };

  return (
    <>
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className={`${styles.action} ${styles.account}`}>
          <span className={styles.name}>
            {kz_user_data.first_name ? `${kz_user_data.first_name} ` : ' '}
            {kz_user_data.last_name ? kz_user_data.last_name : ' '}
            {kz_account_data.name ? ` @ ${kz_account_data.name}` : ' '}
          </span>
        </span>
      </HeaderDropdown>
      <EditUserDrawer
        selectedUser={kz_user_data.id}
        onDrawerClose={onDrawerClose}
        isDrawerVisible={isDrawerVisible}
      />
    </>
  );
};

export default connect(({ kz_user, kz_account }) => ({
  kz_user_data: kz_user.data ? kz_user.data : {},
  kz_account_data: kz_account.data ? kz_account.data : {},
}))(AvatarDropdown);
