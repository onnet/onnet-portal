import md5 from 'md5';
import { Alert } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import React, { Component } from 'react';
import Redirect from 'umi/redirect';

import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { connect } from 'dva';
import LoginComponents from './components/Login';
import styles from './style.less';

const { Tab, UserName, Password, AccountName, Submit } = LoginComponents;

interface LoginProps {
  dispatch: Dispatch<any>;
  kazoo_login: StateType;
  submitting: boolean;
}
export interface FormDataType {
  userName: string;
  password: string;
  mobile: string;
  captcha: string;
}

@connect(
  ({
    kazoo_login,
    loading,
  }: {
    kazoo_login;
    loading: {
      effects: {
        [key: string]: string;
      };
    };
  }) => ({
    kazoo_login,
    submitting: loading.effects['kazoo_login/login'],
  }),
)
class Login extends Component {
  loginForm: FormComponentProps['form'] | undefined | null = undefined;

  state = {
    type: 'account',
  };

  handleSubmit = (err: any, values: FormDataType) => {
    const { type } = this.state;
    if (!err) {
      const username = values.userName;
      const { password } = values;
      const accountname = values.accountName;
      const hashedCreds = md5(`${username}:${password}`);
      const data = { credentials: hashedCreds, account_name: accountname, method: 'md5' };
      console.log(values);
      console.log(accountname);
      console.log(data);

      const { dispatch } = this.props;
      dispatch({
        type: 'kazoo_login/login',
        payload: { data, type },
      });
    }
  };

  onTabChange = (type: string) => {
    this.setState({ type });
  };

  renderMessage = (content: string) => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {
    const { kazoo_login, submitting } = this.props;
    const { status } = kazoo_login;
    const { type } = this.state;

    if (kazoo_login.status === 'success') {
      return <Redirect to="/dashboard" />;
    }
    return (
      <div className={styles.main}>
        <LoginComponents
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          ref={(form: any) => {
            this.loginForm = form;
          }}
        >
          <Tab key="account" tab={formatMessage({ id: 'user-login.login.tab-login-credentials' })}>
            {status === 'error' &&
              !submitting &&
              this.renderMessage(
                formatMessage({ id: 'user-login.login.message-invalid-credentials' }),
              )}
            <UserName
              name="userName"
              placeholder={`${formatMessage({ id: 'user-login.login.userName' })}`}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'user-login.userName.required' }),
                },
              ]}
            />
            <Password
              name="password"
              placeholder={`${formatMessage({ id: 'user-login.login.password' })}`}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'user-login.password.required' }),
                },
              ]}
              onPressEnter={e => {
                e.preventDefault();
                this.loginForm.validateFields(this.handleSubmit);
              }}
            />
            <AccountName
              name="accountName"
              placeholder={`${formatMessage({
                id: 'user-login.login.accountName',
              })}`}
              rules={[
                {
                  required: true,
                  message: formatMessage({
                    id: 'user-login.accountName.required',
                  }),
                },
              ]}
            />
          </Tab>
          <Submit loading={submitting}>
            <FormattedMessage id="user-login.login.login" />
          </Submit>
        </LoginComponents>
      </div>
    );
  }
}

export default Login;
