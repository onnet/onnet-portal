import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { isArrayEqual } from '../utils/subroutine';

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: {}) => T) => T },
) => void;

export interface AuthorityModelType {
  namespace: 'authority';
  state: {};
  effects: {
    refresh: Effect;
    flush: Effect;
  };
  reducers: {
    update: Reducer<{}>;
  };
}

const AuthorityModel: AuthorityModelType = {
  namespace: 'authority',

  state: { currentAuthority: [] },

  effects: {
    *refresh(_, { put }) {
      try {
        const redux_state = window.g_app._store.getState();
        const priv_level = redux_state.kazoo_user.data.priv_level
          ? [redux_state.kazoo_user.data.priv_level]
          : [];
        const reseller = redux_state.kazoo_account.data.is_reseller ? ['reseller'] : [];
        const superduper_admin = redux_state.kazoo_account.data.superduper_admin
          ? ['superduper_admin']
          : [];
        const child_account_selected = redux_state.rs_child_account
          ? redux_state.rs_child_account.data
            ? ['child_account_selected']
            : []
          : [];
        const lanbilling = redux_state.lb_account
          ? redux_state.lb_account.data
            ? ['lanbilling']
            : []
          : [];
        const telephony =
          redux_state.kazoo_account.data.is_reseller ||
          redux_state.kazoo_account.data.superduper_admin
            ? []
            : ['telephony'];
        const account_id = redux_state.kazoo_account.data
          ? [redux_state.kazoo_account.data.id]
          : [];
        const authority = priv_level.concat(
          reseller,
          superduper_admin,
          child_account_selected,
          lanbilling,
          telephony,
          account_id,
        );
        if (!isArrayEqual(authority, redux_state.authority.currentAuthority)) {
          yield put({
            type: 'update',
            payload: { currentAuthority: authority },
          });
        }
      } catch (e) {
        yield put({
          type: 'update',
          payload: { currentAuthority: [] },
        });
      }
    },
    *flush(_, { put }) {
      yield put({
        type: 'update',
        payload: { currentAuthority: [] },
      });
    },
  },

  reducers: {
    update(state, { payload }) {
      return { ...payload };
    },
  },
};

export default AuthorityModel;
