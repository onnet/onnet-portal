import { Effect, Reducer } from 'umi';
import { kzDevice } from '../services/kazoo';

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
  namespace: 'kz_full_devices',

  state: {},

  effects: {
    *refresh({ payload }, { call, put }) {
      const response = yield call(kzDevice, payload);
      yield put({
        type: 'update',
        payload: { [payload.device_id]: response },
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
