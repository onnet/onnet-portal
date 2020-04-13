import { Effect, Reducer } from 'umi';
import { EffectsCommandMap } from 'dva';
import { AccountMedia } from '../services/kazoo';

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
  namespace: 'kz_account_media',

  state: {},

  effects: {
    *refresh({ payload }, { call, put }) {
      const response = yield call(AccountMedia, { ...payload, method: 'GET' });
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

export default Model;
