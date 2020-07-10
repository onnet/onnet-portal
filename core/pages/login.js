import md5 from 'md5';
import React from 'react';
import { useIntl, Redirect, connect } from 'umi';

import { Card, Button, Input, Form } from 'antd';

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
  const { dispatch, kz_login } = props;
  const { formatMessage } = useIntl();

  if (kz_login.status === 'success') {
    return <Redirect to="/dashboard" />;
  }

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  const onFinish = values => {
    console.log('kz_login IAM1:', kz_login);
    console.log('SuccessIAM1:', values);
    const { username, password, accountname } = values;
    const hashedCreds = md5(`${username}:${password}`);
    const data = { credentials: hashedCreds, account_name: accountname, method: 'md5' };
    console.log(values);
    console.log(accountname);
    console.log('DataIAM1: ', data);
    dispatch({
      type: 'kz_login/login',
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

export default connect(({ kz_login }) => ({
  kz_login,
}))(LoginForm);
