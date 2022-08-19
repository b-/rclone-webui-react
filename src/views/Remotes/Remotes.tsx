import React from "react";
import Remote from "./Remote";
import { useNavigate } from "react-router-dom";
import { getAllConfigDump } from "rclone-api";

// todo: remove any
function objectToArray(object: any) {
  const arr: any[] = [];
  for (const [key, value] of Object.entries(object)) {
    //@ts-ignore
    arr.push({ ...value, name: key });
  }

  return arr;
}

function Remotes() {
  const [remotes, setRemotes] = React.useState<any[]>([]);
  const navigate = useNavigate();

  React.useEffect(() => {
    updateRemotes();
  }, []);

  const updateRemotes = () =>
    getAllConfigDump().then((res) => {
      // todo: what type is res?
      console.log(res);
      setRemotes(objectToArray(res));
    });

  return (
    <div className="px-10">
      <h1 className="text-4xl mb-8 font-black">Remotes</h1>
      <button
        className="px-3 py-2 bg-black text-white mb-5 rounded-md"
        onClick={() => navigate("/newdrive")}
      >
        Create a new Remote
      </button>

      <div className="flex flex-wrap gap-2">
        {remotes.map((remote, index) => (
          <Remote key={index} name={remote.name} />
        ))}
      </div>
    </div>
  );
}

export default Remotes;
