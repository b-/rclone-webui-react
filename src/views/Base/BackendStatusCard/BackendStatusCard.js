import React, { useEffect } from "react";
import { getStats } from "rclone-api";
import {
  IP_ADDRESS_KEY,
  STATUS_REFRESH_TIMEOUT,
} from "../../../utils/Constants";

function BackendStatusCard() {
  const [backendStatus, setBackendStatus] = React.useState();
  const [ipAddress, setIpAddress] = React.useState();

  const getStatus = () => {
    getStats().then((res) => setBackendStatus(res));
  };

  useEffect(() => {
    setIpAddress(localStorage.getItem(IP_ADDRESS_KEY));

    getStatus();

    const refreshInterval = setInterval(
      () => getStatus(),
      STATUS_REFRESH_TIMEOUT
    );

    return () => {
      clearInterval(refreshInterval);
    };
  }, []);

  return (
    <div className="flex flex-col border">
      <div className="bg-gray-200 px-2 py-1">Overview</div>
      <div className="p-2">
        <p>
          <span className={"card-subtitle"}>Current IP Address: </span>
          <span className="card-text">{ipAddress}</span>
        </p>
        <button type="primary" onClick={() => ""}>
          {backendStatus ? "Connected" : "Disconnected"}
        </button>
      </div>
    </div>
  );
}

export default BackendStatusCard;
