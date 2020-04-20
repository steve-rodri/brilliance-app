import HTTPRequest from "../helpers/HTTPRequest";

const requestsForRoute = route => ({
  get: async ({ id, ...params }) =>
    await new HTTPRequest({ type: "GET", route, id, params }).execute(),
  create: async data =>
    await new HTTPRequest({ type: "POST", route, data }).execute(),
  update: async ({ id, ...params }, data) =>
    await new HTTPRequest({ type: "PUT", route, id, params, data }).execute(),
  delete: async ({ id, ...params }) =>
    await new HTTPRequest({ type: "DELETE", route, id, params }).execute()
});

export const eventRequests = requestsForRoute("/events");
export const clientRequests = requestsForRoute("/clients");
export const invoiceRequests = requestsForRoute("/invoices");
export const lineRequests = requestsForRoute("/lines");
export const itemRequests = requestsForRoute("/items");
export const inventoryRequests = requestsForRoute("/inventories");
export const workerRequests = requestsForRoute("/event_employees");
export const employeeRequests = requestsForRoute("/employees");
export const placeRequests = requestsForRoute("/places");
export const addressRequests = requestsForRoute("/addresses");
export const contactRequests = requestsForRoute("/contacts");
export const companyRequests = requestsForRoute("/companies");
export const emailAddressRequests = requestsForRoute("/email_addresses");
export const synchronizeGoogleEvents = async (events, adminCalendarId) =>
  await new HTTPRequest({
    type: "PUT",
    route: "/google/events",
    data: { events, adminCalendarId }
  }).execute();
