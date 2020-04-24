import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { employeeRequests } from "../../../../../../services";
import { addEventWorker, deleteEventWorker } from "../../../../../../redux";
import "./index.css";

const StaffSelector = (props) => {
  const mobile = useSelector((state) => state.view.mobile);
  return (
    <div className="StaffSelector">
      <Header mobile={mobile} {...props} />
      <Main mobile={mobile} {...props} />
      <Footer mobile={mobile} {...props} />
    </div>
  );
};

const Header = ({ mobile }) => {
  if (!mobile) return null;
  return (
    <div className="StaffSelector--header">
      <h2>Choose Workers</h2>
    </div>
  );
};

const Main = (props) => {
  return (
    <main>
      <Labor {...props} />
      <NonLabor {...props} />
    </main>
  );
};

const Footer = ({ mobile, close }) => {
  if (mobile && typeof close === "function")
    return (
      <footer>
        <button
          className="StaffSelector--done EventDetail-Body--button"
          onClick={close}
        >
          DONE
        </button>
      </footer>
    );

  return null;
};

const Label = ({ show, text }) => {
  if (!show) return null;
  return <label style={{ justifySelf: "start" }}>{text}</label>;
};

const Labor = (props) => (
  <EmployeeGroup
    {...props}
    labelText="Labor"
    className="StaffSelector--labor"
    params={{ active: true, labor: true }}
  />
);

const NonLabor = (props) => {
  return (
    <EmployeeGroup
      {...props}
      labelText="Non Labor"
      className="StaffSelector--non-labor"
      params={{ active: true, labor: false }}
    />
  );
};

const EmployeeGroup = ({ className, params, labelText, ...rest }) => {
  const [employees, setEmployees] = useState([]);
  const getEmployees = useCallback(
    async (isSubscribed) => {
      const { employees } = await employeeRequests.get(params);
      if (isSubscribed) setEmployees(employees);
    },
    [params]
  );
  const dispatch = useDispatch();

  useEffect(() => {
    let isSubscribed = true;
    getEmployees(isSubscribed);
    return () => (isSubscribed = false);
  }, [getEmployees]);

  const handleSelect = (employee, isScheduled) => {
    if (isScheduled) {
      dispatch(deleteEventWorker(employee));
    } else {
      dispatch(addEventWorker(employee));
    }
  };
  return (
    <>
      <Label show={employees.length} text={labelText} />
      <div className={className}>
        {employees.map((employee, i) => (
          <Employee
            key={employee.id || i}
            employee={employee}
            onSelect={handleSelect}
            {...rest}
          />
        ))}
      </div>
    </>
  );
};

const Employee = ({ employee, onSelect, staff, mobile }) => {
  const isScheduled =
    staff && staff.find((worker) => worker.info.id === employee.id);
  const styleEmployee = () => {
    const style = {};
    if (isScheduled) {
      style.backgroundColor = "limegreen";
      style.border = "2px solid limegreen";
      style.color = "white";
      style.fontWeight = "bold";
    } else {
      style.border = "2px dashed var(--light-gray)";
      if (!mobile) {
        style.border = "1px solid #bbb";
        style.backgroundColor = "var(--white)";
      }
    }
    return style;
  };
  return (
    <div
      className="StaffSelector--employee"
      style={styleEmployee()}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(employee, isScheduled);
      }}
    >
      <p>{employee.contact.fullName}</p>
    </div>
  );
};

export default StaffSelector;
