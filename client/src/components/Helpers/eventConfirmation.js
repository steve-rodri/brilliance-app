function styleConfirmation(msg){
  switch (msg) {
    case "Unconfirmed":
      return {
        border: '2px dashed rgba(210,210,0,1)',
        color: 'rgba(210,180,0,1)',
        backgroundColor: 'inherit',
        padding: '5px 15px',
        borderRadius: '3px'
      }
    case "Confirmed":
      return {
        backgroundColor: 'limegreen',
        fontWeight: 'bold',
        padding: '5px 15px',
        color: 'white',
        borderRadius: '3px'
      }
    case "Cancelled":
      return {
        backgroundColor: 'darkred',
        fontWeight: 'bold',
        padding: '5px 15px',
        color: 'white',
        borderRadius: '3px'
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
