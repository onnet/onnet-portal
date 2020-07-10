import React, { useState } from 'react';
import { getDvaApp, useIntl, connect } from 'umi';
import * as _ from 'lodash';
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
      if (_.toString(Object.values(d)).toLowerCase().includes(value.toLowerCase())) {
        data.push(d);
      }
    });
    return callback(data);
  }

  timeout = setTimeout(fake, 300);
}

const ResellerChildSearch = props => {

  const [data, setData] = useState([]);
  const [value, setValue] = useState(undefined);
  const [loading, setLoading] = useState(false);

  const { dispatch } = props;

  const { formatMessage } = useIntl();

  const handleSearch = val => {
    setLoading(true);
    if (val) {
      fetch(val, dat => {
	      setData(dat);
	      setLoading(false)
      });
    } else {
      setData([]);
      setLoading(false);
    }
  };

  const handleChange = val => {
    setValue(val);
  };

  const handleSelect = val => {
    dispatch({
      type: 'child_account/refresh',
      payload: { account_id: val },
    });
    setData([]);
    setLoading(false);
    setValue(undefined);
  };

    const options = data.map(d => <Option key={d.id}>{d.name}</Option>);
    return (
      <Select
        key="ResellerChildSearchKey"
        showSearch
        loading={loading}
        value={value}
        placeholder={formatMessage({
          id: 'reseller_portal.account_lookup',
          defaultMessage: 'Account Lookup',
        })}
        style={{ width: 200 }}
        defaultActiveFirstOption={false}
        showArrow={false}
        filterOption={false}
        onSearch={handleSearch}
        onChange={handleChange}
        onSelect={handleSelect}
        notFoundContent={null}
      >
        {options}
      </Select>
    );
}

export default connect(({ kz_children }) => ({
  kz_children,
}))(ResellerChildSearch);
