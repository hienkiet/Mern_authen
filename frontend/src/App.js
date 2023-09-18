import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { privateRoutes, publicRoutes } from "../src/router/Router";
import DefaultLayout from "./pages/DefaultLayout";
import Loading from "./components/Loading/Loading";
import React, { Fragment, Suspense } from "react";

function App() {
  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <div className="app">
          <Routes>
            {[...publicRoutes, ...privateRoutes()].map((route, index) => {
              let Layout = DefaultLayout;
              if (route.layout === null) {
                Layout = Fragment;
              } else if (route.layout) {
                Layout = route.layout;
              }

              return (
                <Route
                  key={index}
                  path={route.path}
                  element={
                    <Layout>
                      <route.component />
                    </Layout>
                  }
                />
              );
            })}
          </Routes>
        </div>
      </Suspense>
    </Router>
  );
}

export default App;
