import React from "react";
import ConfigRow from "./ConfigRow";
import { useNavigate } from "react-router-dom";
import { getAllConfigDump } from "rclone-api";

function objectToArray(object: any) {
  const arr: any[] = [];
  for (const [key, value] of Object.entries(object)) {
    //@ts-ignore
    arr.push({ ...value, name: key });
  }

  return arr;
}

function ShowConfig() {
  const [remotes, setRemotes] = React.useState<any[]>([]);
  const navigate = useNavigate();

  React.useEffect(() => {
    updateRemotes();
  }, []);

  const updateRemotes = () =>
    getAllConfigDump().then((res) => {
      console.log(res);
      setRemotes(objectToArray(res));
    });

  return (
    <div className="px-10" data-test="showConfigComponent">
      <h1 className="text-4xl mb-8 font-black">Remotes</h1>
      <button
        className="px-3 py-2 bg-black text-white mb-5 rounded-md"
        onClick={() => navigate("/newdrive")}
      >
        Create a new Remote
      </button>

      <div className="flex gap-4">
        {remotes.map((remote, index) => (
          <ConfigRow
            key={index}
            remoteName={remote.name}
            remote={remote}
            refreshHandle={updateRemotes}
          />
        ))}
      </div>
    </div>
  );
}

export default ShowConfig;
