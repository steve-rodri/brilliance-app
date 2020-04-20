import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import BodyComponent from "../BodyComponent";
import AddNew from "../../../../../components/Buttons/AddNew";
import { styleStatus } from "../../../../../helpers/invoiceStatus";
import numeral from "numeral";
import "./index.css";

const EventInvoice = ({ id, invoice, client }) => {
  const styleEventInvoice = () => {
    let style = {};
    if (client && !invoice) style.grid = "auto / auto";
    return style;
  };
  const render = () => {
    if (client && !invoice) return <NoInvoice eventId={id} />;
    return (
      <>
        <Summary invoice={invoice} />
        <ViewInvoiceButton id={invoice.id} />
      </>
    );
  };
  if (!client && !invoice) return null;
  return (
    <BodyComponent className="EventDetail-Body--invoice" titleText="Invoice">
      <div className="Event-Invoice" style={styleEventInvoice()}>
        {render()}
      </div>
    </BodyComponent>
  );
};

const NoInvoice = ({ eventId }) => {
  const accessLevel = useSelector(state => state.user.accessLevel);
  return (
    <div className="Event-Invoice--no-invoice">
      <h1>--</h1>
      <AddNew
        linkPath={{
          pathname: `/${accessLevel}/invoices/new`,
          state: { eventId }
        }}
        type="Invoice"
      />
    </div>
  );
};

const Summary = ({ invoice }) => {
  return (
    <div className="Event-Invoice--summary">
      <Total {...invoice} />
      <Status {...invoice} />
    </div>
  );
};

const ViewInvoiceButton = ({ id }) => {
  const accessLevel = useSelector(state => state.user.accessLevel);
  return (
    <Link to={`/${accessLevel}/invoices/${id}`}>
      <button className="Event-Invoice--view-invoice-button">
        <p>View Invoice</p>
      </button>
    </Link>
  );
};

const Total = ({ total }) => {
  return (
    <div className="Event-Invoice--total">
      <div>
        <h2>{numeral(total).format("$0,0.00")}</h2>
      </div>
    </div>
  );
};

const Status = ({ kind, paymentStatus, paymentType, check }) => {
  if (kind === "Proposal") return null;
  return (
    <>
      <PaymentStatus paymentStatus={paymentStatus} />
      <PaymentType paymentType={paymentType} check={check} />
    </>
  );
};

const PaymentStatus = ({ paymentStatus }) => {
  const stylePaymentStatus = status => {
    let style = styleStatus(status);
    style.padding = "5px 15px";
    return style;
  };
  return (
    <div
      className="Event-Invoice--status"
      style={stylePaymentStatus(paymentStatus)}
    >
      <p>{paymentStatus}</p>
    </div>
  );
};

const PaymentType = ({ paymentType, check }) => {
  if (paymentType && paymentType === "Unknown") return null;
  return (
    <div>
      {check ? <p>{paymentType}</p> : <p>{`${paymentType} - ${check}`}</p>}
    </div>
  );
};

export default EventInvoice;
