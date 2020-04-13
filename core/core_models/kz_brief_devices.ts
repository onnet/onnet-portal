import { Effect, Reducer, getDvaApp } from 'umi';
import { EffectsCommandMap, saga } from 'dva';
import { kzDevices } from '../services/kazoo';

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
  namespace: 'kz_brief_devices',

  state: {},

  effects: {
    *refresh({ payload, timeout }, { call, put }) {
      yield call(saga.delay, timeout || 0);
      const response = yield call(kzDevices, payload);
      if (response.status === 'success') {
        yield put({
          type: 'update',
          payload: response,
        });
      } else {
        yield put({
          type: 'update',
          payload: { data: [], status: response.status },
        });
      }
      //    const redux_state = getDvaApp()._store.getState();
      //    response.data.map(device =>
      //      getDvaApp()._store.dispatch({
      //        type: 'kz_full_devices/refresh',
      //        payload: { account_id: redux_state.kz_account.data.id, device_id: device.id },
      //      }),
      //    );
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
