import React, { useRef } from "react";
import { Link } from "react-router-dom";
import Schedule from "./Schedule";
import EventListItem from "../../sections/Events/EventListItem";
import Invoice from "./Invoice";
import Client from "./Client";
import Staff from "./Staff";
import "./index.css";

export const ListItem = ({ children, linkTo, style = {} }) => {
  return (
    <Link to={linkTo} style={{ textDecoration: "none", color: "black" }}>
      <div className="List-Item" style={style}>
        {children}
      </div>
    </Link>
  );
};

export const ListItemCell = ({ children, className = "", style = {} }) => (
  <div className="List-Item-Cell" style={style}>
    {children}
  </div>
);

export const Item = props => {
  const container = useRef();
  const scrollToPosition = () => {
    if (container.current) {
      container.current.scrollIntoView();
    }
  };
  if (!props.item) return null;
  return (
    <div ref={container}>
      <ItemByType scrollToPosition={scrollToPosition} {...props} />
    </div>
  );
};

const ItemByType = props => {
  switch (props.collectionType) {
    case "Scheduled Events":
      return <Schedule {...props} />;
    case "Events":
      return <EventListItem {...props} />;
    case "Invoices":
      return <Invoice {...props} />;
    case "Clients":
      return <Client {...props} />;
    case "Workers":
      return <Staff {...props} />;
    default:
      return null;
  }
};

export default ListItem;

// const styleMobileEventSummary = () => {
//   const { item: e } = props;
//   if (e && e.summary && e.summary.length > 30) {
//     return { fontSize: "15px" };
//   } else {
//     return {};
//   }
// };

// const styleItem = (item, collectionType) => {
//   const { total, index, isMonth } = props;
//   const style = {};
//   switch (collectionType) {
//     case "Events":
//       const event = item;
//       // const past = event && event.end && moment(event.end).isBefore(moment())
//       // const inProgress = event && event.start && event.end && moment(event.start).isSameOrBefore(moment()) && moment(event.end).isSameOrAfter(moment())
//       const nextEvent = event && event.isNextEvent;
//       // const iCalUID = event && event.gcICalUid;
//
//       // if (past) {
//       //   style.color = 'rgba(0,0,0,.5)'
//       //   style.backgroundColor = '#999999'
//       // }
//
//       // if (inProgress) {
//       //   style.color = 'var(--white)'
//       //   style.backgroundColor = 'var(--light-blue)'
//       // }
//
//       if (nextEvent && isMonth()) {
//         style.borderTop = "2px solid red";
//       }
//
//       // if (iCalUID) {
//       //   style.backgroundColor = 'blue'
//       // }
//       break;
//
//     default:
//       break;
//   }
//
//   if (index + 1 === total) {
//     style.borderBottom = "none";
//   }
//
//   return style;
// };
