import { Effect, Reducer, getDvaApp } from 'umi';
import { aGetAccount } from '../services/kazoo';

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
      yield put({
        type: 'update',
        payload: response,
      });
      getDvaApp()._store.dispatch({ type: 'child_brief_users/refresh', payload });
      getDvaApp()._store.dispatch({ type: 'child_numbers/refresh', payload });
      getDvaApp()._store.dispatch({ type: 'authority/refresh', payload: {} });
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
