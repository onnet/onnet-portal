import { AnyAction, Reducer } from 'redux';

import { EffectsCommandMap } from 'dva';
import { lbAccountCDR } from '@/pages/onnet-portal/core/services/zzlb';

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
  namespace: 'lb_statistics',

  state: {
    is_loading: true,
    data: {
      cdrs: [],
    },
  },

  effects: {
    *refresh({ payload }, { call, put }) {
      yield put({ type: 'is_loading' });
      console.log('model lb_statistics Refresh: ', payload);
      const response = yield call(lbAccountCDR, payload);
      yield put({
        type: 'update',
        payload: { is_loading: false, ...response },
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
    is_loading(state) {
      return { ...state, is_loading: true };
    },
  },
};

export default Model;
