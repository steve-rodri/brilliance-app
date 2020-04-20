import React from "react";
import { statusIcon } from "../../../../../icons";
import { call, styleWorkerStatus } from "../../../../../helpers/eventHelpers";

const View = props => {
  return (
    <div className="Staff">
      <Call {...props} />
      <Workers {...props} />
    </div>
  );
};

const Call = ({ callTime, callLocation }) => {
  if (!callTime && !callLocation) return null;
  return (
    <div className="Staff--call">
      <h3>{`Call: ${call({ callTime, callLocation })}`}</h3>
    </div>
  );
};

const Workers = ({ staff }) => {
  if (!staff || (staff && !staff.length)) return null;
  return (
    <div className="Staff--workers">
      {staff.map(data => (
        <Worker {...data} />
      ))}
    </div>
  );
};

const Worker = ({ id, confirmation, info: { contact } }) => {
  return (
    <div className="Staff--worker" key={id}>
      <WorkerStatus status={confirmation} />
      <WorkerName contactInformation={contact} />
    </div>
  );
};

const WorkerStatus = ({ status }) => (
  <div className="Staff-worker-status" style={styleWorkerStatus(status)}>
    {statusIcon(status, "1x")}
  </div>
);

const WorkerName = ({ contactInformation: { fullName } }) => (
  <p className="Staff--worker-name">{fullName}</p>
);

export default View;
