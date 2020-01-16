import { AnyAction, Reducer } from 'redux';

import { EffectsCommandMap } from 'dva';
import { aGetAccount } from '@/pages/onnet-portal/core/services/kazoo';

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: {}) => T) => T },
) => void;

export interface KzooCacheModelType {
  namespace: 'kazoo_cache';
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
  namespace: 'kazoo_cache',

  state: { account_name: [] },

  effects: {
    *refresh({ payload }, { call, put }) {
      const response = yield call(aGetAccount, payload);
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
