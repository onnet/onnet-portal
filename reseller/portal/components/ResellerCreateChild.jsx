import React, { useState, useEffect, Fragment } from 'react';
import { connect, useIntl } from 'umi';
import { kzAccount, kzUsers } from '@/pages/onnet-portal/core/services/kazoo';

import { Form, Button, Modal, Input, Row, Col } from 'antd';

const CollectionCreateForm = (props) => {
  const [, forceUpdate] = useState();

  const { formRef, visible, onCancel, onCreate } = props;

  useEffect(() => {
    forceUpdate({});
  }, []);

  const { formatMessage } = useIntl();

  const inputStyle = { maxWidth: '15em' };

  return (
    <Modal
      visible={visible}
      title={formatMessage({
        id: 'reseller_portal.create_new_account',
        defaultMessage: 'Create New Account',
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
              name="name"
              rules={[
                {
                  required: true,
                  message: 'Please input your Account name!',
                },
              ]}
              hasFeedback
            >
              <Input
                style={inputStyle}
                placeholder={formatMessage({ id: 'Account_name', defaultMessage: 'Account name' })}
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

const ResellerCreateChild = (props) => {
  const [visible, setVisible] = useState(false);

  const { dispatch, kz_account } = props;
  const { formatMessage } = useIntl();
  const formRef = React.createRef();

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleCreate = (prps) => {
    console.log('Handle Create: ');
    console.log(prps);

    formRef.current.validateFields().then((values) => {
      console.log('Received values of form: ', values);
      const accountDataBag = { name: values.name, username: { billing: { email: values.email } } };
      const userDataBag = {
        username: values.email,
        first_name: values.first_name,
        last_name: values.last_name,
        enabled: 'true',
        priv_level: 'admin',
        email: values.email,
        password: values.password,
      };
      console.log('accountDataBag: ', accountDataBag);
      console.log('userDataBag: ', userDataBag);
      kzAccount({
        method: 'PUT',
        account_id: kz_account.data.id,
        data: accountDataBag,
      }).then((res) => {
        console.log(res);
        kzUsers({ method: 'PUT', account_id: res.data.id, data: userDataBag }).then((uRes) => {
          console.log(uRes);
          dispatch({
            type: 'child_account/refresh',
            payload: { account_id: res.data.id },
          });
        });
      });

      formRef.current.resetFields();
      setVisible(false);
    });
  };

  return (
    <Fragment>
      <Button
        key="ResellerCreateChildBtnKey1"
        type="primary"
        style={{ marginLeft: '1em', marginRight: '1em' }}
        onClick={showModal}
      >
        {formatMessage({
          id: 'reseller_portal.create_account',
          defaultMessage: 'Create New Account',
        })}
      </Button>
      <CollectionCreateForm
        key="ResellerCreateChildFormKey2"
        formRef={formRef}
        visible={visible}
        onCancel={handleCancel}
        onCreate={handleCreate}
      />
    </Fragment>
  );
};

export default connect(({ kz_account }) => ({
  kz_account,
}))(ResellerCreateChild);
