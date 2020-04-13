import { Effect, Reducer } from 'umi';
import { EffectsCommandMap } from 'dva';
import { getUser } from '../services/kazoo';

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
  namespace: 'kz_full_users',

  state: {},

  effects: {
    *refresh({ payload }, { call, put }) {
      const response = yield call(getUser, payload);
      yield put({
        type: 'update',
        payload: { [payload.owner_id]: response },
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
      return { ...state, ...payload };
    },
  },
};

export default Model;
