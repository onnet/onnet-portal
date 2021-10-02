import { getDvaApp } from 'umi';
import { aKzAccount } from '../services/kazoo';

const KazooAccountModel = {
  namespace: 'kz_account',

  state: {},

  effects: {
    *refresh({ payload }, { call, put }) {
      console.log('IAMMM  kz_account/refresh payload: ', payload);

      const response = yield call(aKzAccount, payload);
      yield put({
        type: 'update',
        payload: response,
      });
      yield getDvaApp()._store.dispatch({
        type: 'lb_account/refresh',
        payload: { account_id: response?.data?.id },
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
