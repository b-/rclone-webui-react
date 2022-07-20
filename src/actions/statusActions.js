import {
  ENABLE_STATUS_CHECK,
  FETCH_STATUS,
  REQUEST_ERROR,
  REQUEST_SUCCESS,
} from "./types";
import { getStats } from "rclone-api";

/**
 * Gets the current status of the rclone backend.
 * Depends upon state.status.checkStatus to execute the http request, if set to false, does not send any http request
 * @returns {Function}
 */
export const getStatus = () => async (dispatch, getState) => {
  // console.log("get Status");
  const { status } = getState();
  if (status.checkStatus) {
    getStats().then(
      (res) =>
        dispatch({
          type: FETCH_STATUS,
          status: REQUEST_SUCCESS,
          payload: res,
        }),
      (error) =>
        dispatch({
          type: FETCH_STATUS,
          status: REQUEST_ERROR,
          payload: error,
        })
    );
  }
};

/**
 * Enables or disables the check status functionality to improve network performance.
 * Modifies state.status.checkStatus according to the passed value.
 * @param shouldEnable {boolean} It specifies whether to check for status updates from the backend or skip checking it
 * @returns {Function}
 */
export const enableCheckStatus = (shouldEnable) => async (dispatch) => {
  dispatch({
    type: ENABLE_STATUS_CHECK,
    payload: shouldEnable,
  });
};
