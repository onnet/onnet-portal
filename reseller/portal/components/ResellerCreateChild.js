import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import { kzAccount, kzUsers } from '@/pages/onnet-portal/core/services/kazoo';

import { Button, Modal, Form, Input, Row, Col } from 'antd';

const CollectionCreateForm = Form.create({ name: 'form_in_modal' })(
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
          <Form layout="vertical">
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  label={formatMessage({ id: 'Account_name', defaultMessage: 'Account name' })}
                >
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: 'Please input Account Name!' }],
                  })(<Input />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={formatMessage({ id: 'Email_address', defaultMessage: 'Email address' })}
                >
                  {getFieldDecorator('email', {
                    rules: [{ required: true, message: 'Please input Email address!' }],
                  })(<Input />)}
                </Form.Item>
              </Col>
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

class ResellerChildSearch extends Component {
  state = {
    visible: false,
  };

  showModal = () => {
    console.log('test showModal');
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
      const accountDataBag = { name: values.name, username: { billing: { email: values.email } } };
      const userDataBag = {
        username: values.email,
        first_name: values.first_name,
        last_name: values.last_name,
        enaled: 'true',
        priv_level: 'admin',
        email: values.email,
        password: 'Password13',
      };

      console.log('accountDataBag: ', accountDataBag);
      console.log('userDataBag: ', userDataBag);
      kzAccount({
        method: 'PUT',
        account_id: this.props.kazoo_account.data.id,
        data: accountDataBag,
      }).then(res => {
        console.log(res);
        kzUsers({ method: 'PUT', account_id: res.data.id, data: userDataBag }).then(uRes => {
          console.log(uRes);
          window.g_app._store.dispatch({
            type: 'rs_child_account/refresh',
            payload: { account_id: res.data.id },
          });
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
    return (
      <Fragment>
        <Button
          key="1"
          type="primary"
          style={{ marginLeft: '1em', marginRight: '1em' }}
          onClick={this.showModal}
        >
          {formatMessage({
            id: 'reseller_portal.create_account',
            defaultMessage: 'Create New Account',
          })}
        </Button>
        <CollectionCreateForm
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
        />
      </Fragment>
    );
  }
}

export default connect(({ kazoo_login, kazoo_account, rs_children }) => ({
  kazoo_login,
  kazoo_account,
  rs_children,
}))(ResellerChildSearch);
