export const styleConfirmationStatus = msg => {
  switch (msg) {
    case "Unconfirmed":
      return {
        backgroundColor: "gold",
        color: "black"
      };
    case "Confirmed":
      return {
        backgroundColor: "limegreen",
        color: "white"
      };
    case "Cancelled":
      return {
        backgroundColor: "darkred",
        color: "white"
      };
    default:
      return {};
  }
};

export const changeConfirmationStatus = msg => {
  switch (msg) {
    case "Unconfirmed":
      return "Confirmed";
    case "Confirmed":
      return "Cancelled";
    case "Cancelled":
      return "Unconfirmed";
    default:
      break;
  }
};

export const styleWorkerStatus = confirmation => {
  let style = {};
  switch (confirmation) {
    case "needsAction":
      style.backgroundColor = "gold";
      style.color = "black";
      break;
    case "Unconfirmed":
      style.backgroundColor = "gold";
      style.color = "black";
      break;
    case "accepted":
      style.backgroundColor = "limegreen";
      style.color = "white";
      break;
    case "Confirmed":
      style.backgroundColor = "limegreen";
      style.color = "white";
      break;
    case "tentative":
      style.backgroundColor = "gold";
      style.color = "black";
      break;
    case "declined":
      style.backgroundColor = "red";
      style.color = "white";
      break;
    default:
      break;
  }
  return style;
};

export const changeWorkerStatus = confirmation => {
  switch (confirmation) {
    case "needsAction":
      return "accepted";

    case "Unconfirmed":
      return "accepted";

    case "accepted":
      return "declined";

    case "Confirmed":
      return "declined";

    case "tentative":
      return "accepted";

    case "declined":
      return "tentative";

    default:
      break;
  }
};
