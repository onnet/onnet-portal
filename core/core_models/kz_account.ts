import { Effect, Reducer, getDvaApp } from 'umi';
import { aGetAccount } from '../services/kazoo';

export interface KazooAccountModelType {
  namespace: 'kz_account';
  state: {};
  effects: {
    refreshAccountState: Effect;
  };
  reducers: {
    update: Reducer<{}>;
    flush: Reducer<{}>;
  };
}

const KazooAccountModel: KazooAccountModelType = {
  namespace: 'kz_account',

  state: {},

  effects: {
    *refresh({ payload }, { call, put }) {
      console.log('IAMMM  kz_account/refresh payload: ', payload);

      const response = yield call(aGetAccount, payload);
      yield put({
        type: 'update',
        payload: response,
      });
      yield getDvaApp()._store.dispatch({
        type: 'lb_account/refresh',
        payload: { account_id: response.data?.id },
      });
      getDvaApp()._store.dispatch({ type: 'authority/refresh', payload: {} });
      getDvaApp()._store.dispatch({ type: 'kz_brief_users/refresh', payload });
      getDvaApp()._store.dispatch({ type: 'kz_brief_devices/refresh', payload });
      getDvaApp()._store.dispatch({ type: 'kz_numbers/refresh', payload });
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

export default KazooAccountModel;
