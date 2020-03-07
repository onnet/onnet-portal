import React, { Suspense } from 'react';
import useFetch from 'fetch-suspense';
import { connect } from 'dva';
import router from 'umi/router';
import { Button } from 'antd';
import { JSON_HEADERS } from '@/pages/onnet-portal/core/services/kazoo.ts';

const MyLink = props => (
  <Button
    size="small"
    type="link"
    onClick={() => {
      window.g_app._store.dispatch({
        type: 'child_account/refresh',
        payload: { account_id: props.account_id },
      });
      router.push('/int/reseller_portal/accounts');
    }}
  >
    {props.children}
  </Button>
);

const FetchNameByAccount = account_id => {
  const redux_state = window.g_app._store.getState();
  const API_URL_V2 = redux_state.settings.crossbarUrlV2;
  const url = `${API_URL_V2}/accounts/${account_id}`;
  const response = useFetch(url, { method: 'GET', headers: JSON_HEADERS() });
  console.log('FetchNameByAccount url');
  console.log(url);
  console.log('FetchNameByAccount response');
  console.log(response);
  return response.data ? (
    response.data.name ? (
      <MyLink account_id={account_id}>{response.data.name}</MyLink>
    ) : (
      'N/A'
    )
  ) : (
    'N/A'
  );
};

const MaybeFetchByNumber = number => {
  const redux_state = window.g_app._store.getState();
  const { account_id } = redux_state.kazoo_login.data;
  const API_URL_V2 = redux_state.settings.crossbarUrlV2;
  const url = `${API_URL_V2}/accounts/${account_id}/phone_numbers/${number}/identify`;
  const response = useFetch(url, { method: 'GET', headers: JSON_HEADERS() });
  return response.data.account_id ? response.data.account_id : 'N/A';
};

const MaybeFetchByRealm = realm => {
  const redux_state = window.g_app._store.getState();
  const API_URL_V2 = redux_state.settings.crossbarUrlV2;
  const url = `${API_URL_V2}/search?t=account&q=realm&v=${realm}`;
  const response = useFetch(url, { method: 'GET', headers: JSON_HEADERS() });
  console.log(`MaybeFetchByRealm realm: ${realm} response:`);
  console.log(response);
  console.log(response.data);
  console.log(response.data[0].name);
  return response.data[0].name ? (
    <MyLink account_id={response.data[0].id}>{response.data[0].name}</MyLink>
  ) : (
    'N/A'
  );
};

const MyFetchingComponent = params => {
  if (params.account_id) {
    return FetchNameByAccount(params.account_id);
  }
  if (params.caller_id_number) {
    const caller_id_number_resp = MaybeFetchByNumber(params.caller_id_number);
    if (caller_id_number_resp !== 'N/A') {
      return FetchNameByAccount(caller_id_number_resp);
    }
  }
  if (params.callee_id_number) {
    const callee_id_number_resp = MaybeFetchByNumber(params.callee_id_number);
    if (callee_id_number_resp !== 'N/A') {
      return FetchNameByAccount(callee_id_number_resp);
    }
  }
  if (params.destination) {
    const destination_resp = MaybeFetchByNumber(params.destination);
    if (destination_resp !== 'N/A') {
      return FetchNameByAccount(destination_resp);
    }
  }
  if (params.realm) {
    const destination_resp = MaybeFetchByRealm(params.realm);
    console.log('MaybeFetchByRealm destination_resp');
    console.log(destination_resp);
    if (destination_resp !== 'N/A') {
      return destination_resp;
    }
  }
  console.log('No param found');
  console.log(params);
  return 'No param found';
};

const AccountName = props => {
  const { kazoo_cache } = props;

  return (
    <Suspense fallback="Loading...">
      {kazoo_cache.account_name[props.account_id] ? (
        kazoo_cache.account_name[props.account_id]
      ) : (
        <MyFetchingComponent
          account_id={props.account_id}
          caller_id_number={props.caller_id_number}
          callee_id_number={props.callee_id_number}
          destination={props.destination}
          realm={props.realm}
        />
      )}
    </Suspense>
  );
};

export default connect(({ kazoo_login, kazoo_account, kazoo_cache }) => ({
  kazoo_login,
  kazoo_account,
  kazoo_cache,
}))(AccountName);
