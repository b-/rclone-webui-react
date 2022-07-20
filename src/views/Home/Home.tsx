import React from "react";
import BackendStatusCard from "../Base/BackendStatusCard/BackendStatusCard";
import RunningJobs from "../Base/RunningJobs";
import BandwidthStatusCard from "../Base/BandwidthStatusCard/BandwidthStatusCard";
import { connect } from "react-redux";

function Home() {
  return (
    <div data-test="homeComponent">
      <div className="flex gap-8">
        <div className="w-full md:w-1/">
          <BackendStatusCard />
        </div>
        <div className="w-full md:w-1/">
          <BandwidthStatusCard />
        </div>
      </div>
      <h2>Jobs</h2>
      {/* <RunningJobs mode={"full-status"} /> */}
    </div>
  );
}

export default connect(null, {})(Home);
