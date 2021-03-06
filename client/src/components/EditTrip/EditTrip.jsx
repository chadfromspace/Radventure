import React, { useEffect, useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { MapContext } from "../../contexts/MapProvider";
import API from "../../utils/API";
import { makeStyles, styled } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Fab from "@material-ui/core/Fab";
import NavigationIcon from "@material-ui/icons/Navigation";
import "../Map/Map";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justify: "center",
    "& > *": {
      margin: theme.spacing(2, "auto"),
      width: theme.spacing(145),
      height: theme.spacing(70, "auto"),
    },
  },
}));

// STYLING
const MyPaper = styled(Paper)({
  elevation: 3,
});

const MyBox = styled(Box)({
  display: "flex",
  justifyContent: "center",
});

const MyFab = styled(Fab)({
  backgroundColor: "#FFC107",
});
// END OF STYLING

export default function EditTrip() {
  const classes = useStyles();
  const { map, setMap } = useContext(MapContext);
  const [setOneTripState] = useState([]);
  const { id } = useParams();
  const [double, setDouble] = useState(false);
  const heandler = () => {
    setTimeout(() => setDouble(false), 5000);
    setDouble(true);
  };
  useEffect(() => {
    const mapquest = window.L.mapquest;
    mapquest.key = "TzrDot8zE5IyvIXUg7RP0ZiSWDnzqxCZ";
    var baseLayer = window.L.mapquest.tileLayer("map");
    var map = window.L.mapquest.map("map", {
      center: [33.753746, -84.38633],
      layers: baseLayer,
      zoom: 12,
    });
    API.getOneTrip(id).then((res) => {
      setOneTripState(res.data);
      console.log(res.data);
      window.L.mapquest.directions().route({
        start: `${res.data.startCity} ${res.data.startState}`,
        end: `${res.data.destinationCity} ${res.data.destinationState}`,
      });
    });

    window.L.control
      .layers({
        Map: baseLayer,
        Hybrid: window.L.mapquest.tileLayer("hybrid"),
        Satellite: window.L.mapquest.tileLayer("satellite"),
        Light: window.L.mapquest.tileLayer("light"),
        Dark: window.L.mapquest.tileLayer("dark"),
      })
      .addTo(map);

    mapquest
      .directionsControl({
        routeSummary: {
          enabled: true,
        },
        narrativeControl: {
          enabled: true,
          compactResults: false,
        },
      })
      .addTo(map);

    mapquest.geocodingControl().addTo(map);

    map.addControl(mapquest.control());

    setMap(map);
  }, [id, setMap, setOneTripState]);

  const updateTrip = () => {
    const address = map.directionsControl.directions.directionsRequest;

    if (address === undefined) {
      toast.error("You should enter at least two states with cities !");
      heandler()
    } else {
      const startStreet = address.locations[0].street;
      const startCity = address.locations[0].adminArea5;
      const startState = address.locations[0].adminArea3;
      const startPostalCode = address.locations[0].postalCode;
      const destinationStreet = address.locations[1].street;
      const destinationCity = address.locations[1].adminArea5;
      const destinationState = address.locations[1].adminArea3;
      const destinationPostalCode = address.locations[1].postalCode;
      const queryOne = `${startCity},+${startState}`;
      const queryTwo = `${destinationCity},+${destinationState}`;
      console.log(queryOne);

      API.getDirection(queryOne, queryTwo)
        .then((response) => {
          const distance =Math.round( parseInt(response.data.route.distance));
          console.log(distance)
          const time = response.data.route.formattedTime;
          console.log(distance, time);
          setOneTripState(
            time,
            distance,
            startStreet,
            startCity,
            startState,
            startPostalCode,
            destinationStreet,
            destinationCity,
            destinationState,
            destinationPostalCode
          );
          axios
            .put(`/api/trips/${id}`, {
              time,
              distance,
              startStreet,
              startCity,
              startState,
              startPostalCode,
              destinationStreet,
              destinationCity,
              destinationState,
              destinationPostalCode,
            })
            .then((res) => {
              setDouble(true);
              toast.success("You trip is successfully updated !");
              setTimeout(() => window.location.replace("/PastTrips"), 2000);
            })
            .catch((err) => {
              heandler()
              console.log("this is error message  " + err);
            });
        })
        .catch((err) => {
          heandler()
          console.log("this is error message  " + err);
          toast.error("Sorry, error occurred! Try once more!");
        });
    }
  };

  return (
    <div className={classes.root}>
      <MyPaper>
        <div id="map"></div>
      </MyPaper>
      <MyBox>
        <MyFab
          disabled={double}
          variant="extended"
          size="medium"
          aria-label="add"
          className={classes.margin}
          onClick={(e) => updateTrip(e)}
        >
          <NavigationIcon />
          Save Updates
        </MyFab>
        <MyFab
          variant="extended"
          size="medium"
          aria-label="add"
          className={classes.margin}
          href="/PastTrips"
        >
          <NavigationIcon />
          Cancel Updates
        </MyFab>
        <ToastContainer />
      </MyBox>
    </div>
  );
}
