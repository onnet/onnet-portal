import { AnyAction, Reducer } from 'redux';

import { EffectsCommandMap } from 'dva';
import { kzSystemStatus } from '@/pages/onnet-portal/core/services/kazoo';

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: {}) => T) => T },
) => void;

export interface KzSystemStatusModelType {
  namespace: 'kz_system_status';
  state: {};
  effects: {
    refreshAccountState: Effect;
  };
  reducers: {
    update: Reducer<{}>;
    flush: Reducer<{}>;
  };
}

const KzSystemStatusModel: KzSystemStatusModelType = {
  namespace: 'kz_system_status',

  state: {},

  effects: {
    *refresh({ payload }, { call, put }) {
      const response = yield call(kzSystemStatus, payload);
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

export default KzSystemStatusModel;
