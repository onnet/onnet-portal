import React from 'react';
import { connect } from 'dva';
import { Drawer } from 'antd';
import EditUser from './EditUser';

const EditUserDrawer = props => {
  const { settings, full_users, selectedUser, onDrawerClose, isDrawerVisible } = props;

  return (
    <Drawer
      title={
        full_users[selectedUser] ? (
          <b style={{ color: settings.primaryColor }}> {full_users[selectedUser].data.username}</b>
        ) : null
      }
      width="50%"
      placement="right"
      onClose={onDrawerClose}
      visible={isDrawerVisible}
    >
      <EditUser selectedUser={selectedUser} />
    </Drawer>
  );
};

export default connect(({ settings, kz_full_users }) => ({
  settings,
  full_users: kz_full_users,
}))(EditUserDrawer);
