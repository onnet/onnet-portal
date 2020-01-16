import { AnyAction, Reducer } from 'redux';

import { EffectsCommandMap } from 'dva';
import { getResellerSIPRegistrations } from '@/pages/onnet-portal/core/services/kazoo';

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
  namespace: 'rs_registrations',

  state: {},

  effects: {
    *refresh({ payload }, { call, put }) {
      console.log('model rs_registrations getResellerSIPRegistrations Refresh');
      const response = yield call(getResellerSIPRegistrations, payload);
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
