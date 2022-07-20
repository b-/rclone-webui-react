import React from "react";
import { Button, Col, Row } from "reactstrap";

import { connect } from "react-redux";
import { createPath } from "../../../actions/explorerStateActions";
import * as PropTypes from "prop-types";
import {
  addRemoteContainer,
  changeDistractionFreeMode,
  changeNumCols,
} from "../../../actions/explorerActions";
import ErrorBoundary from "../../../ErrorHandling/ErrorBoundary";

import singlePaneImg from "../../../assets/img/single-pane.png";
import doublePaneImg from "../../../assets/img/double-pane1.png";
import triplePaneImg from "../../../assets/img/triple-pane.png";
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

  toggleDistractionFreeMode = (_) => {
    const { distractionFreeMode, changeDistractionFreeMode } = this.props;
    // this.setState((prevState) => ({
    //     distractionFreeMode: !prevState.distractionFreeMode
    // }));
    changeDistractionFreeMode(!distractionFreeMode);
  };

  render() {
    /*Divide the 12 bootstrap columns to fit number of explorers*/
    const {
      numCols,
      distractionFreeMode,
      activeRemoteContainerID,
      containers,
    } = this.props;
    return (
      <ErrorBoundary>
        <DndProvider backend={HTML5Backend}>
          <Row className={"d-none d-md-block"} data-test="remoteExplorerLayout">
            {distractionFreeMode && (
              <div className="clearfix float-right">
                <Button
                  color={"success"}
                  className={"ml-2"}
                  onClick={this.toggleDistractionFreeMode}
                >
                  distraction free mode
                </Button>
              </div>
            )}

            {!distractionFreeMode && (
              <Col sm={12} lg={12} className="mb-3 d-none d-md-block">
                <Button
                  color={"primary"}
                  className={"ml-2 layout-change-button"}
                  onClick={() => this.changeLayout(1, "horizontal")}
                >
                  <div className="flex p-1 gap-1 w-9 h-5 bg-gray-400">
                    <div className="w-2.5 bg-white"></div>
                  </div>
                  <span className="sr-only">Single Vertical Pane</span>
                </Button>
                <Button
                  color={"primary"}
                  className={"ml-2 layout-change-button"}
                  onClick={() => this.changeLayout(2, "horizontal")}
                >
                  <div className="flex p-1 gap-1 w-9 h-5 bg-gray-400">
                    <div className="w-3 bg-white"></div>
                    <div className="w-3 bg-white"></div>
                  </div>
                  <span className="sr-only">Double Vertical Pane</span>
                </Button>
                <Button
                  color={"primary"}
                  className={"ml-2 layout-change-button"}
                  onClick={() => this.changeLayout(3, "horizontal")}
                >
                  <div className="flex p-1 gap-1 w-9 h-5 bg-gray-400">
                    <div className="w-2 bg-white"></div>
                    <div className="w-2 bg-white"></div>
                    <div className="w-2 bg-white"></div>
                  </div>
                  <span className="sr-only">Triple Vertical Pane</span>
                </Button>

                <Button
                  color={"success"}
                  className={"bg-gray-100 ml-2"}
                  onClick={this.toggleDistractionFreeMode}
                >
                  Full Screen
                </Button>
                {/*<Button onClick={this.changeLayout(4,"grid")}>4 - grid</Button>*/}
              </Col>
            )}
          </Row>

          <div className="flex">
            <TabbedPanes
              numCols={numCols}
              distractionFreeMode={distractionFreeMode}
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
  distractionFreeMode: state.remote.distractionFreeMode,
  splitMode: state.remote.splitMode,
  activeRemoteContainerID: state.remote.activeRemoteContainerID,
  containers: state.remote.containers,
});

RemoteExplorerLayout.propTypes = {
  backStacks: PropTypes.object.isRequired,
  createPath: PropTypes.func.isRequired,
  changeNumCols: PropTypes.func.isRequired,
  distractionFreeMode: PropTypes.bool.isRequired,
  activeRemoteContainerID: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, {
  createPath,
  changeNumCols,
  changeDistractionFreeMode,
  addRemoteContainer,
})(RemoteExplorerLayout);
