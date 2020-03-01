import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import { kzUser } from '@/pages/onnet-portal/core/services/kazoo';

import { RedoOutlined } from '@ant-design/icons';

import { Form, Button, Input, message } from 'antd';

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

const UpdatePassword = props => {
  const [confirmDirty, setConfirmDirty] = useState(false);

  const [, forceUpdate] = useState();

  const { dispatch, owner_id, rs_child_account, rs_child_user } = props;
  const [form] = Form.useForm();

  // To disable submit button at the beginning.
  useEffect(() => {
    forceUpdate({});
  }, []);

  const handleSubmit = values => {
        kzUser({
          method: 'PATCH',
          account_id: rs_child_account.data.id,
          owner_id,
          data: { password: values.password },
        }).then(() => {
          dispatch({
            type: 'rs_child_user/refresh',
            payload: { account_id: rs_child_account.data.id, owner_id },
          });
          message.info(
            `Password for ${rs_child_user[owner_id].data.username} successfully updated.`,
          );
        });
        form.resetFields();
  };

  const compareToFirstPassword = (rule, value, callback) => {
    if (value && value !== getFieldValue('password')) {
      callback('No match!');
    } else {
      callback();
    }
  };

  const validateToNextPassword = (rule, value, callback) => {
    if (value && confirmDirty) {
      validateFields(['confirm'], { force: true });
    }
    callback();
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

              return Promise.reject('No match!');
            },
          }),
        ]}
      >
        <Input.Password
          style={inputStyle}
          placeholder={formatMessage({ id: 'Confirm_password', defaultMessage: 'Confirm password', })}
	/>
      </Form.Item>
      <Form.Item shouldUpdate={true}>
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

export default connect(({ rs_child_account, rs_child_user }) => ({
  rs_child_account,
  rs_child_user,
}))(UpdatePassword);
