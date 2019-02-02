function styleConfirmation(msg){
  switch (msg) {
    case "Unconfirmed":
      return {
        backgroundColor: 'gold',
        fontWeight: 'bold',
        borderRadius: '10px',
        padding: '5px',
        width: '70%'
      }
    case "Confirmed":
      return {
        backgroundColor: 'limegreen',
        fontWeight: 'bold',
        padding: '5px',
        color: 'white',
        borderRadius: '10px',
        width: '70%'
      }
    case "Cancelled":
      return {
        backgroundColor: 'darkred',
        fontWeight: 'bold',
        padding: '5px',
        color: 'white',
        borderRadius: '10px',
        width: '70%'
      }
    default:
      return {}
  }
}

export {
  styleConfirmation
}
