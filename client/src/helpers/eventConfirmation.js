function styleConfirmation(msg){
  switch (msg) {
    case "Unconfirmed":
      return {
        color: 'white',
        fontWeight: 'bold',
        backgroundColor: 'rgba(210,210,0,1)',
        padding: '5px 15px',
      }
    case "Confirmed":
      return {
        backgroundColor: 'limegreen',
        fontWeight: 'bold',
        padding: '5px 15px',
        color: 'white',
      }
    case "Cancelled":
      return {
        backgroundColor: 'darkred',
        fontWeight: 'bold',
        padding: '5px 15px',
        color: 'white',
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
  changeConfirmation,
}
