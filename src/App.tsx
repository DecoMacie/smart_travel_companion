import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ProfileSetup from "./pages/onboarding/ProfileSetup";
import Preferences from "./pages/onboarding/Preferences";
import Accessibility from "./pages/onboarding/Accessibility";
import Language from "./pages/onboarding/Language";
import Privacy from "./pages/onboarding/Privacy";
import TripDetails from "./pages/dashboard/TripDetails";
import AddTrip from "./pages/dashboard/AddTrip";
import TripsList from "./pages/dashboard/TripsList";
import Home from "./pages/dashboard/Home";
import Settings from "./pages/settings/settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            <MainLayout title="Dashbord">
              <Home />
            </MainLayout>
          }
        />
        <Route path="/onboarding/profile" element={<ProfileSetup />} />
        <Route path="/onboarding/preferences" element={<Preferences />} />
        <Route path="/onboarding/accessibility" element={<Accessibility />} />
        <Route path="/onboarding/language" element={<Language />} />
        <Route path="/onboarding/privacy" element={<Privacy />} />
        <Route
          path="/trips/:id"
          element={
            <MainLayout title="Trip Detail" showBack>
              <TripDetails />
            </MainLayout>
          }
        />
        <Route
          path="/trips/add"
          element={
            <MainLayout title="Add Trip" showBack>
              <AddTrip />
            </MainLayout>
          }
        />
        <Route
          path="/trips"
          element={
            <MainLayout title="My Trips">
              <TripsList />
            </MainLayout>
          }
        />
        <Route
          path="/settings"
          element={
            <MainLayout title="Settings" showBack>
              <Settings />
            </MainLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
