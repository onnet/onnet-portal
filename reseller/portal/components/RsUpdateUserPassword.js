import React, { useState } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import { kzUser } from '@/pages/onnet-portal/core/services/kazoo';

import { Button, Form, Input, message } from 'antd';

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

const UpdatePassword = props => {
  const [confirmDirty, setConfirmDirty] = useState(false);

  const { dispatch, owner_id, rs_child_account, rs_child_user } = props;

  const {
    getFieldDecorator,
    getFieldsError,
    validateFields,
    getFieldValue,
    resetFields,
  } = props.form;

  const handleConfirmBlur = e => {
    const { value } = e.target;
    if (!confirmDirty) {
      setConfirmDirty(!!value);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
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
        resetFields();
      }
    });
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
    <Form layout="inline" onSubmit={handleSubmit}>
      <Form.Item hasFeedback>
        {getFieldDecorator('password', {
          rules: [
            {
              required: true,
              message: 'Please input your password!',
            },
            {
              validator: validateToNextPassword,
            },
          ],
        })(
          <Input.Password
            style={inputStyle}
            placeholder={formatMessage({ id: 'Password', defaultMessage: 'Password' })}
          />,
        )}
      </Form.Item>

      <Form.Item hasFeedback>
        {getFieldDecorator('confirm', {
          rules: [
            {
              required: true,
              message: 'Please confirm your password!',
            },
            {
              validator: compareToFirstPassword,
            },
          ],
        })(
          <Input.Password
            onBlur={handleConfirmBlur}
            style={inputStyle}
            placeholder={formatMessage({
              id: 'Confirm_password',
              defaultMessage: 'Confirm password',
            })}
          />,
        )}
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" disabled={hasErrors(getFieldsError())}>
          {formatMessage({ id: 'core.Change', defaultMessage: 'Change' })}
        </Button>
      </Form.Item>

      <Form.Item>
        <Button type="primary" icon="redo" onClick={() => resetFields()} />
      </Form.Item>
    </Form>
  );
};

const RsUpdateUserPassword = Form.create({ name: 'update_pwd_form' })(UpdatePassword);

export default connect(({ rs_child_account, rs_child_user }) => ({
  rs_child_account,
  rs_child_user,
}))(RsUpdateUserPassword);
