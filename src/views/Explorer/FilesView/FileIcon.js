import React from "react";
import * as PropTypes from "prop-types";

const mimeClassMap = {
  "application/pdf": "file-pdf-o",
  "image/jpeg": "file-image-o",
  "application/rar": "file-archive-o",
  "application/x-rar-compressed": "file-archive-o",
  "application/zip": "file-archive-o",
  "text/plain": "file-text-o",
  "text/x-vcard": "address-card-o",
};

function FileIcon({ IsDir, MimeType }) {
  let className = mimeClassMap[MimeType];
  if (IsDir) return <span data-test="fileIconComponent">foldericon</span>;
  if (!IsDir) return <span data-test="fileIconComponent">fa-file</span>;
  return <span data-test="fileIconComponent">{className}</span>;
}

FileIcon.propTypes = {
  IsDir: PropTypes.bool.isRequired,
  MimeType: PropTypes.string.isRequired,
};

export default FileIcon;
