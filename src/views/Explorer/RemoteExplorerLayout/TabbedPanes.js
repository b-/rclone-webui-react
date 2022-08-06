import TabsLayout from "../TabsLayout/TabsLayout";
import RemoteExplorer from "../RemoteExplorer";
import React from "react";
import * as PropTypes from "prop-types";

const TabbedPanes = ({
  numCols,
  activeRemoteContainerID,
  distractionFreeMode,
  containers,
}) => {
  let returnData = [];
  for (let pane = 0; pane < numCols; pane++) {
    returnData.push(
      <div className="w-full">
        <div id="here">
          <TabsLayout paneID={pane} />
        </div>
        {containers.map(({ ID, paneID }) => {
          if (paneID === pane) {
            return (
              <RemoteExplorer
                containerID={ID}
                key={ID}
                className={
                  activeRemoteContainerID &&
                  activeRemoteContainerID[pane] &&
                  activeRemoteContainerID[pane] !== ID
                    ? "d-none"
                    : ""
                }
                distractionFreeMode={distractionFreeMode}
              />
            );
          } else {
            return null;
          }
        })}
      </div>
    );
  }
  return returnData;
};

TabbedPanes.propTypes = {
  numCols: PropTypes.number.isRequired,
  activeRemoteContainerID: PropTypes.object.isRequired,
  distractionFreeMode: PropTypes.bool.isRequired,
  containers: PropTypes.array.isRequired,
};

export default TabbedPanes;
