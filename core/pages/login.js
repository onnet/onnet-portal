import md5 from 'md5';
import React, { useState } from 'react';
import { connect } from 'dva';
import Redirect from 'umi/redirect';
import { formatMessage } from 'umi-plugin-react/locale';
import { kzUser } from '@/pages/onnet-portal/core/services/kazoo';

import { Card, Button, Input, message, Form, Checkbox } from 'antd';

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

const LoginForm = props => {
  const { dispatch, kazoo_login } = props;

  if (kazoo_login.status === 'success') {
    return <Redirect to="/dashboard" />;
  }

  const [form] = Form.useForm();

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  const onFinish = values => {
    console.log('Success:', values);
    const { username, password, accountname } = values;
    const hashedCreds = md5(`${username}:${password}`);
    const data = { credentials: hashedCreds, account_name: accountname, method: 'md5' };
    console.log(values);
    console.log(accountname);
    console.log(data);
    dispatch({
      type: 'kazoo_login/login',
      payload: { data, type: 'account' },
    });
  };

  const inputStyle = { width: '17em' };

  return (
    <Card
      title={formatMessage({ id: 'user-login.login.tab-login-credentials' })}
      style={{ width: 300, margin: 'auto', padding: '10px' }}
    >
      <Form
        {...layout}
        name="basic"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          name="username"
          rules={[
            {
              required: true,
              message: formatMessage({
                id: 'user-login.userName.required',
                defaultMessage: 'Username required',
              }),
            },
          ]}
        >
          <Input
            style={inputStyle}
            placeholder={formatMessage({
              id: 'user-login.login.userName',
              defaultMessage: 'Username',
            })}
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: formatMessage({ id: 'user-login.password.required' }),
            },
          ]}
        >
          <Input.Password
            style={inputStyle}
            placeholder={formatMessage({ id: 'Password', defaultMessage: 'Password' })}
          />
        </Form.Item>

        <Form.Item
          name="accountname"
          rules={[
            {
              required: true,
              message: formatMessage({ id: 'user-login.accountName.required' }),
            },
          ]}
        >
          <Input
            style={inputStyle}
            placeholder={`${formatMessage({ id: 'user-login.login.accountName' })}`}
          />
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default connect(({ kazoo_login }) => ({
  kazoo_login,
}))(LoginForm);
