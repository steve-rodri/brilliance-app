import React, { Component } from "react";
import { Redirect } from "react-router-dom";

import Header from "./Header";
import Body from "./Body";
import StaffSelector from "./Body/Staff/StaffSelector";
import Client from "./Body/About/Client/";
import Location from "./Body/About/Location/";
import SendUpdates from "./SendUpdates/";
import DeleteJob from "./DeleteJob/";

import Buttons from "../../../components/Buttons/Buttons";
import Modal from "../../../components/Modal";

import { GOOGLE } from "../../../services/google_service";
import {
  event,
  client,
  place,
  eventEmployee
} from "../../../services/BEP_APIcalls.js";
import { eventTitle } from "../../../helpers/eventHelpers";
import { clientName } from "../../../helpers/clientHelpers";
import { locationName } from "../../../helpers/locationName";
import { formatFromGoogle } from "../../../helpers/googleFormatters";

import moment from "moment";
import axios from "axios";
import "./index.css";

export default class EventDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      evt: null,
      workers: [],
      fields: null,
      searchFieldData: null,
      formData: null,
      editMode: false,
      showStaffModal: false,
      showClientModal: false,
      showLocationModal: false,
      showCallLocationModal: false,
      redirectToEvents: false
    };
    this.axiosRequestSource = axios.CancelToken.source();
    this.ajaxOptions = {
      cancelToken: this.axiosRequestSource.token,
      unauthorizedCB: this.props.signout,
      sendCount: false
    };
    this.container = React.createRef();
    this.scrollPosition = 0;
  }

  // ---------------------------------LifeCycle-----------------------------------

  async componentDidUpdate(prevProps, prevState) {
    const differentId = prevProps.evtId !== this.props.evtId;
    const differentE = prevProps.e !== this.props.e;
    if (differentId || differentE) await this.initialSetup();
  }

  async componentDidMount() {
    window.addEventListener("scroll", this.resetScroll);
    window.scrollTo(0, 0);
    await this.setFields();
    const { isNew, date } = this.props;
    if (!isNew) await this.initialSetup();
    if (isNew) {
      this.switchEditMode();
      this.setField("summary", "New Event");
      this.setFormData("summary", "New Event");
      if (date && !this.props.isMonth()) {
        const hours = moment().hours();
        this.handleDateChange(
          "start",
          moment(date.start)
            .add(hours, "hours")
            .format()
        );
      } else {
        this.handleDateChange(
          "start",
          moment()
            .startOf("hour")
            .format()
        );
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.resetScroll);
    this.axiosRequestSource && this.axiosRequestSource.cancel();
  }

  // ----------------------------Getters-and-Setters------------------------------

  initialSetup = async () => {
    await this.setEvent();
    await this.setClient();
    await this.setLocation();
    await this.setCallLocation();
  };

  synchronizeWithGoogle = async evt => {
    const calendarId = localStorage.getItem("google_calendar_id");
    if (!calendarId && !evt.gcId) return evt;
    try {
      const e = await GOOGLE.getEvent(calendarId, evt.gcId, this.ajaxOptions);
      if (!e) return evt;
      const formatted = await formatFromGoogle(e, this.ajaxOptions, evt);
      const synced = await event.sync(formatted, this.ajaxOptions);
      return synced;
    } catch (e) {
      return evt;
    }
  };

  setEvent = async () => {
    const { e, evtId } = this.props;
    let evt;
    if (!e) {
      evt = await event.get(evtId, this.ajaxOptions);
      if (!evt) {
        this.setState({ redirectToEvents: true });
        return;
      }
      evt = await this.synchronizeWithGoogle(evt);
      this.setState({ evt, workers: evt.staff });
    } else {
      evt = await this.synchronizeWithGoogle(e);
      this.setState({ evt, workers: e.staff });
    }
    await this.setFields();
  };

  setFields = () => {
    const { evt } = this.state;
    const fieldNames = [
      "summary",
      "confirmation",
      "start",
      "end",
      "callTime",
      "action",
      "kind",
      "description",
      "notes",
      "package"
    ];
    let fields = {};
    fieldNames.forEach(field => (fields[field] = evt ? evt[field] : null));
    this.setState({ fields });
  };

  setField = (name, value) => {
    this.setState(prevState => ({
      fields: {
        ...prevState.fields,
        [name]: value
      }
    }));
  };

  setFormData = (name, value) => {
    this.setState(prevState => ({
      formData: {
        ...prevState.formData,
        [name]: value
      }
    }));
  };

  setClient = clt => {
    const { evt } = this.state;
    if (clt) {
      const name = clientName(clt);
      this.setField("client", name);
      this.setFormData("client_id", clt.id);
    }
    if (evt && !clt) {
      if (evt.client) {
        const name = clientName(evt.client);
        this.setField("client", name);
        this.setFormData("client_id", evt.client.id);
      } else {
        this.setField("client", null);
      }
    }
  };

  setLocation = place => {
    const { evt } = this.state;
    if (!evt && !place) return;

    let location = locationName(place);

    if (place) {
      this.setField("location", location);
      this.setFormData("location_id", place.id);
      return;
    }

    if (evt && evt.location) {
      location = locationName(evt.location);
      this.setState(prevState => {
        const { installation } = evt.location;
        if (installation)
          return {
            fields: {
              ...prevState.fields,
              location,
              onPremise: evt.location.installation
            },
            formData: {
              ...prevState.formData,
              location_id: evt.location.id
            }
          };
        return {
          fields: {
            ...prevState.fields,
            location
          },
          formData: {
            ...prevState.formData,
            location_id: evt.location.id
          }
        };
      });
    }
  };

  setCallLocation = place => {
    const { evt } = this.state;
    if (!evt && !place) return;
    let callLocation = place;
    if (evt.callLocation) callLocation = evt.callLocation;

    if (callLocation) {
      this.setField("callLocation", locationName(callLocation));
      this.setFormData("call_location_id", callLocation.id);
    }
  };

  resetForm = () => {
    this.setState({
      formData: null
    });
  };

  resetSearchFieldData = async () => {
    this.setState({
      searchFieldData: null
    });
  };

  resetStaff = async () => {
    const { formData, workers } = this.state;
    if (formData) {
      if (formData.employee_ids && formData.employee_ids.length) {
        //for each employee id, find workers with no corresponding employee id
        const originals = workers.filter(worker => {
          return formData.employee_ids.find(id => worker.info.id !== id);
        });

        //for each employee id, find workers with a corresponding employee id
        const addedWorkers = workers.filter(worker => {
          return formData.employee_ids.find(id => worker.info.id === id);
        });

        //delete addedWorkers
        await Promise.all(
          addedWorkers.map(async worker => {
            await eventEmployee.delete(worker.id, this.ajaxOptions);
          })
        );

        //set state with original workers, and reset employee ids
        this.setState(prevState => ({
          workers: originals,
          formData: {
            ...prevState.formData,
            employee_ids: []
          }
        }));
      }
    }
  };

  updateSummaryField = () => {
    this.setState(prevState => ({
      fields: {
        ...prevState.fields,
        summary: eventTitle(prevState.fields)
      },
      formData: {
        ...prevState.formData,
        summary: eventTitle(prevState.fields)
      }
    }));
  };

  // -------------------------------Handle-Changes--------------------------------

  handleChange = e => {
    if (e) {
      const { name, value } = e.target;
      this.setState(
        prevState => ({
          fields: {
            ...prevState.fields,
            [name]: value
          },
          formData: {
            ...prevState.formData,
            [name]: value
          }
        }),
        () => {
          if (name !== "summary" && name !== "notes") {
            this.updateSummaryField();
          }
        }
      );
    }
  };

  handleDateChange = (field, datetime) => {
    let start;
    let end;
    let call;
    if (datetime) {
      switch (field) {
        case "start":
          start = moment(datetime).format();
          end = moment(this.state.fields.end);
          call = moment(this.state.fields.callTime);

          if (
            (!this.state.fields.end ||
              moment(end).isSameOrBefore(moment(start))) &&
            (!this.state.fields.callTime ||
              moment(call).isSameOrAfter(moment(start)))
          ) {
            call = start;
            end = moment(start)
              .add(1, "hour")
              .format();

            this.setState(prevState => ({
              fields: {
                ...prevState.fields,
                start,
                end,
                callTime: call
              },
              formData: {
                ...prevState.formData,
                start,
                end,
                call_time: call
              }
            }));
          } else if (
            !this.state.fields.end ||
            moment(end).isSameOrBefore(moment(start))
          ) {
            end = moment(start)
              .add(1, "hour")
              .format();

            this.setState(prevState => ({
              fields: {
                ...prevState.fields,
                start,
                end
              },
              formData: {
                ...prevState.formData,
                start,
                end
              }
            }));
          } else if (
            !this.state.fields.callTime ||
            moment(call).isSameOrAfter(moment(start))
          ) {
            call = start;

            this.setState(prevState => ({
              fields: {
                ...prevState.fields,
                start,
                callTime: call
              },
              formData: {
                ...prevState.formData,
                start,
                call_time: call
              }
            }));
          } else {
            this.setState(prevState => ({
              fields: {
                ...prevState.fields,
                start
              },
              formData: {
                ...prevState.formData,
                start
              }
            }));
          }
          break;

        case "end":
          end = moment(datetime).format();
          start = moment(this.state.fields.start);

          if (moment(end).isAfter(start)) {
            this.setState(prevState => ({
              fields: {
                ...prevState.fields,
                end
              },
              formData: {
                ...prevState.formData,
                end
              }
            }));
          }
          break;

        case "call":
          call = moment(datetime).format();
          start = moment(this.state.fields.start);

          if (moment(call).isSameOrBefore(start)) {
            this.setState(prevState => ({
              fields: {
                ...prevState.fields,
                callTime: call
              },
              formData: {
                ...prevState.formData,
                call_time: call
              }
            }));
          }
          break;

        default:
          break;
      }
    } else {
      switch (field) {
        case "start":
          this.setState(prevState => ({
            fields: {
              ...prevState.fields,
              start: ""
            },
            formData: {
              ...prevState.formData,
              start: ""
            }
          }));
          break;
        case "end":
          this.setState(prevState => ({
            fields: {
              ...prevState.fields,
              end: ""
            },
            formData: {
              ...prevState.formData,
              end: ""
            }
          }));
          break;
        case "call":
          this.setState(prevState => ({
            fields: {
              ...prevState.fields,
              callTime: ""
            },
            formData: {
              ...prevState.formData,
              call_time: ""
            }
          }));
          break;
        default:
          break;
      }
    }
  };

  handleStatusChange = (name, value) => {
    this.setState(
      prevState => ({
        fields: {
          ...prevState.fields,
          [name]: value
        },
        formData: {
          ...prevState.formData,
          [name]: value
        }
      }),
      async () => await this.handleSubmit({ stayOpen: true })
    );
  };

  handleSearchChange = async (name, value) => {
    this.setField(name, value);
    switch (name) {
      case "client":
        const clients = await this.findClients(value);
        if (clients) {
          if (!value || !clients || clients.length < 0) {
            this.setState(
              prevState => ({
                formData: {
                  ...prevState.formData,
                  client_id: null
                }
              }),
              () => {
                if (value.length === 0 || value.length > 2) {
                  this.updateSummaryField();
                }
              }
            );
          }

          this.setState(prevState => ({
            searchFieldData: {
              ...prevState.searchFieldData,
              clients
            }
          }));
        }

        break;

      case "location":
        const locations = await this.findPlaces(value);

        if (locations) {
          if (!value || !locations || locations.length < 0) {
            this.setState(
              prevState => ({
                formData: {
                  ...prevState.formData,
                  location_id: null
                },
                fields: {
                  ...prevState.fields,
                  onPremise: null
                }
              }),
              () => {
                if (value.length === 0 || value.length > 2) {
                  this.updateSummaryField();
                }
              }
            );
          }

          this.setState(prevState => ({
            searchFieldData: {
              ...prevState.searchFieldData,
              locations
            }
          }));
        }

        break;

      case "callLocation":
        const callLocations = await this.findPlaces(value);

        if (callLocations) {
          if (!value || !callLocations || callLocations.length < 0) {
            this.setState(prevState => ({
              formData: {
                ...prevState.formData,
                call_location_id: null
              }
            }));
          }

          this.setState(prevState => ({
            searchFieldData: {
              ...prevState.searchFieldData,
              callLocations
            }
          }));
        }

        break;

      default:
        break;
    }
  };

  // --------------------------------Search-Field---------------------------------

  handleSelect = (e, name, index) => {
    let item;
    const { searchFieldData } = this.state;

    if (searchFieldData) {
      switch (name) {
        case "client":
          item = searchFieldData.clients[index];
          const client = clientName(item);
          if (item) {
            this.setState(
              prevState => ({
                formData: {
                  ...prevState.formData,
                  client_id: item.id
                },
                fields: {
                  ...prevState.fields,
                  client
                }
              }),
              () => this.updateSummaryField()
            );
          }

          break;

        case "location":
          item = searchFieldData.locations[index];
          const location = locationName(item);

          if (item) {
            this.setState(
              prevState => ({
                formData: {
                  ...prevState.formData,
                  location_id: item.id
                },
                fields: {
                  ...prevState.fields,
                  location,
                  onPremise: item.installation
                }
              }),
              () => this.updateSummaryField()
            );
          }

          break;

        case "callLocation":
          item = searchFieldData.callLocations[index];
          const callLocation = locationName(item);

          if (item) {
            this.setState(prevState => ({
              formData: {
                ...prevState.formData,
                call_location_id: item.id
              },
              fields: {
                ...prevState.fields,
                callLocation
              }
            }));
          }
          break;

        default:
          this.setState(prevState => ({
            formData: {
              ...prevState.formData,
              [name]: item.id
            }
          }));
          break;
      }
    }
  };

  handleFormSubmit = (e, name, index) => {
    if (e.key === "Tab" || e.key === "Enter") {
      this.handleSelect(e, name, index);
    }
  };

  // -----------------------------Search-Field-Data-------------------------------

  findClients = async query => {
    const q = query.split("");
    if (q.length > 2) {
      const data = await client.batch({ page: 1, q: query }, this.ajaxOptions);
      if (data) return data.clients;
    }
  };

  handleClientSubmit = async data => {
    if (!data) return;
    let clt;
    if (!data.id) clt = await client.create(data, this.ajaxOptions);
    if (data.id) clt = await client.update(data.id, data, this.ajaxOptions);
    this.setClient(clt);
  };

  findPlaces = async query => {
    const q = query.split("");
    if (q.length > 2) {
      const places = await place.find(query, this.ajaxOptions);
      return places;
    }
  };

  handleLocationSubmit = async data => {
    if (!data) return;
    let location;
    if (data.id) location = await place.update(data.id, data, this.ajaxOptions);
    if (!data.id) location = await place.create(data, this.ajaxOptions);
    this.setLocation(location);
  };

  handleCallLocationSubmit = async data => {
    if (!data) return;
    let callLocation;
    if (data.id)
      callLocation = await place.update(data.id, data, this.ajaxOptions);
    if (!data.id) callLocation = await place.create(data, this.ajaxOptions);
    this.setCallLocation(callLocation);
  };

  // --------------------------------Event-Staff----------------------------------

  chooseWorker = async () => {
    await this.openStaffModal();
  };

  handleEmployeeSelect = employee => {
    const { workers, formData } = this.state;
    if (formData) {
      const { employee_ids } = formData;

      const scheduled =
        workers.find(worker => worker.info.id === employee.id) ||
        (employee_ids && employee_ids.find(id => id === employee.id));

      if (scheduled) {
        this.removeWorker(scheduled);
      } else {
        this.addWorker(employee);
      }
    } else {
      this.addWorker(employee);
    }
  };

  addWorker = async employee => {
    const { formData } = this.state;
    if (this.props.isNew) {
      if (formData) {
        if (
          formData.event_employees_attributes &&
          formData.event_employees_attributes.length
        ) {
          this.setState(prevState => ({
            formData: {
              ...prevState.formData,
              event_employees_attributes: [
                ...prevState.formData.event_employees_attributes,
                { employee_id: employee.id }
              ]
            },
            workers: [...prevState.workers, { info: employee }]
          }));
        } else {
          this.setState(prevState => ({
            formData: {
              ...prevState.formData,
              event_employees_attributes: [{ employee_id: employee.id }]
            },
            workers: [{ info: employee }]
          }));
        }
      } else {
        this.setState({
          formData: {
            event_employees_attributes: [{ employee_id: employee.id }]
          },
          workers: [{ info: employee }]
        });
      }
    } else {
      const evt = { ...this.state.evt };
      const workers = [...this.state.workers];
      const { signout } = this.props;
      const newWorker = await eventEmployee.create(
        {
          event_id: evt.id,
          employee_id: employee.id
        },
        this.axiosRequestSource.token,
        signout
      );
      workers.push(newWorker);
      evt.staff = workers;
      this.setState({ evt, workers });

      if (formData) {
        if (
          formData.event_employees_attributes &&
          formData.event_employees_attributes.length
        ) {
          this.setState(prevState => ({
            formData: {
              ...prevState.formData,
              event_employees_attributes: [
                ...prevState.formData.event_employees_attributes,
                { id: newWorker.id, employee_id: employee.id }
              ]
            }
          }));
        } else {
          this.setState(prevState => ({
            formData: {
              ...prevState.formData,
              event_employees_attributes: [
                { id: newWorker.id, employee_id: employee.id }
              ]
            }
          }));
        }
      } else {
        this.setState({
          formData: {
            event_employees_attributes: [
              { id: newWorker.id, employee_id: employee.id }
            ]
          }
        });
      }
    }
  };

  removeWorker = async worker => {
    const evt = { ...this.state.evt };
    const workers = [...this.state.workers];
    const { formData } = this.state;

    if (!this.props.isNew) {
      await eventEmployee.delete(worker.id, this.ajaxOptions);
    }

    const updatedWorkers = workers.filter(w => w.id !== worker.id);
    evt.staff = updatedWorkers;

    if (
      formData &&
      formData.event_employees_attributes &&
      formData.event_employees_attributes.length
    ) {
      const event_employees_attributes = formData.event_employees_attributes.filter(
        obj => {
          const worker = workers.find(
            worker => worker.info.id !== obj.employee_id
          );
          return worker;
        }
      );

      this.setState(prevState => ({
        formData: {
          ...prevState.formData,
          event_employees_attributes
        },
        evt,
        workers: updatedWorkers
      }));
    } else {
      this.setState(prevState => ({
        evt,
        workers: updatedWorkers
      }));
    }
  };

  // ----------------------------------DB-CRUD------------------------------------

  handleSubmit = async options => {
    const { evt, formData } = this.state;
    const {
      isNew,
      history,
      user: { accessLevel }
    } = this.props;
    const { stayOpen, sendUpdates } = options;
    if (isNew) {
      if (formData) {
        const newEvt = await this.props.handleCreate(formData, sendUpdates);
        if (newEvt) history.push(`${accessLevel}/events/${newEvt.id}`);
      } else {
        this.close();
      }
    } else {
      const updatedEvent = await this.props.handleUpdate(
        evt,
        formData,
        sendUpdates
      );
      await this.setState({ evt: updatedEvent });

      if (!stayOpen) await this.close();
    }
  };

  handleDelete = async () => {
    const { evt } = this.state;
    await this.props.handleDelete(evt);
    this.setState({ redirectToEvents: true });
  };

  // -----------------------------------Views-------------------------------------

  close = async () => {
    this.resetForm();
    this.resetSearchFieldData();
    this.resetStaff();
    this.closeSubmitModal();
    this.switchEditMode();
    await this.initialSetup();
  };

  switchEditMode = () => {
    this.setState({ editMode: !this.state.editMode });
  };

  scrollToTop = () => {
    this.container.current.scrollTop = 0;
  };

  resetScroll = () => {
    this.setState({ scroll: true });
    setTimeout(() => this.setState({ scroll: false }), 1000);
  };

  // -----------------------------------Modals------------------------------------

  openStaffModal = () => {
    this.setState({ showStaffModal: true });
  };

  closeStaffModal = () => {
    this.setState({ showStaffModal: false });
  };

  openClientModal = () => {
    this.setState({ showClientModal: true });
  };

  closeClientModal = () => {
    this.setState({ showClientModal: false });
  };

  openLocationModal = () => {
    this.setState({ showLocationModal: true });
  };

  closeLocationModal = () => {
    this.setState({ showLocationModal: false });
  };

  openCallLocationModal = () => {
    this.setState({ showCallLocationModal: true });
  };

  closeCallLocationModal = () => {
    this.setState({ showCallLocationModal: false });
  };

  openSubmitModal = async () => {
    const { evt, workers } = this.state;
    if ((evt && evt.staff && evt.staff.length) || (workers && workers.length)) {
      this.setState({ showSubmitModal: true });
    } else {
      await this.handleSubmit({ sendUpdates: false });
    }
  };

  closeSubmitModal = () => {
    this.setState({ showSubmitModal: false });
  };

  openDeleteModal = () => {
    this.setState({ showDeleteModal: true });
  };

  closeDeleteModal = () => {
    this.setState({ showDeleteModal: false });
  };

  // -----------------------------------Styles------------------------------------

  styleTab = view => {
    if (view === this.state.view) {
      return this.highlight();
    } else {
      return {};
    }
  };

  highlight = () => {
    return {
      backgroundColor: "var(--light-gray)",
      color: "rgba(0,0,0,.88)",
      borderTop: "1px solid rgba(0,0,0,.88) "
    };
  };

  // -----------------------------------Render------------------------------------

  render() {
    const {
      user: { accessLevel },
      mobile
    } = this.props;
    if (this.state.redirectToEvents)
      return <Redirect to={`/${accessLevel}/events`} />;
    return (
      <div className="EventDetail" ref={this.container}>
        <Header
          {...this.state}
          {...this.props}
          edit={this.switchEditMode}
          close={this.close}
          delete={this.handleDelete}
          back={this.switchEditMode}
          handleSubmit={this.openSubmitModal}
          handleChange={this.handleChange}
        />

        <Body
          {...this.state}
          {...this.props}
          edit={this.switchEditMode}
          close={this.close}
          delete={this.handleDelete}
          submit={this.openSubmitModal}
          handleChange={this.handleChange}
          handleStatusChange={this.handleStatusChange}
          handleDateChange={this.handleDateChange}
          handleSearchChange={this.handleSearchChange}
          handleFocusSelect={this.handleFocusSelect}
          handleEmployeeSelect={this.handleEmployeeSelect}
          onSelect={this.handleSelect}
          onEnter={this.handleFormSubmit}
          chooseWorker={this.chooseWorker}
          addWorker={this.addWorker}
          removeWorker={this.removeWorker}
          openClient={this.openClientModal}
          openLocation={this.openLocationModal}
          openCallLocation={this.openCallLocationModal}
          scrollToTop={this.scrollToTop}
        />

        {this.state.editMode ? (
          <footer>
            <button
              className="EventDetail--delete-button"
              onClick={this.openDeleteModal}
            >
              DELETE JOB
            </button>
          </footer>
        ) : null}

        {mobile ? (
          <Buttons
            {...this.props}
            {...this.state}
            edit={this.switchEditMode}
            submit={this.openSubmitModal}
            scrollToTop={this.scrollToTop}
            handleStatusChange={this.handleStatusChange}
          />
        ) : null}

        {this.state.showStaffModal ? (
          <Modal
            mobile={this.props.mobile}
            close={this.closeStaffModal}
            content={
              <StaffSelector
                {...this.props}
                close={this.closeStaffModal}
                workers={this.state.workers}
                handleEmployeeSelect={this.handleEmployeeSelect}
              />
            }
          />
        ) : null}

        {this.state.showClientModal ? (
          <Modal
            mobile={this.props.mobile}
            close={this.closeClientModal}
            content={
              <Client
                {...this.props}
                {...this.state}
                close={this.closeClientModal}
                onClientSubmit={this.handleClientSubmit}
              />
            }
          />
        ) : null}

        {this.state.showLocationModal ? (
          <Modal
            mobile={this.props.mobile}
            close={this.closeLocationModal}
            content={
              <Location
                {...this.state}
                close={this.closeLocationModal}
                onLocationSubmit={this.handleLocationSubmit}
              />
            }
          />
        ) : null}

        {this.state.showCallLocationModal ? (
          <Modal
            mobile={this.props.mobile}
            close={this.closeCallLocationModal}
            content={
              <Location
                {...this.state}
                close={this.closeCallLocationModal}
                onLocationSubmit={this.handleCallLocationSubmit}
              />
            }
          />
        ) : null}

        {this.state.showSubmitModal ? (
          <Modal
            mobile={this.props.mobile}
            close={this.closeSubmitModal}
            content={<SendUpdates onSubmit={this.handleSubmit} />}
          />
        ) : null}

        {this.state.showDeleteModal ? (
          <Modal
            mobile={this.props.mobile}
            close={this.closeDeleteModal}
            content={
              <DeleteJob
                onDelete={this.handleDelete}
                close={this.closeDeleteModal}
              />
            }
          />
        ) : null}
      </div>
    );
  }
}
