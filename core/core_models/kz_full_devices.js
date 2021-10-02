import { kzDevice } from '../services/kazoo';

const Model = {
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
