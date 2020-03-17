import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { kzDevices } from '@/pages/onnet-portal/core/services/kazoo';

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
  namespace: 'kz_brief_devices',

  state: {},

  effects: {
    *refresh({ payload }, { call, put }) {
      console.log('IAM kz_brief_devices payload: ', payload);
      const response = yield call(kzDevices, payload);
      console.log('IAM kz_brief_devices response: ', response);
      console.log('IAM kz_brief_devices response.status: ', response.status);
      if (response.status === 'success') {
        yield put({
          type: 'update',
          payload: response,
	});
      } else {
        yield put({
          type: 'update',
	  payload: {data: [], status: response.status},
	});
      }
      //    const redux_state = window.g_app._store.getState();
      //    response.data.map(device =>
      //      window.g_app._store.dispatch({
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
