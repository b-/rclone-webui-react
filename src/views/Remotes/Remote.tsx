import React from "react";
import { Link } from "react-router-dom";

function Remote({ name }: { name: string }) {
  return (
    <div className="flex">
      <Link to="/remoteExplorer" className="px-3 py-2 bg-gray-100 rounded-l-lg">
        {name}
      </Link>
      <Link
        to={`/newdrive/edit/${name}`}
        className="px-3 py-2 bg-gray-200  rounded-r-lg"
      >
        Edit
      </Link>
    </div>
  );
}

export default Remote;
