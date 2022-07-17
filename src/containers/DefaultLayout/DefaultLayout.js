import React, { useEffect } from "react";
import tw from "tailwind-styled-components";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { getVersion } from "../../actions/versionActions";
import { connect } from "react-redux";
import { AUTH_KEY, LOGIN_TOKEN } from "../../utils/Constants";
import { signOut } from "../../actions/userActions";

const MenuLink = tw(Link)`block p-2`;

function DefaultLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    if (
      !localStorage.getItem(AUTH_KEY) ||
      window.location.href.indexOf(LOGIN_TOKEN) > 0
    ) {
      navigate("/login");
    } else {
      getVersion();
    }
  }, []);

  return (
    <div className="app" data-test="defaultLayout">
      <div className="flex justify-between bg-black text-white text-sm font-medium">
        <div className="flex gap-1">
          <div className="flex items-center gap-1 p-1 mb-0">
            <div className="w-2 h-2 bg-green-400 rounded-full" />
            <p className="mb-0">Connected</p>
          </div>
          <p className="p-1 mb-0">
            <strong>BW:</strong> 100KiB/S
          </p>
          <p className="p-1 mb-0">
            <strong>AVG:</strong> 80KiB/S
          </p>
        </div>
        <div className="flex">
          <a
            href="#"
            className="p-1 mb-0 hover:bg-white hover:bg-opacity-20 text-white no-underline"
          >
            Tasks
          </a>
          <p className="pl-5 py-1 pr-1 mb-0">v1.59.1</p>
        </div>
      </div>

      <div className="flex gap-10">
        <Link to="/">RCLONE</Link>
        <ul className="flex gap-4">
          <li>
            <MenuLink to="/remoteExplorer">Explorer</MenuLink>
          </li>
          <li>
            <MenuLink to="/rcloneBackend">Backend</MenuLink>
          </li>
          <li>
            <MenuLink to="/mountDashboard">Mounts</MenuLink>
          </li>
          <li>
            <MenuLink to="/mountDashboard" onClick={(e) => signOut(e)}>
              Mounts
            </MenuLink>
          </li>
        </ul>
      </div>
      <div>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  isConnected: state.status.isConnected,
  version: state.version,
});

export default connect(mapStateToProps, { getVersion })(DefaultLayout);
