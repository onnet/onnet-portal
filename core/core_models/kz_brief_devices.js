import { saga } from 'dva';
import { kzDevices } from '../services/kazoo';

const Model = {
  namespace: 'kz_brief_devices',

  state: {},

  effects: {
    *refresh({ payload, timeout }, { call, put }) {
      yield call(saga.delay, timeout || 0);
      const response = yield call(kzDevices, payload);
      if (response?.status === 'success') {
        yield put({
          type: 'update',
          payload: response,
        });
      } else {
        yield put({
          type: 'update',
          payload: { data: [], status: response?.status },
        });
      }
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
      console.log('IAM kz_brief_devices reducers update payload: ', payload);
      return { ...payload };
    },
  },
};

export default Model;
