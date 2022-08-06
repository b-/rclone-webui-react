import * as React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DefaultLayout from "./containers/DefaultLayout";
import Login from "./views/Pages/Login/Login";
import Register from "./views/Pages/Register";
import Page404 from "./views/Pages/Page404";
import Page500 from "./views/Pages/Page500";
import NewDrive from "./views/RemoteManagement/NewDrive/NewDrive";
import ShowConfig from "./views/RemoteManagement/ShowConfig/ShowConfig";
import RemoteExplorerLayout from "./views/Explorer/RemoteExplorerLayout";
import RCloneDashboard from "./views/RCloneDashboard";
import MountDashboard from "./views/MountDashboard";

function App() {
  return (
    <div data-test="appComponent">
      <ToastContainer />
      <HashRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/404" element={<Page404 />} />
          <Route path="/500" element={<Page500 />} />
          <Route element={<DefaultLayout />}>
            <Route path="/" element={<ShowConfig />} />
            <Route path="/newdrive/edit/:drivePrefix" element={<NewDrive />} />
            <Route path="/newdrive" element={<NewDrive />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/remoteExplorer/:remoteName/:remotePath"
              element={<RemoteExplorerLayout />}
            />
            <Route path="/remoteExplorer" element={<RemoteExplorerLayout />} />
            <Route path="/rcloneBackend" element={<RCloneDashboard />} />
            <Route path="/mountDashboard" element={<MountDashboard />} />
          </Route>
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
