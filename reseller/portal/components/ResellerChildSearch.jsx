import { getDvaApp, useIntl, connect } from 'umi';
import React, { Component } from 'react';
import { Select } from 'antd';

const { Option } = Select;

let timeout;

function fetch(value, callback) {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }

  function fake() {
    const redux_state = getDvaApp()._store.getState();
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
    getDvaApp()._store.dispatch({
      type: 'child_account/refresh',
      payload: { account_id: value },
    });
    this.setState({ data: [], value: undefined, loading: false });
  };

  render() {
    const options = this.state.data.map(d => <Option key={d.id}>{d.name}</Option>);
    const { formatMessage } = useIntl();
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

export default connect(({ kz_login, kz_account, kz_children }) => ({
  kz_login,
  kz_account,
  kz_children,
}))(ResellerChildSearch);
