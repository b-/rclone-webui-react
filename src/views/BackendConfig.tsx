import React from "react";
import { useOutletContext, useParams } from "react-router-dom";
import map from "lodash.map";

export default function BackendConfig() {
  //@ts-ignore
  const [options] = useOutletContext();
  const { config } = useParams();

  const option = options.filter((opt) => opt.OptionName === config)[0];
  console.log(option);
  if (!option) return <p>Error</p>;

  if (config === "rc") return <p>RC tab not supported at this time.</p>;

  return (
    <div>
      <h2 className="text-2xl mb-3 font-black uppercase">
        {option.OptionName}
      </h2>

      <table className="w-1/2 bg-gray-100">
        {map(option, (value, setting) => (
          <tr>
            <td className="px-1">
              <strong>{setting} </strong>
            </td>

            <td className="px-1">{value}</td>
          </tr>
        ))}
      </table>
    </div>
  );
}
