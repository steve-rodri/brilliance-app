import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateEventFormData } from "../../../../../redux";
import SearchField from "../../../../../components/SearchField/";
import { useTraceableState } from "../../../../../hooks";
import { clientRequests, placeRequests } from "../../../../../services";
import { clientName } from "../../../../../helpers/clientHelpers";
import { locationName } from "../../../../../helpers/locationName";

//props
// openClient: () => showModal("Client")
// openLocation: () => showModal("Location")
// openCallLocation: () => showModal("Call Location")

const Edit = props => {
  const data = useSelector(state => state.section.events.form);
  return (
    <div className="About">
      <Client {...props} {...data} />
      <Location {...props} {...data} />
      <Kind {...props} {...data} />
      <Package {...props} {...data} />
      <Action {...props} {...data} />
    </div>
  );
};

const Client = ({ client, clientId, openClient }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [value, setValue, prevValue] = useTraceableState(clientName(client));
  const dispatch = useDispatch();

  const handleEnter = ({ selectedResult: client }) => {
    dispatch(
      updateEventFormData({
        client,
        clientId: client.id
      })
    );
    setValue(clientName(client));
  };

  const handleSelect = ({ selectedResult: client }) => {
    dispatch(
      updateEventFormData({
        client: client,
        clientId: client.id
      })
    );
    setValue(clientName(client));
  };

  const handleChange = async value => setValue(value);

  const fetchResults = useCallback(
    async isSubscribed => {
      if (!value || !isSubscribed) return;
      const valueLength = value.split("").length;
      const getResults = async () => {
        const data = await clientRequests.get({ q: value, limit: 3 });
        if (data) setSearchResults(data.clients);
      };
      if (valueLength > 2) {
        if (prevValue) {
          const prevValueLength = prevValue.split("").length;
          if (valueLength > prevValueLength) await getResults();
        } else {
          await getResults();
        }
      }
    },
    [prevValue, value]
  );

  useEffect(() => {
    let isSubscribed = true;
    fetchResults(isSubscribed);
    return () => (isSubscribed = false);
  }, [value, prevValue, fetchResults]);
  return (
    <>
      <label>Client</label>
      <SearchField
        formClassName="Edit--field"
        resultClassName="Edit--result"
        resultsClassName="Edit--results"
        searchResults={searchResults}
        formatResult={clientName}
        formDataValue={client || clientId}
        inputProps={{
          name: "client",
          value: value,
          tabIndex: 1
        }}
        onChange={handleChange}
        onEnter={handleEnter}
        onSelect={handleSelect}
        onCreate={openClient}
        onEdit={openClient}
      />
    </>
  );
};

const Location = ({ location, locationId, openLocation }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [value, setValue, prevValue] = useTraceableState(
    locationName(location)
  );
  const dispatch = useDispatch();

  const handleEnter = ({ selectedResult: location }) => {
    console.log(location);
    dispatch(
      updateEventFormData({
        location,
        locationId: location.id
      })
    );
    setValue(locationName(location));
  };

  const handleSelect = ({ selectedResult: location }) => {
    dispatch(
      updateEventFormData({
        location: location,
        locationId: location.id
      })
    );
    setValue(locationName(location));
  };

  const handleChange = async value => setValue(value);

  const fetchResults = useCallback(async () => {
    if (!value) return;
    const valueLength = value.split("").length;
    const getResults = async () => {
      const data = await placeRequests.get({ q: value, limit: 3 });
      if (data) setSearchResults(data.places);
    };
    if (valueLength > 2) {
      if (prevValue) {
        const prevValueLength = prevValue.split("").length;
        if (valueLength > prevValueLength) await getResults();
      } else {
        await getResults();
      }
    }
  }, [prevValue, value]);

  useEffect(() => {
    fetchResults();
  }, [value, prevValue, fetchResults]);
  return (
    <>
      <label>Location</label>
      <SearchField
        formClassName="Edit--field"
        resultClassName="Edit--result"
        resultsClassName="Edit--results"
        searchResults={searchResults}
        formatResult={locationName}
        formDataValue={location || locationId}
        inputProps={{
          className: "Input",
          name: "location",
          value: value,
          tabIndex: 1
        }}
        onChange={handleChange}
        onEnter={handleEnter}
        onSelect={handleSelect}
        onCreate={openLocation}
        onEdit={openLocation}
      />
    </>
  );
};

const Kind = ({ kind }) => {
  const [value, setValue] = useState(kind);
  const dispatch = useDispatch();
  const handleChange = ({ target: { value } }) => setValue(value);
  useEffect(() => {
    dispatch(updateEventFormData({ kind: value }));
  }, [dispatch, value]);
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

const Package = ({ package: p }) => {
  const [value, setValue] = useState(p);
  const dispatch = useDispatch();
  const handleChange = ({ target: { value } }) => setValue(value);
  useEffect(() => {
    dispatch(updateEventFormData({ package: value }));
  }, [dispatch, value]);
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

const Action = ({ action }) => {
  const [value, setValue] = useState(action);
  const dispatch = useDispatch();
  const handleChange = ({ target: { value } }) => setValue(value);
  useEffect(() => {
    dispatch(updateEventFormData({ action: value }));
  }, [dispatch, value]);
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
