import React, { Component } from "react";
import DateSelector from "../../../../../components/DateSelector";
import SearchField from "../../../../../components/SearchField";
import { locationName } from "../../../../../helpers/locationName";
import moment from "moment";

export default class Edit extends Component {
  render() {
    const { fields, searchFieldData } = this.props;
    if (!fields) return null;

    return (
      <div className="Logistics">
        <label>Call</label>
        <DateSelector
          {...this.props}
          viewMode="time"
          name="call"
          value={fields.callTime}
          viewDate={
            fields.start
              ? moment(fields.start)
              : fields.callTime
              ? moment(fields.callTime)
              : moment().startOf("hour")
          }
          isValidDate={current =>
            current.isSameOrBefore(moment(fields.start), "day")
          }
        />

        <label>Call Location</label>
        <SearchField
          {...this.props}
          searchResults={searchFieldData && searchFieldData.callLocations}
          formClassName="Edit--Field"
          resultsClassName="Edit--results"
          resultClassName="Edit--result"
          formDataValue={
            this.props.formData && this.props.formData.call_location_id
          }
          formatResult={locationName}
          input={{
            className: "Input",
            name: "callLocation",
            value: fields.callLocation ? fields.callLocation : "",
            tabIndex: 9
          }}
          handleChange={this.props.handleSearchChange}
          onEnter={this.props.onEnter}
          onSelect={this.props.onSelect}
          create={this.props.openCallLocation}
          edit={this.props.openCallLocation}
        />

        <label>Start</label>
        <DateSelector
          {...this.props}
          viewMode="days"
          name="start"
          value={fields.start}
          viewDate={moment(fields.start) || moment().startOf("hour")}
        />

        <label>End</label>
        <DateSelector
          {...this.props}
          viewMode="time"
          name="end"
          value={fields.end}
          viewDate={
            fields.start
              ? moment(fields.start)
              : fields.end
              ? moment(fields.end)
              : moment().startOf("hour")
          }
          isValidDate={current =>
            current.isSameOrAfter(moment(fields.start), "day")
          }
        />
      </div>
    );
  }
}
