import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import { kzAccount, kzUsers } from '@/pages/onnet-portal/core/services/kazoo';

import { Tooltip, Button, Modal, Form, Input, Row, Col, Icon } from 'antd';

const UserCreateForm = Form.create({ name: 'create_user_form_in_modal' })(
  class extends React.Component {
    state = {
      confirmDirty: false,
      autoCompleteResult: [],
    };

    handleConfirmBlur = e => {
      const { value } = e.target;
      if (!this.state.confirmDirty) {
        this.setState({ confirmDirty: !!value });
      }
    };

    compareToFirstEmail = (rule, value, callback) => {
      const { form } = this.props;
      if (value && value !== form.getFieldValue('email')) {
        callback('Two email addresses that you enter is inconsistent!');
      } else {
        callback();
      }
    };

    validateToNextEmail = (rule, value, callback) => {
      const { form } = this.props;
      if (value && this.state.confirmDirty) {
        form.validateFields(['confirm_email'], { force: true });
      }
      callback();
    };

    compareToFirstPassword = (rule, value, callback) => {
      const { form } = this.props;
      if (value && value !== form.getFieldValue('password')) {
        callback('Two passwords that you enter is inconsistent!');
      } else {
        callback();
      }
    };

    validateToNextPassword = (rule, value, callback) => {
      const { form } = this.props;
      if (value && this.state.confirmDirty) {
        form.validateFields(['confirm'], { force: true });
      }
      callback();
    };

    render() {
      const { visible, onCancel, onCreate, form } = this.props;
      const { getFieldDecorator } = form;
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
          <Form layout="vertical">
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item label={formatMessage({ id: 'Name', defaultMessage: 'Name' })}>
                  {getFieldDecorator('first_name', {
                    rules: [{ required: true, message: 'Please input Name!' }],
                  })(<Input />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label={formatMessage({ id: 'Surname', defaultMessage: 'Surname' })}>
                  {getFieldDecorator('last_name', {
                    rules: [{ required: true, message: 'Please input Surname!' }],
                  })(<Input />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={formatMessage({
                    id: 'core.email_address',
                    defaultMessage: 'Email address',
                  })}
                >
                  {getFieldDecorator('email', {
                    rules: [{ required: true, message: 'Please input Email address!' }],
                  })(<Input />)}
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label={formatMessage({
                    id: 'core.confirm_email_address',
                    defaultMessage: 'Confirm email address',
                  })}
                >
                  {getFieldDecorator('confirm_email', {
                    rules: [{ required: true, message: 'Please input Email address!' }],
                  })(<Input />)}
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label={formatMessage({ id: 'Password', defaultMessage: 'Password' })}
                  hasFeedback
                >
                  {getFieldDecorator('password', {
                    rules: [
                      {
                        required: true,
                        message: 'Please input your password!',
                      },
                      {
                        validator: this.validateToNextPassword,
                      },
                    ],
                  })(<Input.Password />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={formatMessage({
                    id: 'Confirm_password',
                    defaultMessage: 'Confirm password',
                  })}
                  hasFeedback
                >
                  {getFieldDecorator('confirm', {
                    rules: [
                      {
                        required: true,
                        message: 'Please confirm your password!',
                      },
                      {
                        validator: this.compareToFirstPassword,
                      },
                    ],
                  })(<Input.Password onBlur={this.handleConfirmBlur} />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      );
    }
  },
);

class ResellerCreateUser extends Component {
  state = {
    visible: false,
  };

  showModal = () => {
    this.setState({ visible: true });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  //  handleCreate = () => {
  handleCreate = prps => {
    console.log('Handle Create: ');
    console.log(prps);

    const { form } = this.formRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      console.log('Received values of form: ', values);
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
        account_id: this.props.rs_child_account.data.id,
        data: userDataBag,
      }).then(uRes => {
        console.log(uRes);
        window.g_app._store.dispatch({
          type: 'rs_child_users/refresh',
          payload: { account_id: this.props.rs_child_account.data.id },
        });
      });

      form.resetFields();
      this.setState({ visible: false });
    });
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  render() {
    const { btnstyle } = this.props;
    return (
      <Fragment>
        <Tooltip
          placement="leftTop"
          title={formatMessage({ id: 'core.Create_new_user', defaultMessage: 'Create new user!' })}
        >
          <Button
            key="ResellerCreateUserIconKey"
            type="link"
            onClick={this.showModal}
            style={btnstyle}
          >
            <Icon type="user-add" />
          </Button>
        </Tooltip>
        <UserCreateForm
          key="ResellerCreateChildFormKey2"
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
        />
      </Fragment>
    );
  }
}

export default connect(({ rs_child_account }) => ({
  rs_child_account,
}))(ResellerCreateUser);
