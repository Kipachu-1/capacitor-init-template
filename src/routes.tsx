import { lazy } from "@loadable/component";
import { Suspense } from "react";
import { Route, Routes } from "react-router";

const DefaultLayout = lazy(() => import("./layout/default"));
const OnboardingLayout = lazy(() => import("./layout/onboarding"));

const WelcomePage = lazy(() => import("./pages/board/welcome"));
const HomePage = lazy(() => import("./pages/home"));

const AppRoutes = () => {
  const fallback = <div>Loading...</div>;

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Suspense fallback={fallback}>
            <DefaultLayout />
          </Suspense>
        }
      >
        <Route
          index
          element={
            <Suspense fallback={fallback}>
              <HomePage />
            </Suspense>
          }
        />
      </Route>

      <Route
        path="/boarding"
        element={
          <Suspense fallback={fallback}>
            <OnboardingLayout />
          </Suspense>
        }
      >
        <Route
          path="welcome"
          element={
            <Suspense fallback={fallback}>
              <WelcomePage />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
