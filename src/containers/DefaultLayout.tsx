import React, { useEffect } from "react";
import { Outlet, Link, NavLink, useNavigate } from "react-router-dom";
import { getVersion } from "../actions/versionActions";
import { connect } from "react-redux";
import { AUTH_KEY, LOGIN_TOKEN } from "../utils/Constants";
import { signOut } from "../actions/userActions";
import logo from "../assets/img/brand/logo.svg";
import cn from "classnames";
import DefaultLayoutStatusbar from "./DefaultLayoutStatusbar";

const MenuLink = ({ to, children }) => (
  <NavLink
    className={(isActive) =>
      cn("flex items-center px-4 py-5 text-black font-medium no-underline", {
        "font-bold": isActive,
      })
    }
    to={to}
  >
    {children}
  </NavLink>
);

function DefaultLayout() {
  const navigate = useNavigate();

  // @todo: something to do with authentication, could be extracted to a custom hook
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
    <div data-test="defaultLayout">
      <DefaultLayoutStatusbar />

      <div className="flex gap-4 px-10 border-b border-black border-opacity-10">
        <Link to="/" className="flex items-center py-5">
          <img src={logo} alt="RCLONE" />
        </Link>

        <div className="flex justify-between grow">
          <ul className="flex">
            <li>
              <MenuLink to="/remoteExplorer">Explorer</MenuLink>
            </li>
            <li>
              <MenuLink to="/backend">Backend</MenuLink>
            </li>
            <li>
              <MenuLink to="/mountDashboard">Mounts</MenuLink>
            </li>
          </ul>

          <button
            className="flex items-center pl-4 py-5 text-black font-medium no-underline"
            type="button"
            onClick={(e) => {
              localStorage.clear();
              signOut();
              navigate("/login");
            }}
          >
            Log out
          </button>
        </div>
      </div>
      <main className="py-8">
        <Outlet />
      </main>
    </div>
  );
}

const mapStateToProps = (state) => ({
  version: state.version,
});

export default connect(mapStateToProps, { getVersion })(DefaultLayout);
