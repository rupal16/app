export const SET_PREF = 'SET_PREF';

export interface IAction extends Redux.Action {
  type: string;
  payload: {
    key: string;
    value: string;
  };
}

export interface IState {
  [index: string]: string;
}

const initialState = {};

export function reducer(state: IState = initialState, action: IAction) {
  switch (action.type) {
    case SET_PREF:
      return Object.assign({}, state, {
        [action.payload.key]: action.payload.value,
      });

    default:
      return state;
  }
}

export function setPref(key: string, value: string) {
  return {
    type: SET_PREF,
    payload: {
      key,
      value,
    },
  };
}

export type SetPrefFunc = (key: string, value: string) => void;
