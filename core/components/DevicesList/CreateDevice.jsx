import React, { useState, useEffect, Fragment } from 'react';
import { connect, useIntl } from 'umi';
import { Form, Tooltip, Button, Modal, Input, Row, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { kzDevices } from '../../services/kazoo';

const DeviceCreateForm = props => {
  const [, forceUpdate] = useState();

  const { formRef, visible, onCancel, onCreate } = props;

  useEffect(() => {
    forceUpdate({});
  }, []);

  const inputStyle = { maxWidth: '15em' };
  const { formatMessage } = useIntl();

  return (
    <Modal
      visible={visible}
      title={formatMessage({
        id: 'core.Create_new_device',
        defaultMessage: 'Create New Device',
      })}
      okText={formatMessage({
        id: 'reseller_portal.create_account_button',
        defaultMessage: 'Create',
      })}
      onOk={onCreate}
      onCancel={onCancel}
    >
      <Form layout="vertical" ref={formRef}>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="first_name"
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
    </Modal>
  );
};

const CreateDevice = props => {
  const [visible, setVisible] = useState(false);

  const { dispatch, kz_account } = props;

  const formRef = React.createRef();

  const { formatMessage } = useIntl();

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  //  handleCreate = () => {
  const handleCreate = prps => {
    console.log('Handle Create: ');
    console.log(prps);
    console.log('formRef: ', formRef);

    formRef.current.validateFields().then(values => {
      console.log('Validate OK:', values);
      const userDataBag = {
        username: values.email,
        first_name: values.first_name,
        last_name: values.last_name,
        enaled: 'true',
        priv_level: 'admin',
        email: values.email,
        password: values.password,
      };

      console.log('userDataBag: ', userDataBag);
      kzDevices({
        method: 'PUT',
        account_id: kz_account.data.id,
        data: userDataBag,
      }).then(uRes => {
        console.log(uRes);
        dispatch({
          type: 'kz_brief_devices/refresh',
          payload: { account_id: kz_account.data.id },
        });
      });

      formRef.current.resetFields();
      setVisible(false);
    });
  };

  const { btnstyle } = props;
  return (
    <Fragment>
      <Tooltip
        placement="leftTop"
        title={formatMessage({
          id: 'core.Create_new_device',
          defaultMessage: 'Create new device!',
        })}
      >
        <Button key="CreateDeviceIconKey" type="link" onClick={showModal} style={btnstyle}>
          <PlusOutlined />
        </Button>
      </Tooltip>
      <DeviceCreateForm
        key="CreateChildFormKey2"
        formRef={formRef}
        visible={visible}
        onCancel={handleCancel}
        onCreate={handleCreate}
      />
    </Fragment>
  );
};

export default connect(({ kz_account }) => ({
  account: kz_account,
}))(CreateDevice);
