import React from 'react';
import { connect } from 'dva';
import { Tag, Icon, Menu, Dropdown, Button } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';

import { PageHeaderWrapper } from '@ant-design/pro-layout';

const ResellerSettings = props => {
  const { kazoo_account } = props;

  const menu = (
    <Menu onClick={event => console.log('Test event: ', event)}>
      <Menu.Item>
        <Icon type="user" />
        Test line
      </Menu.Item>
    </Menu>
  );

  return (
    <PageHeaderWrapper>
      <div style={{ backgroundColor: 'white', display: 'flow-root' }}>
        Hello from Reseller Settings for{' '}
        <Tag>{kazoo_account.data ? kazoo_account.data.name : null}</Tag>!
        <Button key="buttonkey3" type="danger" style={{ float: 'right', margin: '1em' }}>
          {formatMessage({
            id: 'reseller_portal.delete_account',
            defaultMessage: 'Delete Account',
          })}
        </Button>
        <Dropdown key="dropdownkey1" overlay={menu}>
          <Button
            key="buttonkey2"
            type="primary"
            style={{ float: 'right', margin: '1em 0em 1em 1em' }}
          >
            {formatMessage({
              id: 'reseller_portal.mask_account',
              defaultMessage: 'Mask Account',
            })}
            <Icon type="down" />
          </Button>
        </Dropdown>
      </div>
    </PageHeaderWrapper>
  );
};

export default connect(({ kazoo_account }) => ({
  kazoo_account,
}))(ResellerSettings);
