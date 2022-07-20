import React from "react";
import BackendStatusCard from "../Base/BackendStatusCard/BackendStatusCard";
import RunningJobs from "../Base/RunningJobs";
import BandwidthStatusCard from "../Base/BandwidthStatusCard/BandwidthStatusCard";
import { connect } from "react-redux";

function Home({ checkStatus }) {
  return (
    <div data-test="homeComponent">
      <div className="flex gap-8">
        <div className="w-full md:w-1/">
          <BackendStatusCard mode={"card"} />
        </div>
        <div className="w-full md:w-1/">
          <BandwidthStatusCard />
        </div>
      </div>
      <h2>Jobs</h2>
      {checkStatus ? (
        <RunningJobs mode={"full-status"} />
      ) : (
        <p>Not Monitoring</p>
      )}
    </div>
  );
}

const mapStateToProps = (state) => ({
  checkStatus: state.status.checkStatus,
});

export default connect(mapStateToProps, {})(Home);
