import React, { useState, useEffect, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import { kzUsers } from '@/pages/onnet-portal/core/services/kazoo';

import { UserAddOutlined } from '@ant-design/icons';

import { Form, Tooltip, Button, Modal, Input, Row, Col } from 'antd';

const UserCreateForm = props => {

  const [confirmDirty, setConfirmDirty] = useState(false);

  const [, forceUpdate] = useState();

  const { dispatch, owner_id, rs_child_account, rs_child_user, form, formRef } = props;
  const { visible, onCancel, onCreate } = props;

  useEffect(() => {
    forceUpdate({});
  }, []);

  const handleConfirmBlur = e => {
      const { value } = e.target;
      if (!confirmDirty) {
        setConfirmDirtyr( !!value );
      }
    };

  const compareToFirstEmail = (rule, value, callback) => {
      const { form } = props;
      if (value && value !== form.getFieldValue('email')) {
        callback('Two email addresses that you enter is inconsistent!');
      } else {
        callback();
      }
    };

  const validateToNextEmail = (rule, value, callback) => {
      const { form } = props;
      if (value && confirmDirty) {
        form.validateFields(['confirm_email'], { force: true });
      }
      callback();
    };

  const compareToFirstPassword = (rule, value, callback) => {
      const { form } = props;
      if (value && value !== form.getFieldValue('password')) {
        callback('Two passwords that you enter is inconsistent!');
      } else {
        callback();
      }
    };

  const validateToNextPassword = (rule, value, callback) => {
      const { form } = props;
      if (value && confirmDirty) {
        form.validateFields(['confirm'], { force: true });
      }
      callback();
    };

  const inputStyle = { maxWidth: '15em' };


      return (
        <Modal
          visible={visible}
          title={formatMessage({
            id: 'core.Create_new_user',
            defaultMessage: 'Create New User',
          })}
          okText={formatMessage({
            id: 'reseller_portal.create_account_button',
            defaultMessage: 'Create',
          })}
          onOk={onCreate}
          onCancel={onCancel}
        >
          <Form layout="vertical" ref={formRef} >
            <Row gutter={24}>
              <Col span={12}>


      <Form.Item
        name="first_name"
        rules={[
          {
            required: true,
            message: 'Please input our Name!',
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
            message: 'Please input our Surname!',
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
            required: true,
            message: 'Please input your email!',
          },
        ]}
        hasFeedback
      >
        <Input.Password
          style={inputStyle}
          placeholder={formatMessage({ id: 'core.email_address', defaultMessage: 'Email address' })}
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
            required: true,
            message: 'Please confirm your email!',
          },
          ({ getFieldValue }) => ({
            validator(rule, value) {
              if (!value || getFieldValue('email') === value) {
                return Promise.resolve();
              }

              return Promise.reject('No match!');
            },
          }),
        ]}
      >
             <Input.Password
               style={inputStyle}
               placeholder={formatMessage({ id: 'core.confirm_email_address', defaultMessage: 'Confirm email', })}
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
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

const ResellerCreateUser = props => {

  const [visible, setVisible] = useState(false);

  const formRef = React.createRef();

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


formRef.current.validateFields()
          .then(values => {
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
      kzUsers({
        method: 'PUT',
        account_id: props.rs_child_account.data.id,
        data: userDataBag,
      }).then(uRes => {
        console.log(uRes);
        window.g_app._store.dispatch({
          type: 'rs_child_users/refresh',
          payload: { account_id: props.rs_child_account.data.id },
        });
      });

      formRef.current.resetFields();
      setVisible(false);
    });
  };

  const saveFormRef = formRef => {
    formRef = formRef;
  };

    const { btnstyle } = props;
    return (
      <Fragment>
        <Tooltip
          placement="leftTop"
          title={formatMessage({ id: 'core.Create_new_user', defaultMessage: 'Create new user!' })}
        >
          <Button
            key="ResellerCreateUserIconKey"
            type="link"
            onClick={showModal}
            style={btnstyle}
          >
            <UserAddOutlined />
          </Button>
        </Tooltip>
        <UserCreateForm
          key="ResellerCreateChildFormKey2"
          wrappedComponentRef={saveFormRef}
          formRef={formRef}
          visible={visible}
          onCancel={handleCancel}
          onCreate={handleCreate}
        />
      </Fragment>
    );
}

export default connect(({ rs_child_account }) => ({
  rs_child_account,
}))(ResellerCreateUser);
