import React, { Component, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Container } from "reactstrap";
import { getVersion } from "../../actions/versionActions";

import {
  CBreadcrumb,
  CFooter,
  CHeader,
  CSidebar,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarNav,
} from "@coreui/react";
// sidebar nav config
import navigation from "../../_nav";
// routes config
import routes from "../../routes";
import { connect } from "react-redux";
import { AUTH_KEY, LOGIN_TOKEN } from "../../utils/Constants";
import ErrorBoundary from "../../ErrorHandling/ErrorBoundary";

// const DefaultAside = React.lazy(() => import('./DefaultAside'));
const DefaultFooter = React.lazy(() => import("./DefaultFooter"));
const DefaultHeader = React.lazy(() => import("./DefaultHeader"));

const VERSION_NAV_ITEM_ATTRS = {
  attributes: { target: "_blank" },
  class: "mt-auto",
  icon: "cui-cog",
  url: "https://rclone.org/changelog",
  variant: "success",
};
class DefaultLayout extends Component {
  loading = () => (
    <div className="animated fadeIn pt-1 text-center">Loading...</div>
  );

  get navConfig() {
    return {
      items: [
        ...navigation.items,
        {
          name: this.props.version.version,
          ...VERSION_NAV_ITEM_ATTRS,
        },
      ],
    };
  }

  componentDidMount() {
    if (
      !localStorage.getItem(AUTH_KEY) ||
      window.location.href.indexOf(LOGIN_TOKEN) > 0
    ) {
      this.props.history.push("/login");
    } else {
      this.props.getVersion();
    }
  }

  render() {
    // console.log("isConnected, default layout", this.props.isConnected);
    return (
      <div className="app" data-test="defaultLayout">
        <ErrorBoundary>
          <CHeader position="fixed">
            <Suspense fallback={this.loading()}>
              <DefaultHeader onLogout={(e) => this.signOut(e)} />
            </Suspense>
          </CHeader>
          <div className="app-body">
            <CSidebar position="fixed" display="lg">
              <CSidebarHeader />
              <Suspense fallback={this.loading()}>
                <CSidebarNav navConfig={this.navConfig} />
              </Suspense>
              <CSidebarFooter />
            </CSidebar>
            <main className="main">
              {/* <CBreadcrumb appRoutes={routes} /> */}
              <Container fluid>
                <Suspense fallback={this.loading()}>
                  <Routes>
                    {routes.map((route, idx) => {
                      return route.component ? (
                        <Route
                          key={idx}
                          path={route.path}
                          // exact={route.exact}
                          // name={route.name}
                          element={(props) => <route.component {...props} />}
                        />
                      ) : null;
                    })}
                    {/* <Redirect from="/" to="/dashboard" /> */}
                  </Routes>
                </Suspense>
              </Container>
            </main>
          </div>
          <CFooter>
            <Suspense fallback={this.loading()}>
              <DefaultFooter />
            </Suspense>
          </CFooter>
        </ErrorBoundary>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isConnected: state.status.isConnected,
  version: state.version,
});

export default connect(mapStateToProps, { getVersion })(DefaultLayout);
