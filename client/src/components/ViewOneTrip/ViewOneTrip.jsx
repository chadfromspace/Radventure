import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Button from "@material-ui/core/Button";
import API from "../../utils/API";
import { Link } from "react-router-dom";
import Card from "@material-ui/core/Card";
import { fade } from "@material-ui/core/styles/colorManipulator";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmModal from "../ConfirmModal/ConfirmModal";

const styles = {
  ButtonsStyle: {
    background: "#02361C",
    color: "white",
    justifyContent: "center",
  },
  CardStyles: {
    maxWidth: 1200,
    marginLeft: 400,
    marginTop: 20,
    backgroundColor: fade("#255D42", 0.8),
    height: 600,
  },
  DeleteButtonStyle: {
    background: "red",
  },
  UpdateButtonStyle: {
    background: "#FFC107",
  },
};

const ViewOneTrip = () => {
  const [oneTripState, setOneTripState] = useState([]);
  const { id } = useParams();
  const [open, setOpen] = React.useState(false);
  const [activeTrip, setActiveTrip] = React.useState(null);

  const handleOpen = () => {
    setOpen(true);
    setActiveTrip(id)
  };

  const handleClose = () => {
    setOpen(false);
    setActiveTrip(null)
  };
  useEffect(() => {
    API.getOneTrip(id).then((res) => {
      setOneTripState(res.data);
    });
  }, []);
  const handleDelete = (id) => {
    API.deleteTrip(id)
      .then((_) => {
        // this.useEffect();
        toast.success("You trip is successfully deleted !");
        setTimeout(() => window.location.replace("/PastTrips"), 2000);
      })
      .catch((err) => console.log(err));
  };

  return (
    <Card style={styles.CardStyles}>
      <div>
        <div key={oneTripState._id}>
          <form>
            <div className="container">
              <h1 className="text-center welcome">Details of Your Trip!</h1>

              <h2> Start City Information</h2>
              <h3> <strong>Address:</strong>  {oneTripState.startStreet} {oneTripState.startCity}, {oneTripState.startState}, {oneTripState.startPostalCode}</h3>
              <h5>-------------------------------</h5>
              <h2> Destination City Information</h2>
              <h3> <strong>Address:</strong>  {oneTripState.destinationStreet} {oneTripState.destinationCity}, {oneTripState.destinationState}, {oneTripState.destinationPostalCode}</h3>
              <div>
                <Button
                  id={oneTripState._id}
                  onClick={() => handleOpen(oneTripState._id)}
                  size="large"
                  style={styles.DeleteButtonStyle}
                >
                  Delete
                </Button>
               
                <Link to={`/PastTrips/${oneTripState._id}/edit`}>
                  <Button
                    id={oneTripState._id}
                    type="submit"
                    size="large"
                    style={styles.UpdateButtonStyle}
                  >
                    Update
                  </Button>
                </Link>
                <Button
                  size="large"
                  href="/pasttrips"
                  style={styles.ButtonsStyle}
                >
                  Back to Trips
                </Button>
                <ToastContainer />
              </div>
              <ConfirmModal
                open={open}
                handleDelete={handleDelete}
                handleClose={handleClose}
                handleOpen={handleOpen}
                id={ activeTrip}
              />
            </div>
          </form>
        </div>
      </div>
    </Card>
  );
};

export default ViewOneTrip;
