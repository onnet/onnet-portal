import { Effect, Reducer } from 'umi';
import { aKzAccount } from '../services/kazoo';

export interface KzooCacheModelType {
  namespace: 'kz_cache';
  state: {};
  effects: {
    refreshAccountState: Effect;
  };
  reducers: {
    update: Reducer<{}>;
    flush: Reducer<{}>;
  };
}

const KzooCacheModel: KzooCacheModelType = {
  namespace: 'kz_cache',

  state: { account_name: [] },

  effects: {
    *refresh({ payload }, { call, put }) {
      const response = yield call(aKzAccount, payload);
      yield put({
        type: 'update',
        payload: response,
      });
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

export default KzooCacheModel;
