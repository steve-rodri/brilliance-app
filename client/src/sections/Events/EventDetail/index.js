import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useLocation } from "react-router-dom";

import Header from "./Header";
import Body from "./Body";
import StaffSelector from "./Body/Staff/StaffSelector";
import Client from "./Body/About/Client/";
import Location from "./Body/About/Location/";
import SendUpdates from "./SendUpdates/";
import DeleteJob from "./DeleteJob/";

import MobileButtons from "../../../components/Buttons/MobileButtons";
import Modal from "../../../components/Modal";

import { setEvent, setNewEvent, fetchEvent } from "../../../redux";
import "./index.css";

const EventDetail = ({ match }) => {
  const [modal, setModal] = useState({ show: false, content: "", props: {} });
  const container = useRef();
  const dispatch = useDispatch();
  const { state } = useLocation();
  useEffect(() => {
    const resetScroll = () => {};
    window.addEventListener("scroll", resetScroll);
    window.scrollTo(0, 0);
    return () => {
      window.removeEventListener("scroll", resetScroll);
    };
  }, []);

  useEffect(() => {
    if (state && state.event) {
      dispatch(setEvent(state.event));
    } else if (match.params.id) {
      dispatch(fetchEvent(match.params.id));
    } else {
      dispatch(setNewEvent());
    }
  }, [dispatch, match.params.id, state]);

  const closeModal = async () => {
    setModal({ show: false, content: "" });
  };

  const showModal = (type, props) => {
    setModal({ show: true, content: type, props });
  };

  const modalContent = () => {
    switch (modal.content) {
      case "Staff":
        return <StaffSelector {...modal.props} />;
      case "Client":
        return <Client {...modal.props} />;
      case "Location":
        return <Location {...modal.props} />;
      case "Call Location":
        return <Location {...modal.props} />;
      case "Submit":
        return <SendUpdates {...modal.props} />;
      case "Delete":
        return <DeleteJob {...modal.props} />;
      default:
        return null;
    }
  };

  const scrollToTop = () => (container.current.scrollTop = 0);
  const accessLevel = useSelector(state => state.user.accessLevel);
  const { data, loading } = useSelector(state => state.section.events.form);
  if (!loading && !data) return <Redirect to={`/${accessLevel}/events`} />;
  return (
    <div className="EventDetail" ref={container}>
      <Header onSubmit={() => showModal("Submit")} closeModal={closeModal} />
      <Body
        onSubmit={props => showModal("Submit", props)}
        openClient={props => showModal("Client", props)}
        openLocation={props => showModal("Location", props)}
        openCallLocation={props => showModal("Call Location", props)}
        scrollToTop={scrollToTop}
        closeModal={closeModal}
      />
      <Footer
        onDelete={props => showModal("Delete", props)}
        onSubmit={props => showModal("Submit", props)}
        scrollToTop={scrollToTop}
      />
      <Modal show={modal.show} close={closeModal} content={modalContent()} />
    </div>
  );
};

const Footer = ({ onDelete, onSubmit, scrollToTop }) => {
  const mobile = useSelector(state => state.view.mobile);
  const editMode = useSelector(state => state.section.events.form.edit);
  if (editMode && !mobile) {
    return (
      <footer>
        <button className="EventDetail--delete-button" onClick={onDelete}>
          DELETE JOB
        </button>
      </footer>
    );
  }
  const props = { editMode, onDelete, onSubmit };
  if (mobile) return <MobileButtons {...props} />;
  return null;
};

export default EventDetail;
