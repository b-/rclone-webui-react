import React from "react";
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledButtonDropdown,
} from "reactstrap";
import * as PropTypes from "prop-types";
import * as RclonePropTypes from "../../../utils/RclonePropTypes";
import cn from "classnames";
import useDropdownMenu from "react-accessible-dropdown-menu-hook";

function FileActions({ downloadHandle, deleteHandle, item, linkShareHandle }) {
  const { buttonProps, itemProps, isOpen } = useDropdownMenu(2);

  const confirmDelete = (deleteHandle, item) => {
    if (window.confirm(`Are you sure you want to delete ${item.Name}`)) {
      deleteHandle(item);
    }
  };

  const { IsDir } = item;

  return (
    <div data-test="fileActionsComponent">
      {!IsDir && (
        <button onClick={() => downloadHandle(item)} data-test="btn-download">
          download
        </button>
      )}

      <div>
        <button {...buttonProps}>Actions</button>
        <div
          className={cn(
            "absolute bg-white p-2 rounded-xl flex-col gap-2 shadow-md",
            {
              flex: isOpen,
              hidden: !isOpen,
            }
          )}
          role="menu"
        >
          <button
            className={
              "text-left px-3 py-1 rounded-lg hover:bg-gray-200 focus-within:bg-gray-200"
            }
            {...itemProps[0]}
            onClick={() => linkShareHandle(item)}
          >
            Share with a link
          </button>
          <button
            className={
              "text-left px-3 py-1 rounded-lg hover:bg-gray-200 focus-within:bg-gray-200"
            }
            {...itemProps[1]}
            onClick={() => confirmDelete(deleteHandle, item)}
          >
            Delete
          </button>
        </div>
      </div>

      <UncontrolledButtonDropdown className="hidden">
        <DropdownToggle color="link">menu</DropdownToggle>
        <DropdownMenu>
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
