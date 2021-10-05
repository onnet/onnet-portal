import { getDvaApp } from 'umi';

const Model = {
  namespace: 'mask_history',

  state: {},

  effects: {
    *demask(_, { put, select }) {
      console.log('Demask attempt');
      const state = yield select();
      const account_id = state.mask_history.children.account_id
        ? state.mask_history.children.account_id
        : state.kz_login.data.account_id;
      const owner_id = state.mask_history.children.owner_id
        ? state.mask_history.children.owner_id
        : state.kz_login.data.owner_id;
      yield getDvaApp()._store.dispatch({
        type: 'lb_account/refresh',
        payload: { account_id },
      });
      yield getDvaApp()._store.dispatch({
        type: 'kz_account/refresh',
        payload: { account_id },
      });
      yield getDvaApp()._store.dispatch({
        type: 'kz_user/refresh',
        payload: { account_id, owner_id },
      });
      yield getDvaApp()._store.dispatch({
        type: 'child_account/refresh',
        payload: { account_id: state.mask_history.account_id },
      });
      yield getDvaApp()._store.dispatch({
        type: 'brt_child_account/refresh',
        payload: { account_id: state.mask_history.account_id },
      });
      yield put({
        type: 'levelup',
      });
    },
    *mask({ payload }, { put }) {
      yield getDvaApp()._store.dispatch({
        type: 'lb_account/refresh',
        payload: { account_id: payload.account_id },
      });
      yield put({
        type: 'level_down',
        payload,
      });
    },
  },

  reducers: {
    level_down(state, { payload }) {
      return { ...payload, children: state };
    },
    levelup(state) {
      return { ...state.children };
    },
  },
};

export default Model;
