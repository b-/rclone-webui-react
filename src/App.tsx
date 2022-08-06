import * as React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DefaultLayout from "./containers/DefaultLayout";
import { Login, Page404 } from "./views/Pages";
import NewDrive from "./views/RemoteManagement/NewDrive/NewDrive";
import ShowConfig from "./views/RemoteManagement/ShowConfig/ShowConfig";
import RemoteExplorerLayout from "./views/Explorer/RemoteExplorerLayout";
import Backend from "./views/Backend";
import BackendConfig from "./views/BackendConfig";
import MountDashboard from "./views/MountDashboard";

function App() {
  return (
    <div data-test="appComponent">
      <ToastContainer />
      <HashRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<Page404 />} />
          <Route element={<DefaultLayout />}>
            <Route path="/" element={<ShowConfig />} />
            <Route path="/newdrive/edit/:drivePrefix" element={<NewDrive />} />
            <Route path="/newdrive" element={<NewDrive />} />
            <Route path="/login" element={<Login />} />
            <Route path="/remoteExplorer" element={<RemoteExplorerLayout />} />
            <Route path="/backend" element={<Backend />}>
              <Route path=":config" element={<BackendConfig />} />
            </Route>
            <Route path="/mountDashboard" element={<MountDashboard />} />
          </Route>
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
