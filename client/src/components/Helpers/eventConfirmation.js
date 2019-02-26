function styleConfirmation(msg){
  switch (msg) {
    case "Unconfirmed":
      return {
        border: '2px solid rgba(210,210,0,1)',
        borderRadius: '5px',
        color: 'rgba(210,180,0,1)',
        backgroundColor: 'inherit',
        padding: '5px 15px',
      }
    case "Confirmed":
      return {
        backgroundColor: 'limegreen',
        fontWeight: 'bold',
        padding: '5px 15px',
        color: 'white',
        borderRadius: '5px',
      }
    case "Cancelled":
      return {
        backgroundColor: 'inherit',
        padding: '5px 15px',
        color: 'darkred',
        border: '2px solid darkred',
        borderRadius: '5px',
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
