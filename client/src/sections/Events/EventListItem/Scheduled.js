import React from "react";
import { ListItemCell } from "../../../components/ListItem";
import { initials, styleWorkerStatus } from "../../../helpers";
import "./index.css";

const Scheduled = ({ event: e }) => {
  const render = () => {
    if (!e.staff || !e.staff.length) return <NoneScheduled />;
    return <ScheduledWorkers workers={e.staff} />;
  };
  return (
    <ListItemCell>
      <div className="EventListItem--scheduled">{render()}</div>
    </ListItemCell>
  );
};

const NoneScheduled = () => {
  return (
    <div
      className="EventListItem--scheduled-details"
      style={{ gridRow: "1 / span 2" }}
    >
      <p style={{ color: "darkred" }}>-----</p>
    </div>
  );
};

const ScheduledWorkers = ({ workers }) => {
  return (
    <div className="EventListItem--scheduled-workers">
      {workers.map(worker => (
        <WorkerIcon key={worker.id} {...worker} />
      ))}
    </div>
  );
};

const WorkerIcon = ({ id, confirmation, info: { contact } }) => {
  return (
    <div
      key={id}
      className="EventListItem--scheduled-worker"
      style={styleWorkerStatus(confirmation)}
    >
      <p>{initials(contact.fullName)}</p>
    </div>
  );
};

export default Scheduled;
