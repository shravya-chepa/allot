import { mergeData } from "./helper";

export const initialState = {};

export function applicationReducer(state = initialState, action) {
  const type = action.type.substring(0, action.type.lastIndexOf("_"));
  const key = action.readProps || type.toLowerCase();

  switch (action.type) {
    case `${type}_PENDING`:
      return {
        ...state,
        [key]: {
          data: action?.data,
          loading: true,
          error: false,
        },
      };
    case `${type}_FAILURE`:
      return {
        ...state,
        [key]: {
          data: action?.data,
          loading: false,
          error: true,
        },
      };
    case `${type}_SUCCESS`:
      return {
        ...state,
        [key]: {
          data: mergeData(state, key, action),
          loading: false,
          error: false,
        },
      };
    case `${type}_CLEAR`:
      return {
        ...state,
        [key]: {
          data: null,
          loading: false,
          error: false,
        },
      };
    case `${type}_UPDATE`:
      return {
        ...state,
        [key]: {
          data: action.modificationFunction(state[key].data, action),
          loading: false,
          error: false,
        },
      };
    default:
      return state;
  }
}
