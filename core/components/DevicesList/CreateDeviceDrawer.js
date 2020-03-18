import React from 'react';
import { connect } from 'dva';
import { Form, Row, Col, Input, Select, DatePicker } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';

const { Option } = Select;

const CreateDeviceDrawer = props => {
  const { formRef } = props;

  const onFinish = values => {
    console.log('Success:', values);
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  const inputStyle = { maxWidth: '100%' };

  return (
    <Form
      layout="vertical"
      hideRequiredMark
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      ref={formRef}
    >
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item
            name="first_name"
            label="First Name"
            rules={[
              {
                required: true,
                message: 'Please input your Name!',
              },
            ]}
            hasFeedback
          >
            <Input
              style={inputStyle}
              placeholder={formatMessage({ id: 'Name', defaultMessage: 'Name' })}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="last_name"
            label="Last Name"
            rules={[
              {
                required: true,
                message: 'Please input your Surname!',
              },
            ]}
            hasFeedback
          >
            <Input
              style={inputStyle}
              placeholder={formatMessage({ id: 'Surname', defaultMessage: 'Surname' })}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                type: 'email',
                message: 'The input is not valid E-mail!',
              },
              {
                required: true,
                message: 'Please input your email!',
              },
            ]}
            hasFeedback
          >
            <Input
              style={inputStyle}
              placeholder={formatMessage({
                id: 'core.email_address',
                defaultMessage: 'Email address',
              })}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="confirm_email"
            label="Confirm Email"
            dependencies={['email']}
            hasFeedback
            rules={[
              {
                type: 'email',
                message: 'The input is not valid E-mail!',
              },
              {
                required: true,
                message: 'Please confirm your E-mail!',
              },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (!value || getFieldValue('email') === value) {
                    return Promise.resolve();
                  }

                  return Promise.reject(new Error('No match!'));
                },
              }),
            ]}
          >
            <Input
              style={inputStyle}
              placeholder={formatMessage({
                id: 'core.confirm_email_address',
                defaultMessage: 'Confirm email',
              })}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="password"
            label="Password"
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
        </Col>
        <Col span={12}>
          <Form.Item
            name="confirm"
            label="Confirm Password"
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
        </Col>
      </Row>
    </Form>
  );
};

export default connect(({ kz_full_devices }) => ({
  full_devices: kz_full_devices,
}))(CreateDeviceDrawer);
