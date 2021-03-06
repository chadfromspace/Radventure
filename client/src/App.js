import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import Search from "./pages/Search";
import PastTrips from "./pages/PastTrips";
import ViewOneTrip from "./components/ViewOneTrip/ViewOneTrip";
import EditTrip from "./components/EditTrip/EditTrip";
import { MapProvider } from "./contexts/MapProvider";
import HomepageCard from "./components/Card/HomepageCard";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";

function App() {
  return (
    <MapProvider>
      <Router>
        <Switch>
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/login" component={Login} />
          <Route
            exact
            path="/"
            render={(props) => <HomepageCard {...props} />}
          />
          <Route
            exact
            path="/search"
            render={(props) => <Search {...props} />}
          />
          <Route
            exact
            path="/PastTrips"
            render={(props) => <PastTrips {...props} />}
          />
          <Route exact path="/PastTrips/:id" component={ViewOneTrip} />
          <Route exact path="/PastTrips/:id/edit" component={EditTrip} />
        </Switch>
      </Router>
    </MapProvider>
  );
}

export default App;
