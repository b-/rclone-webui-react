import React from "react";
import { connect } from "react-redux";
import { createPath } from "../../../actions/explorerStateActions";
import * as PropTypes from "prop-types";
import {
  addRemoteContainer,
  changeNumCols,
} from "../../../actions/explorerActions";
import ErrorBoundary from "../../../ErrorHandling/ErrorBoundary";
import TabbedPanes from "./TabbedPanes";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

class RemoteExplorerLayout extends React.Component {
  changeLayout = (nos, mode) => {
    const { changeNumCols } = this.props;
    // Check if the current layout is not same as previous
    if (nos !== changeNumCols) {
      changeNumCols(nos, mode);
    }
  };

  componentDidMount() {
    //Load one explorer layout
    const { numContainers, addRemoteContainer } = this.props;

    if (numContainers < 1) {
      addRemoteContainer(0);
    }
  }

  render() {
    const { numCols, activeRemoteContainerID, containers } = this.props;
    return (
      <ErrorBoundary>
        <DndProvider backend={HTML5Backend}>
          <div className={"d-none d-md-block"} data-test="remoteExplorerLayout">
            <div>
              <button
                className={"ml-2 layout-change-button"}
                onClick={() => this.changeLayout(1, "horizontal")}
              >
                <div className="flex p-1 gap-1 w-9 h-5 bg-gray-400">
                  <div className="w-2.5 bg-white"></div>
                </div>
                <span className="sr-only">Single Vertical Pane</span>
              </button>
              <button
                className={"ml-2 layout-change-button"}
                onClick={() => this.changeLayout(2, "horizontal")}
              >
                <div className="flex p-1 gap-1 w-9 h-5 bg-gray-400">
                  <div className="w-3 bg-white"></div>
                  <div className="w-3 bg-white"></div>
                </div>
                <span className="sr-only">Double Vertical Pane</span>
              </button>
              <button
                className={"ml-2 layout-change-button"}
                onClick={() => this.changeLayout(3, "horizontal")}
              >
                <div className="flex p-1 gap-1 w-9 h-5 bg-gray-400">
                  <div className="w-2 bg-white"></div>
                  <div className="w-2 bg-white"></div>
                  <div className="w-2 bg-white"></div>
                </div>
                <span className="sr-only">Triple Vertical Pane</span>
              </button>
            </div>
          </div>

          <div className="flex">
            <TabbedPanes
              numCols={numCols}
              activeRemoteContainerID={activeRemoteContainerID}
              containers={containers}
            />
          </div>
        </DndProvider>
      </ErrorBoundary>
    );
  }
}

const mapStateToProps = (state) => ({
  backStacks: state.explorer.backStacks,
  numCols: state.remote.numCols,
  numContainers: state.remote.numContainers,
  splitMode: state.remote.splitMode,
  activeRemoteContainerID: state.remote.activeRemoteContainerID,
  containers: state.remote.containers,
});

RemoteExplorerLayout.propTypes = {
  backStacks: PropTypes.object.isRequired,
  createPath: PropTypes.func.isRequired,
  changeNumCols: PropTypes.func.isRequired,
  activeRemoteContainerID: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, {
  createPath,
  changeNumCols,
  addRemoteContainer,
})(RemoteExplorerLayout);
