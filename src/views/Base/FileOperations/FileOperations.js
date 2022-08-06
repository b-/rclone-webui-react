import React from "react";
import {
  ButtonDropdown,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Form,
  FormGroup,
  Input,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  Spinner,
} from "reactstrap";
import NewFolder from "../NewFolder/NewFolder";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  changeGridMode,
  changePath,
  changeVisibilityFilter,
  getFilesForContainerID,
  navigateBack,
  navigateFwd,
  setLoadImages,
  setSearchQuery,
} from "../../../actions/explorerStateActions";
import { visibilityFilteringOptions } from "../../../utils/Constants";
import { getAboutRemote } from "../../../actions/providerStatusActions";
import { Doughnut } from "react-chartjs-2";
import { bytesToGB, isEmpty } from "../../../utils/Tools";
import { toast } from "react-toastify";
import { PROP_FS_INFO } from "../../../utils/RclonePropTypes";
import { cleanTrashForRemote } from "rclone-api";
import { createSelector } from "reselect";
import FileUploadModal from "./FileUploadModal";

function getUrl(currentPath) {
  const { remoteName, remotePath } = currentPath;
  return `${remoteName}:/${remotePath}`;
}

/**
 * File Operations component which handles user actions for files in the remote.( Visibility, gridmode, back, forward etc)
 */
