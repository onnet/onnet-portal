import { Effect, Reducer } from 'umi';
import { AccountNumbers } from '../services/kazoo';

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
  namespace: 'kz_account_numbers',

  state: {
    data: {
      numbers: [],
    },
  },

  effects: {
    *refresh({ payload }, { call, put }) {
      const response = yield call(AccountNumbers, { ...payload, method: 'GET' });
      if (response?.status === 'success') {
        yield put({
          type: 'update',
          payload: response,
        });
      } else {
        yield put({
          type: 'update',
          payload: { data: [], status: response?.status },
        });
      }
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
