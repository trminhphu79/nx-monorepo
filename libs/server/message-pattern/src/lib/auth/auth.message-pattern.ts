import { MICRO_SERVICE_NAMES } from '../microservice';

const MODULES_NAME = Object.freeze({
  AUTH: `${MICRO_SERVICE_NAMES.AUTH_SERVICE}/AUTH_MODULE`,
  PROFILE: `${MICRO_SERVICE_NAMES.AUTH_SERVICE}/PROFILE_MODULE`,
});

export const MESSAGE_PATTERN_AUTH = Object.freeze({
  CREATE: `${MODULES_NAME.AUTH}/create`,
  UPDATE: `${MODULES_NAME.AUTH}/update`,
  DELETE: `${MODULES_NAME.AUTH}/delete`,

  SIGN_IN: `${MODULES_NAME.AUTH}/sign-in`,
  REFRESH_TOKEN: `${MODULES_NAME.AUTH}/refresh-token`,
});

export const MESSAGE_PATTERN_PROFILE = Object.freeze({
  UPDATE: `${MODULES_NAME.PROFILE}/update`,
  ADD_FRIEND: `${MODULES_NAME.PROFILE}/add-friend`,
  SEARCH_FRIEND: `${MODULES_NAME.PROFILE}/search-friend`,
  GET_USER_FRIENDS: `${MODULES_NAME.PROFILE}/get-user-friend`,
});
