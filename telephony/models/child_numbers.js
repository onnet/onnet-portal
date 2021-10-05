import { getDvaApp } from 'umi';

import { AccountNumbers } from '@/pages/onnet-portal/core/services/kazoo';

const Model = {
  namespace: 'child_numbers',

  state: {},

  effects: {
    *refresh({ payload }, { call, put }) {
      const response = yield call(AccountNumbers, payload);
      if (response.status === 'success') {
        yield put({
          type: 'update',
          payload: response,
        });
      } else {
        yield put({
          type: 'update',
          payload: { data: [], status: response.status },
        });
      }
      getDvaApp()._store.dispatch({ type: 'authority/refresh', payload: {} });
    },
    *flush(_, { put }) {
      yield put({
        type: 'update',
        payload: {},
      });
    },
  },

  reducers: {
    update(state, { payload }) {
      return { ...payload };
    },
  },
};

export default Model;
