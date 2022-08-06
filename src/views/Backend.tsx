import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/API/API";
import urls from "../utils/API/endpoint";
import map from "lodash.map";
import { Link, Outlet } from "react-router-dom";
import { toast } from "react-toastify";
import { getRcloneVersion } from "rclone-api";

type Options = { OptionName: string };

interface Version {
  arch: string;
  decomposed: number[];
  goTags: string;
  goVersion: string;
  isBeta: boolean;
  isGit: boolean;
  linking: string;
  os: string;
  version: string;
}

function Backend() {
  const [version, setVersion] = useState<Version>();
  const [options, setOptions] = useState<Options[]>([]);

  useEffect(() => {
    axiosInstance
      .post(urls.getOptions)
      .then((res) => {
        const options = map(res.data, (options, key) => ({
          OptionName: key,
          ...options,
        }));
        setOptions(options);
      })
      .catch((e) => {
        toast.error("Rejected" + e);
      });

    getRcloneVersion().then(
      (res) => setVersion(res),
      (error) => toast.error(error)
    );
  }, []);

  return (
    <div className="flex flex-col px-10" data-test="backendComponent">
      <div className="w-full rounded-xl mb-4">
        <h1 className="text-4xl mb-3 font-black">Backend</h1>
        {version && (
          <ul className="flex gap-4">
            <li>
              <strong>Rclone </strong>
              {version.version}
            </li>
            <li>
              <strong>Arch </strong>
              {version.arch}
            </li>
            <li>
              <strong>goVersion </strong>
              {version.goVersion}
            </li>
            <li>
              <strong>OS </strong>
              {version.os}
            </li>

            <li>
              <strong>isGit </strong>
              {`${version.isGit}`}
            </li>
            <li>
              <strong>isBeta </strong>
              {`${version.isBeta}`}
            </li>
            <li>
              <strong>linking </strong>
              {`${version.linking}`}
            </li>
          </ul>
        )}
      </div>

      <div className="flex flex-row">
        <nav className="w-full md:w-1/4">
          <ul>
            {options &&
              options.map((option) => (
                <li key={option.OptionName}>
                  <Link
                    to={option.OptionName}
                    className="block uppercase py-1 text-lg"
                  >
                    {option.OptionName}
                  </Link>
                </li>
              ))}
          </ul>
        </nav>

        <div className="w-full md:w-3/4">
          <Outlet context={[options]} />
        </div>
      </div>
    </div>
  );
}
export default Backend;
