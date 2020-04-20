import React from "react";
import About from "./About";
import Logistics from "./Logistics";
import Notes from "./Notes";
import Staff from "./Staff";
import Invoice from "./Invoice";
import Loader from "../../../../components/Loader";
import { useSelector } from "react-redux";
import "./index.css";

const Body = props => {
  const styleComponents = () => {
    const { editMode, mobile } = props;
    let style = {};
    if (!mobile) {
      style.gridTemplateColumns = "repeat(auto-fit, minmax(17.25rem, auto))";
      if (editMode) {
        style.gridTemplateColumns = "repeat(auto-fit, minmax(21rem, auto))";
      }
    }
    return style;
  };

  const { data, loading } = useSelector(state => state.section.events.form);
  if (loading)
    return (
      <div className="EventDetail-Body--loader">
        <Loader />
      </div>
    );
  if (data && !loading)
    return (
      <main>
        <div className="EventDetail-Body--components-container">
          <div
            className="EventDetail-Body--components"
            style={styleComponents()}
          >
            <About {...props} {...data} />
            <Logistics {...props} {...data} />
            <Staff {...props} {...data} />
            <Invoice {...props} {...data} />
            <Notes {...props} {...data} />
          </div>
        </div>
      </main>
    );
};

export default Body;

// const about =
//   fields &&
//   (fields.client || fields.location || date(fields) || time(fields));
//
// const showInvoice =
//   !isNew &&
//   !editMode &&
//   evt &&
//   ((evt.client && !evt.invoice) ||
//     (!evt.client && evt.invoice) ||
//     (evt.client && evt.invoice));
// const showStaff = editMode || (evt && evt.staff && evt.staff.length);

// {showStaff ? (
//   <Staff
//     {...props}

//     styleContainer={styleContainer}
//   />
// ) : null}
// {showInvoice ? (
//   <Invoice
//     {...props}
//     styleComp={styleComp}
//     styleContainer={styleContainer}
//   />
// ) : null}
// {editMode || !isNullOrWhitespace(fields.notes) ? (
//   <Notes
//     {...props}
//     styleComp={styleComp}
//     styleContainer={styleContainer}
//   />
// ) : null}
