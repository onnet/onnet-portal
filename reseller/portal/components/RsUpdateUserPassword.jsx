import React, { useState, useEffect } from 'react';
import { connect, useIntl } from 'umi';
import { kzUser } from '@/pages/onnet-portal/core/services/kazoo';

import { RedoOutlined } from '@ant-design/icons';

import { Form, Button, Input, message } from 'antd';

const UpdatePassword = (props) => {
  const [, forceUpdate] = useState();

  const { dispatch, owner_id, child_account, child_full_users } = props;
  const [form] = Form.useForm();

  // To disable submit button at the beginning.
  useEffect(() => {
    forceUpdate({});
  }, []);

  const { formatMessage } = useIntl();

  const handleSubmit = (values) => {
    kzUser({
      method: 'PATCH',
      account_id: child_account.data?.id,
      owner_id,
      data: { password: values.password },
    }).then(() => {
      dispatch({
        type: 'child_full_users/refresh',
        payload: { account_id: child_account.data?.id, owner_id },
      });
      message.info(
        `Password for ${child_full_users[owner_id].data.username} successfully updated.`,
      );
    });
    form.resetFields();
  };

  const inputStyle = { maxWidth: '11em' };

  return (
    <Form form={form} name="horizontal_login" layout="inline" onFinish={handleSubmit}>
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: 'Please input your password!',
          },
        ]}
        hasFeedback
      >
        <Input.Password
          style={inputStyle}
          placeholder={formatMessage({ id: 'Password', defaultMessage: 'Password' })}
        />
      </Form.Item>

      <Form.Item
        name="confirm"
        dependencies={['password']}
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Please confirm your password!',
          },
          ({ getFieldValue }) => ({
            validator(rule, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }

              return Promise.reject(new Error('No match!'));
            },
          }),
        ]}
      >
        <Input.Password
          style={inputStyle}
          placeholder={formatMessage({
            id: 'Confirm_password',
            defaultMessage: 'Confirm password',
          })}
        />
      </Form.Item>
      <Form.Item shouldUpdate>
        {() => (
          <Button
            type="primary"
            htmlType="submit"
            disabled={
              !form.isFieldsTouched(true) ||
              form.getFieldsError().filter(({ errors }) => errors.length).length
            }
          >
            {formatMessage({ id: 'core.Change', defaultMessage: 'Change' })}
          </Button>
        )}
      </Form.Item>
      <Form.Item>
        <Button type="primary" icon={<RedoOutlined />} onClick={() => form.resetFields()} />
      </Form.Item>
    </Form>
  );
};

export default connect(({ child_account, child_full_users }) => ({
  child_account,
  child_full_users,
}))(UpdatePassword);
