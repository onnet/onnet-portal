import React, { Component } from 'react';
import { connect } from 'dva';
import { Select } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';

const { Option } = Select;

let timeout;

function fetch(value, callback) {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }

  function fake() {
    const redux_state = window.g_app._store.getState();
    const data = [];
    redux_state.kz_children.data.forEach(d => {
      if (d.name.toLowerCase().includes(value.toLowerCase())) {
        data.push(d);
      }
    });
    return callback(data);
  }

  timeout = setTimeout(fake, 300);
}

class ResellerChildSearch extends Component {
  state = {
    data: [],
    value: undefined,
    loading: false,
  };

  handleSearch = value => {
    this.setState({ loading: true });
    if (value) {
      fetch(value, data => this.setState({ data, loading: false }));
    } else {
      this.setState({ data: [], loading: false });
    }
  };

  handleChange = value => {
    this.setState({ value });
  };

  handleSelect = value => {
    window.g_app._store.dispatch({
      type: 'child_account/refresh',
      payload: { account_id: value },
    });
    this.setState({ data: [], value: undefined, loading: false });
  };

  render() {
    const options = this.state.data.map(d => <Option key={d.id}>{d.name}</Option>);
    return (
      <Select
        key="ResellerChildSearchKey"
        showSearch
        loading={this.state.loading}
        value={this.state.value}
        placeholder={formatMessage({
          id: 'reseller_portal.account_lookup',
          defaultMessage: 'Account Lookup',
        })}
        style={{ width: 200 }}
        defaultActiveFirstOption={false}
        showArrow={false}
        filterOption={false}
        onSearch={this.handleSearch}
        onChange={this.handleChange}
        onSelect={this.handleSelect}
        notFoundContent={null}
      >
        {options}
      </Select>
    );
  }
}

export default connect(({ kazoo_login, kazoo_account, kz_children }) => ({
  kazoo_login,
  kazoo_account,
  kz_children,
}))(ResellerChildSearch);
