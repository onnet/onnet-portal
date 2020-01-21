import { AnyAction, Reducer } from 'redux';

import { EffectsCommandMap } from 'dva';
import { AccountCallflow } from '../services/kazoo-telephony';

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: {}) => T) => T },
) => void;

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
  namespace: 'kz_cf_details',

  state: {},

  effects: {
    *refresh({ payload }, { call, put }) {
      const response = yield call(AccountCallflow, { ...payload, method: 'GET' });
      yield put({
        type: 'update',
        payload: response,
      });
    },
    *flush(_, { put }) {
      yield put({
        type: 'flush_all',
        payload: {},
      });
    },
  },

  reducers: {
    update(state, { payload }) {
      return { ...state, [payload.data.id]: payload.data };
    },
    flush_all(state, { payload }) {
      return { payload };
    },
  },
};

export default Model;
