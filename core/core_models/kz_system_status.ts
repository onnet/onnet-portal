import { Effect, Reducer } from 'umi';
import { EffectsCommandMap } from 'dva';
import { kzSystemStatus } from '../services/kazoo';

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
