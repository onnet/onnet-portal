import { kzSystemStatus } from '../services/kazoo';

const KzSystemStatusModel = {
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
