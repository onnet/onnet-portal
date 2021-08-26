import { Effect, Reducer, getDvaApp } from 'umi';
import { aGetAccount, accountByRealm } from '../services/kazoo';

export interface ModelType {
  namespace: string;
  state: {};
  effects: {
    refreshAccountState: Effect;
  };
  reducers: {
    update: Reducer<{}>;
    flush: Reducer<{}>;
  };
}

const Model: ModelType = {
  namespace: 'child_account',

  state: {},

  effects: {
    *refresh({ payload }, { call, put }) {
      const response = yield call(aGetAccount, payload);
      console.log('child_account/refresh: response', response);
      yield put({
        type: 'update',
        payload: response,
      });
      getDvaApp()._store.dispatch({ type: 'child_brief_users/refresh', payload });
      getDvaApp()._store.dispatch({ type: 'child_numbers/refresh', payload });
      getDvaApp()._store.dispatch({ type: 'authority/refresh', payload: {} });
    },
    *refresh_by_realm({ payload }, { call, put }) {
      const response = yield call(accountByRealm, payload);
      console.log('child_account/refresh_by_realm: response', response);
      console.log('child_account/refresh_by_realm: response.data[0].id', response.data[0]?.id);
      //  getDvaApp()._store.dispatch({ type: 'child_account/refresh', payload: {account_id: response.data[0]?.id} });
      yield put({
        type: 'refresh',
        payload: { account_id: response.data[0]?.id },
      });
    },
    *flush(_, { put }) {
      yield put({
        type: 'update',
        payload: {},
      });
      getDvaApp()._store.dispatch({ type: 'authority/refresh', payload: {} });
    },
  },

  reducers: {
    update(state, { payload }) {
      return { ...payload };
    },
  },
};

export default Model;
