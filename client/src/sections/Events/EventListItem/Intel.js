import React from "react";
import { ListItemCell } from "../../../components/ListItem";
import { clientDisplay, locationName } from "../../../helpers";
import "./index.css";

const Intel = ({ event: e }) => {
  if (!e.client || !e.location) return null;
  return (
    <ListItemCell>
      {e.client && clientDisplay(e.client)}
      {e.location && <p>{locationName(e.location)}</p>}
    </ListItemCell>
  );
};

export default Intel;
