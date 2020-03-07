import { AnyAction, Reducer } from 'redux';

import { EffectsCommandMap } from 'dva';
import { AccountNumbers } from '@/pages/onnet-portal/core/services/kazoo';

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
  namespace: 'kz_account_numbers',

  state: {
    data: {
      numbers: [],
    },
  },

  effects: {
    *refresh({ payload }, { call, put }) {
      console.log('model kz_account_numbers Refresh');
      const response = yield call(AccountNumbers, { ...payload, method: 'GET' });
      console.log('model kz_account_numbers numbers: ', Object.keys(response.data.numbers));
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
