import React from "react";
import {
  Button,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledButtonDropdown,
} from "reactstrap";
import * as PropTypes from "prop-types";
import * as RclonePropTypes from "../../../utils/RclonePropTypes";

function FileActions({ downloadHandle, deleteHandle, item, linkShareHandle }) {
  const confirmDelete = (deleteHandle, item) => {
    if (window.confirm(`Are you sure you want to delete ${item.Name}`)) {
      deleteHandle(item);
    }
  };

  const { IsDir } = item;
  // let {ID, Name} = item;
  // // Using fallback as fileName when the ID is not available (for local file system)
  // if (ID === undefined) {
  //     ID = Name;
  // }

  return (
    <div data-test="fileActionsComponent">
      {!IsDir && (
        <Button
          color="link"
          onClick={() => downloadHandle(item)}
          data-test="btn-download"
        >
          download
        </Button>
      )}
      <Button color="link">info</Button>

      <UncontrolledButtonDropdown>
        <DropdownToggle color="link">menu</DropdownToggle>
        <DropdownMenu>
          <DropdownItem header>Actions</DropdownItem>
          <DropdownItem
            data-test="btn-share-with-link"
            onClick={() => linkShareHandle(item)}
          >
            Share with link
          </DropdownItem>
          <DropdownItem divider />
          <DropdownItem
            data-test="btn-delete-item"
            onClick={() => confirmDelete(deleteHandle, item)}
          >
            Delete
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledButtonDropdown>
    </div>
  );
}

FileActions.propTypes = {
  downloadHandle: PropTypes.func.isRequired,
  deleteHandle: PropTypes.func.isRequired,
  item: RclonePropTypes.PROP_ITEM.isRequired,
  linkShareHandle: PropTypes.func.isRequired,
};

export default FileActions;
