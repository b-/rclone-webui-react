import React from "react";
import { connect } from "react-redux";
import {
  addRemoteContainer,
  changeActiveRemoteContainer,
  removeRemoteContainer,
} from "../../../actions/explorerActions";
import cn from "classnames";

function TabsLayout(props) {
  const {
    addRemoteContainer,
    removeRemoteContainer,
    changeActiveRemoteContainer,
    activeRemoteContainerID,
  } = props;
  const { containers, currentPaths, paneID: currentPaneID } = props;
  const activeContainerIDInPane = activeRemoteContainerID
    ? activeRemoteContainerID[currentPaneID]
    : "";
  return (
    <nav>
      <ul className="flex">
        {containers.map(({ ID, paneID }) => {
          if (currentPaneID === paneID) {
            const isActiveTab = ID === activeContainerIDInPane;
            return (
              <li
                key={"TAB_" + ID}
                className={cn("")}
                onAuxClick={() => removeRemoteContainer(ID, paneID)}
              >
                <button
                  className={cn(
                    "transition overflow-hidden p-2 rounded-tl-lg",
                    {
                      "bg-gray-200": isActiveTab,
                    }
                  )}
                  type="button"
                  onClick={() => changeActiveRemoteContainer(ID, paneID)}
                >
                  {currentPaths[ID] && currentPaths[ID].remoteName !== ""
                    ? currentPaths[ID].remoteName
                    : "New Tab"}
                </button>
                <button
                  className={cn(
                    "transition overflow-hidden p-2 rounded-tr-lg",
                    {
                      "bg-gray-200": isActiveTab,
                    }
                  )}
                  type="button"
                  onClick={() => removeRemoteContainer(ID, paneID)}
                >
                  &times; <span className="sr-only">Close tab</span>
                </button>
              </li>
            );
          }
          return null;
        })}
        <li key={"ADD_BUTTON"} className={"p-2"}>
          <button
            type="button"
            onClick={() => addRemoteContainer(currentPaneID)}
          >
            New Tab
          </button>
        </li>
      </ul>
    </nav>
  );
}

const mapStateToProps = (state, _) => {
  return {
    containers: state.remote.containers,
    numContainers: state.remote.numContainers,
    currentPaths: state.explorer.currentPaths,
    activeRemoteContainerID: state.remote.activeRemoteContainerID,
  };
};

export default connect(mapStateToProps, {
  addRemoteContainer,
  removeRemoteContainer,
  changeActiveRemoteContainer,
})(TabsLayout);
