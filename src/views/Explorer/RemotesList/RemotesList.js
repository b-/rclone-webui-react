import React from "react";
import RemoteListAutoSuggest from "./RemoteListAutoSuggest";
import { connect } from "react-redux";
import { getFsInfo, getRemoteNames } from "../../../actions/explorerActions";
import PropTypes from "prop-types";
import { changeRemoteName } from "../../../actions/explorerStateActions";
import { PROP_CURRENT_PATH } from "../../../utils/RclonePropTypes";

class RemotesList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEmpty: false,
      remoteName: props.remoteName,
      openEnabled: false,
      openButtonText: "Open",
    };
  }

  componentDidMount() {
    this.props.getRemoteNames();
  }

  shouldUpdateRemoteName = (event) => {
    const newValue = event.target.value;

    this.setState({
      remoteName: newValue,
      openButtonText: "Open",
    });
  };

  openRemote = (e) => {
    e.preventDefault();
    const { handleChangeRemoteName } = this.props;
    const { remoteName } = this.state;

    handleChangeRemoteName(remoteName);
  };

  render() {
    const { isEmpty, remoteName } = this.state;
    const { remotes } = this.props;
    const { hasError } = this.props;

    if (hasError) return <div>Error loading remotes. Please try again.</div>;
    if (isEmpty) return <div>Add some remotes to see them here.</div>;

    return (
      <form onSubmit={this.openRemote} className="flex">
        <RemoteListAutoSuggest
          value={remoteName}
          onChange={this.shouldUpdateRemoteName}
          suggestions={remotes}
        />
        <button
          type="submit"
          className={"px-2 py-1 bg-black text-white font-bold uppercase"}
        >
          {this.state.openButtonText}
        </button>
      </form>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  remotes: state.remote.remotes,
  hasError: false,
  error: state.remote.error,
  currentPath: state.explorer.currentPaths[ownProps.containerID],
});

const propTypes = {
  remotes: PropTypes.array.isRequired,
  error: PropTypes.object,
  hasError: PropTypes.bool,
  currentPath: PROP_CURRENT_PATH,
  handleChangeRemoteName: PropTypes.func.isRequired,
};

const defaultProps = {};

RemotesList.propTypes = propTypes;
RemotesList.defaultProps = defaultProps;

export default connect(mapStateToProps, {
  getRemoteNames,
  getFsInfo,
  changeRemoteName,
})(RemotesList);