class FileOperations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newFolderModalIsVisible: false,
      isAboutModalOpen: false,
      dropdownOpen: false,
      searchOpen: false,
      tempUrl: getUrl(props.currentPath),
      isUrlBarFocused: false,
    };
    this.filterOptions = visibilityFilteringOptions;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.currentPath !== this.props.currentPath) {
      this.setState({ tempUrl: getUrl(this.props.currentPath) });
    }
  }

  openNewFolderModal = () => {
    const { fsInfo } = this.props;
    if (fsInfo && fsInfo.Features && fsInfo.Features.CanHaveEmptyDirectories) {
      this.setState({ newFolderModalIsVisible: true });
    } else {
      toast.error("This remote cannot have empty directories");
    }
  };

  closeNewFolderModal = () => {
    this.setState({ newFolderModalIsVisible: false });
  };

  handleChangeFilter = (e) => {
    const newFilter = e.target.value;

    const { changeVisibilityFilter } = this.props;

    changeVisibilityFilter(this.props.containerID, newFilter);
  };

  handleChangeGridMode = () => {
    const { gridMode, changeGridMode, containerID } = this.props;
    changeGridMode(containerID, gridMode === "list" ? "card" : "list");
  };

  changeSearch = (e) => {
    e.preventDefault();
    const { containerID, setSearchQuery } = this.props;
    setSearchQuery(containerID, e.target.value);
  };

  toggleDropDown = () => {
    this.setState((prevState) => {
      return {
        dropdownOpen: !prevState.dropdownOpen,
      };
    });
  };

  toggleAboutModal = () => {
    const { fsInfo } = this.props;
    if (fsInfo && fsInfo.Features && fsInfo.Features.About) {
      this.setState(
        (prevState) => {
          return {
            isAboutModalOpen: !prevState.isAboutModalOpen,
          };
        },
        () => {
          if (this.state.isAboutModalOpen) {
            const { containerID } = this.props;
            this.props.getAboutRemote(containerID);
          }
        }
      );
    } else {
      toast.error("This remote does not support About");
    }
  };

  handleCleanTrash = () => {
    const { fsInfo } = this.props;
    if (fsInfo && fsInfo.Features && fsInfo.Features.CleanUp) {
      if (
        window.confirm(
          "Are you sure you want to clear the trash. This operation cannot be undone"
        )
      ) {
        const { currentPath, containerID } = this.props;
        let { remoteName } = currentPath;

        cleanTrashForRemote(remoteName).then(
          (res) => {
            if (res.status === 200) {
              toast("Trash Cleaned");
              this.props.getAbout(containerID);
            }
          },
          (err) => {
            toast.error("Error clearing trash " + err);
          }
        );
      }
    } else {
      // Cleanup is not allowed
      toast.error("Clearing trash is not allowed on this remote");
    }
  };

  changeLoadMedia = (e) => {
    e.stopPropagation();
    const { setLoadImages, containerID, loadImages } = this.props;
    setLoadImages(containerID, !loadImages);
  };

  handleSearchOpen = () => {
    const { containerID } = this.props;
    this.setState((prevState) => {
      if (prevState.searchOpen) {
        // Clear Search Query if the search is about to close
        this.props.setSearchQuery(containerID, "");
      }

      return { searchOpen: !prevState.searchOpen };
    });
  };

  onChangeTrial = (e) =>
    this.setState({
      tempUrl: e.target.value,
    });
  onFocusHandle = (_) =>
    this.setState({
      isUrlBarFocused: true,
      tempUrl: getUrl(this.props.currentPath),
    });

  onBlurHandle = (_) =>
    this.setState({
      isUrlBarFocused: false,
      tempUrl: getUrl(this.props.currentPath),
    });

  onSubmitUrlChange = (e) => {
    e.preventDefault();
    const { changePath, containerID, currentPath } = this.props;
    const { tempUrl } = this.state;
    let urlSplits = tempUrl.split(":/");
    if (
      urlSplits &&
      urlSplits[0] &&
      (currentPath.remoteName !== urlSplits[0] ||
        currentPath.remotePath !== urlSplits[1])
    )
      changePath(containerID, urlSplits[0], urlSplits[1]);
  };

  render() {
    const {
      containerID,
      getFilesForContainerID,
      gridMode,
      navigateFwd,
      navigateBack,
      searchQuery,
      currentPath,
      doughnutData,
    } = this.props;
    const {
      newFolderModalIsVisible,
      dropdownOpen,
      isAboutModalOpen,
      searchOpen,
      tempUrl,
      isUrlBarFocused,
    } = this.state;

    const { remoteName } = currentPath;

    return (
      <div className="flex gap-3 pt-4">
        <button onClick={() => navigateBack(containerID)}>Back</button>
        <button onClick={() => navigateFwd(containerID)}>Forward</button>
        <button
          id="RefreshButton"
          onClick={() => getFilesForContainerID(containerID)}
        >
          Reload
        </button>
        <form
          className="flex flex-grow h-full"
          onSubmit={this.onSubmitUrlChange}
        >
          <input
            className="w-full rounded-xl px-3"
            value={tempUrl}
            onChange={this.onChangeTrial}
            onFocus={this.onFocusHandle}
            onBlur={this.onBlurHandle}
          />
          <button className={isUrlBarFocused ? "" : "hidden"} type={"submit"}>
            GO
          </button>
        </form>
        <button onClick={this.openNewFolderModal}>New folder</button>

        <ButtonDropdown
          className="hidden"
          isOpen={dropdownOpen}
          toggle={this.toggleDropDown}
          direction={"down"}
          id="FilterButton"
        >
          <DropdownToggle className="btn-explorer-action">
            Filter
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem
              key={"None"}
              value={""}
              onClick={this.handleChangeFilter}
            >
              None
            </DropdownItem>
            {this.filterOptions.map((item, _) => {
              return (
                <DropdownItem
                  key={item}
                  value={item}
                  onClick={this.handleChangeFilter}
                >
                  {item}
                </DropdownItem>
              );
            })}
          </DropdownMenu>
        </ButtonDropdown>

        <button
          className="btn-explorer-action"
          id="ListViewButton"
          onClick={this.handleChangeGridMode}
        >
          List view
        </button>

        <button
          className="btn-explorer-action"
          id="InfoButton"
          onClick={this.toggleAboutModal}
        >
          Info
        </button>
        <FileUploadModal
          currentPath={currentPath}
          buttonLabel={"Upload"}
          buttonClass={"btn-explorer-action"}
        />
        <Form inline>
          <FormGroup>
            {searchOpen && (
              <Input
                type="text"
                placeholder="Search"
                value={searchQuery}
                className="animate-fade-in"
                onChange={this.changeSearch}
              />
            )}
            <button
              color=""
              className="mr-1 btn-explorer-action"
              onClick={this.handleSearchOpen}
            >
              Search / close
            </button>
          </FormGroup>
        </Form>

        <NewFolder
          containerID={containerID}
          isVisible={newFolderModalIsVisible}
          closeModal={this.closeNewFolderModal}
        />

        <Modal isOpen={isAboutModalOpen} toggle={this.toggleAboutModal}>
          <ModalHeader>Status for {remoteName}</ModalHeader>
          <ModalBody>
            <Row>
              <Col sm={12}>
                <div className="chart-wrapper">
                  <p>Space Usage (in GB)</p>
                  {doughnutData && !isEmpty(doughnutData) ? (
                    <Doughnut data={doughnutData} />
                  ) : (
                    <React.Fragment>
                      <Spinner color="primary" />
                      Loading
                    </React.Fragment>
                  )}
                </div>
              </Col>
            </Row>
            <Row>
              <Col sm={12}>
                <button color="danger" onClick={this.handleCleanTrash}>
                  Clean Trash
                </button>
              </Col>
            </Row>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

FileOperations.propTypes = {
  /**
   * Container ID of the current remote explorer
   */
  containerID: PropTypes.string.isRequired,
  /**
   * Redux function to change the visibility of images/ pdf etc.
   */
  changeVisibilityFilter: PropTypes.func.isRequired,
  /**
   * The current visibility filter setting
   */
  visibilityFilter: PropTypes.string,
  /**
   * Render mode: Grid/Card
   */
  gridMode: PropTypes.string,
  /**
   * Redux function to set the search query as typed by user.
   */
  setSearchQuery: PropTypes.func.isRequired,
  /**
   * Currently set search Query from redux
   */
  searchQuery: PropTypes.string,
  /**
   * A map which gives the information about the remote about.
   */
  remoteAbout: PropTypes.object,
  /**
   * File system information and features about the current remote
   */
  fsInfo: PROP_FS_INFO,
  /**
   * Map of data to be passed to the doughnutChart.
   */
  doughnutData: PropTypes.object,

  /**
   * Number of columns
   */
  numCols: PropTypes.number.isRequired,
};

const getDoughnutData = createSelector(
  (state, props) => props.containerID,
  (state, props) => state.providerStatus.about[props.containerID],
  (containerID, remoteAbout) => {
    if (!remoteAbout) return {};

    let labels = [];
    let data = [];

    for (const [key, value] of Object.entries(remoteAbout)) {
      if (key !== "total") {
        labels.push(key);
        data.push(bytesToGB(value).toFixed(2));
      }
    }
    if (labels.length > 1 && data.length > 1) {
      return {
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#ff7459"],
            hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#ff7459"],
          },
        ],
      };
    }
    return {};
  }
);

const getFsInfoSelector = createSelector(
  (state, props) => props.containerID,
  (state, props) => state.explorer.currentPaths[props.containerID],
  (state, props) => state.remote.configs,
  (containerID, currentPath, configs) => {
    if (currentPath && configs && configs[currentPath.remoteName]) {
      return configs[currentPath.remoteName];
    }
    return {};
  }
);

const mapStateToProps = (state, ownProps) => {
  let doughnutData = getDoughnutData(state, ownProps);
  let fsInfo = getFsInfoSelector(state, ownProps);
  return {
    visibilityFilter: state.explorer.visibilityFilters[ownProps.containerID],
    loadImages: state.explorer.loadImages[ownProps.containerID],
    currentPath: state.explorer.currentPaths[ownProps.containerID],
    gridMode: state.explorer.gridMode[ownProps.containerID],
    searchQuery: state.explorer.searchQueries[ownProps.containerID],
    fsInfo,
    doughnutData,
    numCols: state.remote.numCols,
  };
};

export default connect(mapStateToProps, {
  changeVisibilityFilter,
  changeGridMode,
  navigateBack,
  navigateFwd,
  getFilesForContainerID,
  setSearchQuery,
  getAboutRemote,
  setLoadImages,
  changePath,
})(FileOperations);
