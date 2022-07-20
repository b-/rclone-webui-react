import React from "react";
import { validateSizeSuffix } from "../../../utils/Tools";
import { toast } from "react-toastify";
import {
  getCurrentBandwidthSetting,
  setCurrentBandwidthSetting,
} from "rclone-api";

function BandwidthStatusCard() {
  const [bandwidth, setBandwidth] = React.useState();
  const [bandwidthText, setBandwidthText] = React.useState("");
  const [hasError, setHasError] = React.useState(false);

  /**
   * Set the new bandwidth specified in state.bandwidthText
   * Check if text is valid, before sending.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (hasError) {
      toast.error("Please check the errors before submitting");
      return false;
    }

    if (bandwidthText) {
      setCurrentBandwidthSetting(bandwidthText).then((res) =>
        setBandwidth(res)
      );
    } else {
      setCurrentBandwidthSetting("0M").then((res) => setBandwidth(res));
    }
  };

  /**
   * Change the state.bandwidthText
   * Validate input before setting, if the input text is invalid, set the hasError in the state.
   * @param e
   */
  const changeBandwidthInput = (e) => {
    const inputValue = e.target.value;
    let validateInput = false;
    if (inputValue === "") {
      validateInput = true;
    } else {
      const splitValue = inputValue.split(":");
      if (splitValue.length === 1) {
        validateInput = validateSizeSuffix(splitValue[0]);
      } else if (splitValue.length === 2) {
        const validateDownloadLimit = validateSizeSuffix(splitValue[0]);
        const validateUploadLimit = validateSizeSuffix(splitValue[1]);
        validateInput = validateDownloadLimit && validateUploadLimit;
      }
    }
    setBandwidthText(inputValue);
    setHasError(!validateInput);
  };

  React.useEffect(() => {
    getCurrentBandwidthSetting().then((res) => setBandwidth(res));
  }, []);

  return (
    <div className="border mb-2">
      <div className="bg-gray-200 px-2 py-1">Bandwidth</div>
      <div className="px-2 py-2">
        <p>Current Max speed: {bandwidth?.rate}</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="bandwidthValue">
              Enter new max speed (upload:download)
            </label>
            <div className="mb-3">
              <input
                className="border"
                type="text"
                value={bandwidthText}
                valid={!hasError}
                invalid={hasError}
                id="bandwidthValue"
                onChange={changeBandwidthInput}
              />
              <p className="text-gray-600">
                The bandwidth should be of the form 1M|2M|1G|1K|1.1K etc. Can
                also be specified as (upload:download). Make empty to reset.
              </p>
            </div>
          </div>
          <button type="submit" className="bg-black px-4 text-white">
            Set
          </button>
        </form>
      </div>
    </div>
  );
}

export default BandwidthStatusCard;
