import React, { useEffect } from "react";
import { getVersion } from "../actions/versionActions";
import { getStats } from "rclone-api";
import { connect } from "react-redux";
import { IP_ADDRESS_KEY, STATUS_REFRESH_TIMEOUT } from "../utils/Constants";
import { ExclamationIcon } from "@heroicons/react/solid";
import { validateSizeSuffix } from "../utils/Tools";
import { toast } from "react-toastify";
import {
  getCurrentBandwidthSetting,
  setCurrentBandwidthSetting,
} from "rclone-api";

function DefaultLayout() {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [bandwidth, setBandwidth] = React.useState();
  const [backendStatus, setBackendStatus] = React.useState();
  const [ipAddress, setIpAddress] = React.useState("");

  const getStatus = () => {
    getStats().then((res) => setBackendStatus(res));
  };

  useEffect(() => {
    getCurrentBandwidthSetting().then((res) => setBandwidth(res.rate));
    setIpAddress(localStorage.getItem(IP_ADDRESS_KEY) || "");

    getStatus();

    const refreshInterval = setInterval(
      () => getStatus(),
      STATUS_REFRESH_TIMEOUT
    );

    return () => {
      clearInterval(refreshInterval);
    };
  }, []);

  /**
   * Set the new bandwidth specified in state.bandwidthText
   * Check if text is valid, before sending.
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!inputRef.current?.value || !isValid(inputRef.current.value)) {
      toast.error("Please check the errors before submitting");
      return;
    }

    if (inputRef.current.value) {
      setCurrentBandwidthSetting(inputRef.current.value).then((res) =>
        setBandwidth(res)
      );
    } else {
      setCurrentBandwidthSetting("0M").then((res) => setBandwidth(res));
    }
    toast.success("Success");
  };

  /**
   * Change the state.bandwidthText
   * Validate input before setting, if the input text is invalid, set the hasError in the state.
   * @param e
   */
  const isValid = (value) => {
    if (value === "") return true;

    const splitValue = value.split(":");
    if (splitValue.length === 1 && validateSizeSuffix(splitValue[0]))
      return true;
    if (
      splitValue.length === 2 &&
      validateSizeSuffix(splitValue[0]) &&
      validateSizeSuffix(splitValue[1])
    )
      return true;
    return false;
  };

  return (
    <div className="flex px-10 justify-between bg-black text-white text-sm font-medium">
      <div className="flex gap-1">
        <div className="flex items-center gap-1 mb-0">
          {backendStatus ? (
            <>
              <div className="ml-1 w-2 h-2 bg-green-400 rounded-full" />
              <p className="mb-0" title={`Connected to: ${ipAddress}`}>
                Connected
              </p>
              <div className="flex mb-0">
                <p className="px-1 mb-0">
                  <strong>BW:</strong> 100KiB/S
                </p>
                <p className="px-1 mb-0">
                  <strong>AVG:</strong> 80KiB/S
                </p>
              </div>
              <form onSubmit={handleSubmit} className="flex h-full">
                <input
                  ref={inputRef}
                  className="placeholder:text-gray-100 px-1 h-full font-mono bg-gray-700 outline-none"
                  placeholder="Set bandwidth limit"
                  type="text"
                  defaultValue={bandwidth}
                  id="bandwidthValue"
                  title="The bandwidth should be of the form 1M|2M|1G|1K|1.1K etc. Can also be specified as (upload:download). Make empty to reset."
                />
                <button
                  type="submit"
                  className="bg-gray-600 px-2 text-white h-full uppercase font-bold"
                >
                  Set
                </button>
              </form>
            </>
          ) : (
            <>
              <ExclamationIcon className="h-4 w-4 fill-amber-400 -mb-0.5" />
              <p className="mb-0">Disconnected</p>
            </>
          )}
        </div>
      </div>
      <div className="flex items-center">
        <button
          type="button"
          className="h-full p-1 mb-0 hover:bg-white hover:bg-opacity-20 text-white no-underline"
        >
          Tasks
        </button>
        <p className="pl-5 py-1 pr-1 mb-0">v1.59.1</p>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  version: state.version,
});

export default connect(mapStateToProps, { getVersion })(DefaultLayout);
