import { AnyAction, Reducer } from 'redux';

import { EffectsCommandMap } from 'dva';
import { lbAccountDocs } from '@/pages/onnet-portal/core/services/zzlb';

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
  namespace: 'lb_documents',

  state: {},

  effects: {
    *refresh({ payload }, { call, put }) {
      const response = yield call(lbAccountDocs, payload);
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
