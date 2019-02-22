function styleConfirmation(msg){
  switch (msg) {
    case "Unconfirmed":
      return {
        backgroundColor: 'gold',
        fontWeight: 'bold',
        borderRadius: '10px',
        padding: '5px 15px',
      }
    case "Confirmed":
      return {
        backgroundColor: 'limegreen',
        fontWeight: 'bold',
        padding: '5px 15px',
        color: 'white',
        borderRadius: '10px',
      }
    case "Cancelled":
      return {
        backgroundColor: 'darkred',
        fontWeight: 'bold',
        padding: '5px 15px',
        color: 'white',
        borderRadius: '10px',
      }
    default:
      return {}
  }
}

function changeConfirmation(msg){
  switch (msg) {
    case "Unconfirmed":
      return "Confirmed"
    case "Confirmed":
      return "Cancelled"
    case "Cancelled":
      return "Unconfirmed"
    default:
    break;
  }
}

export {
  styleConfirmation,
  changeConfirmation
}
