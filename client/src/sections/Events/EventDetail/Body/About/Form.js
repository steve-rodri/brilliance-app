import React, { useEffect, useCallback } from "react";
import SearchField from "../../../../../components/SearchField/";
import { useDispatch } from "react-redux";
import { updateEventFormData, deleteEventFormData } from "../../../../../redux";
import { useTraceableState } from "../../../../../hooks";
import { clientRequests, placeRequests } from "../../../../../services";
import { clientName } from "../../../../../helpers/clientHelpers";
import { locationName } from "../../../../../helpers/locationName";

const Edit = (props) => {
  return (
    <div className="About">
      <Client {...props} />
      <Location {...props} />
      <Kind {...props} />
      <Package {...props} />
      <Action {...props} />
    </div>
  );
};

const Client = ({ client, clientId, openClient }) => {
  const defaultValue = clientName(client);
  const dispatch = useDispatch();
  const getResults = useCallback(async (params) => {
    const { clients } = await clientRequests.get({ limit: 5, ...params });
    return clients;
  }, []);
  const handleSubmit = ({ selectedResult: client }) => {
    dispatch(
      updateEventFormData({
        client,
        clientId: client.id,
      })
    );
  };
  const handleDelete = () => {
    dispatch(
      deleteEventFormData({
        client,
        clientId,
      })
    );
  };
  return (
    <>
      <label>Client</label>
      <SearchField
        className="Edit--field"
        resultProps={{
          resultClassName: "Edit--result",
          resultsClassName: "Edit--results",
          formatResult: clientName,
          getResults,
        }}
        inputProps={{
          name: "client",
          type: "text",
          tabIndex: 1,
        }}
        formDataValue={client || clientId}
        deleteFormValue={handleDelete}
        defaultValue={defaultValue}
        onEnter={handleSubmit}
        onSelect={handleSubmit}
        onCreate={openClient}
        onEdit={openClient}
      />
    </>
  );
};

const Location = ({ location, locationId, openLocation }) => {
  const defaultValue = locationName(location);
  const dispatch = useDispatch();
  const getResults = useCallback(async (params) => {
    const data = await placeRequests.get({ limit: 5, ...params });
    return data.places;
  }, []);
  const handleSubmit = ({ selectedResult: location }) => {
    dispatch(
      updateEventFormData({
        location,
        locationId: location.id,
      })
    );
  };
  const handleDelete = () => {
    dispatch(
      deleteEventFormData({
        location,
        locationId,
      })
    );
  };
  return (
    <>
      <label>Location</label>
      <SearchField
        className="Edit--field"
        resultProps={{
          resultClassName: "Edit--result",
          resultsClassName: "Edit--results",
          formatResult: locationName,
          getResults,
        }}
        inputProps={{
          name: "location",
          type: "text",
          tabIndex: 2,
        }}
        formDataValue={location || locationId}
        deleteFormValue={handleDelete}
        defaultValue={defaultValue}
        onEnter={handleSubmit}
        onSelect={handleSubmit}
        onCreate={openLocation}
        onEdit={openLocation}
      />
    </>
  );
};

const Kind = ({ kind = "" }) => {
  const [value, setValue, prevValue] = useTraceableState(kind);
  const dispatch = useDispatch();
  const handleChange = ({ target: { value } }) => setValue(value);
  useEffect(() => {
    setValue(kind);
  }, [kind, setValue]);
  useEffect(() => {
    if (value !== prevValue && value !== kind) {
      if (value) dispatch(updateEventFormData({ kind: value }));
      else if (kind) dispatch(deleteEventFormData({ kind }));
    }
  }, [dispatch, kind, prevValue, value]);
  return (
    <>
      <label>Kind</label>
      <div className="Edit--field">
        <input
          className="Input"
          type="text"
          name="kind"
          value={value}
          onChange={handleChange}
          tabIndex="3"
        />
      </div>
    </>
  );
};

const Package = ({ package: p = "" }) => {
  const [value, setValue, prevValue] = useTraceableState(p);
  const dispatch = useDispatch();
  const handleChange = ({ target: { value } }) => setValue(value);
  useEffect(() => {
    setValue(p);
  }, [p, setValue]);
  useEffect(() => {
    if (value !== prevValue && value !== p) {
      if (value) dispatch(updateEventFormData({ p: value }));
      else if (p) dispatch(deleteEventFormData({ p }));
    }
  }, [dispatch, p, prevValue, value]);
  return (
    <>
      <label>Package</label>
      <div className="Edit--field">
        <input
          className="Input"
          type="text"
          name="package"
          value={value}
          onChange={handleChange}
          tabIndex="4"
        />
      </div>
    </>
  );
};

const Action = ({ action = "" }) => {
  const [value, setValue, prevValue] = useTraceableState(action);
  const dispatch = useDispatch();
  const handleChange = ({ target: { value } }) => setValue(value);
  useEffect(() => {
    setValue(action);
  }, [action, setValue]);
  useEffect(() => {
    if (value !== prevValue && value !== action) {
      if (value) dispatch(updateEventFormData({ action: value }));
      else if (action) dispatch(deleteEventFormData({ action }));
    }
  }, [dispatch, action, prevValue, value]);
  return (
    <>
      <label>Action</label>
      <select
        className="Edit--field"
        name="action"
        value={value}
        onChange={handleChange}
        tabIndex="5"
      >
        <option></option>
        <option>Dial in Color</option>
        <option>Drive</option>
        <option>Drop Off</option>
        <option>Load In</option>
        <option>Load Out</option>
        <option>Load Truck</option>
        <option>Pick Up</option>
        <option>Rent Truck</option>
        <option>Return</option>
        <option>Run Montage</option>
        <option>Setup</option>
        <option>Site Check</option>
        <option>Strike</option>
      </select>
    </>
  );
};

export default Edit;
