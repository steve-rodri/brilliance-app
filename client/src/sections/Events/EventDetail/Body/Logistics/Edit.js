import React, { useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useTraceableState } from "../../../../../hooks";
import { updateEventFormData, deleteEventFormData } from "../../../../../redux";
import { placeRequests } from "../../../../../services";
import DateSelector from "../../../../../components/DateSelector";
import SearchField from "../../../../../components/SearchField";
import { locationName } from "../../../../../helpers/locationName";
import moment from "moment";

const Edit = (props) => {
  return (
    <div className="Logistics">
      <Call {...props} />
      <CallLocation {...props} />
      <Start {...props} />
      <End {...props} />
    </div>
  );
};

const Call = ({ callTime, start, ...rest }) => {
  const [value, setValue, prevValue] = useTraceableState(callTime || "");
  const dispatch = useDispatch();
  const handleChange = (value) => {
    if (moment(value).isSameOrBefore(moment(start))) {
      setValue(value);
    }
  };
  useEffect(() => {
    setValue(callTime);
  }, [callTime, setValue]);
  useEffect(() => {
    if (value !== prevValue && value !== callTime) {
      if (value)
        dispatch(
          updateEventFormData({ callTime: moment(value).toISOString(true) })
        );
      else if (callTime) dispatch(deleteEventFormData({ callTime }));
    }
  }, [dispatch, callTime, prevValue, value]);
  return (
    <>
      <label>Call</label>
      <DateSelector
        viewMode="time"
        name="call"
        value={value}
        viewDate={
          callTime
            ? moment(callTime)
            : start
            ? moment(start)
            : moment().startOf("hour")
        }
        isValidDate={(current) =>
          current.isSameOrBefore(moment(start), "minute")
        }
        onDateChange={handleChange}
      />
    </>
  );
};

const CallLocation = ({ callLocation, callLocationId, openCallLocation }) => {
  const dispatch = useDispatch();
  const handleEnter = ({ selectedResult: callLocation }) => {
    dispatch(
      updateEventFormData({
        callLocation,
        callLocationId: callLocation.id,
      })
    );
  };
  const handleSelect = ({ selectedResult: callLocation }) => {
    dispatch(
      updateEventFormData({
        callLocation: callLocation,
        callLocationId: callLocation.id,
      })
    );
  };
  const handleDelete = () => {
    dispatch(
      deleteEventFormData({
        callLocation,
        callLocationId,
      })
    );
  };
  const getResults = useCallback(async (params) => {
    const data = await placeRequests.get({ limit: 5, ...params });
    return data.places;
  }, []);
  const defaultValue = locationName(callLocation);
  return (
    <>
      <label>Call Location</label>
      <SearchField
        className="Edit--field"
        resultProps={{
          resultClassName: "Edit--result",
          resultsClassName: "Edit--results",
          formatResult: locationName,
          getResults,
        }}
        inputProps={{
          name: "call location",
          type: "text",
          tabIndex: 6,
        }}
        formDataValue={callLocation || callLocationId}
        deleteFormValue={handleDelete}
        defaultValue={defaultValue}
        onEnter={handleEnter}
        onSelect={handleSelect}
        onCreate={openCallLocation}
        onEdit={openCallLocation}
      />
    </>
  );
};

const Start = ({ start, ...rest }) => {
  const [value, setValue, prevValue] = useTraceableState(start || "");
  const dispatch = useDispatch();
  const handleChange = (value) => setValue(value);
  useEffect(() => {
    setValue(start);
  }, [start, setValue]);
  useEffect(() => {
    if (value !== prevValue && value !== start) {
      dispatch(updateEventFormData({ start: moment(value).toISOString(true) }));
    }
  }, [dispatch, start, prevValue, value]);
  return (
    <>
      <label>Start</label>
      <DateSelector
        {...rest}
        viewMode="days"
        name="start"
        value={value}
        viewDate={moment(start) || moment().startOf("hour")}
        onDateChange={handleChange}
      />
    </>
  );
};

const End = ({ end, start, ...rest }) => {
  const [value, setValue, prevValue] = useTraceableState(end || "");
  const dispatch = useDispatch();
  const handleChange = (value) => {
    if (moment(value).isAfter(moment(start))) {
      setValue(value);
    }
  };
  useEffect(() => {
    setValue(end);
  }, [end, setValue]);
  useEffect(() => {
    if (value !== prevValue && value !== end) {
      dispatch(updateEventFormData({ end: moment(value).toISOString(true) }));
    }
  }, [dispatch, end, prevValue, value]);
  return (
    <>
      <label>End</label>
      <DateSelector
        {...rest}
        viewMode="time"
        name="end"
        value={end}
        viewDate={
          start ? moment(start) : end ? moment(end) : moment().startOf("hour")
        }
        isValidDate={(current) => current.isSameOrAfter(moment(start), "day")}
        onDateChange={handleChange}
      />
    </>
  );
};

export default Edit;
