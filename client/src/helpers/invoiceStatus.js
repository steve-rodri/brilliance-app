export function styleStatus(paymentStatus, invoiceType) {
  if (invoiceType === 'Proposal') {
    return { display: 'none'}
  } else {
    switch (paymentStatus) {
      case 'Not Paid':
        return (
          {
            color:'white',
            backgroundColor:'darkred'

          }
        )
      case 'Outstanding Balance':
        return (
          {
            color:'white',
            backgroundColor:'rgba(210,210,0,1)'

          }
        )
      case 'Paid In Full':
        return (
          {
            color:'white',
            backgroundColor:'limegreen'

          }
        )
      case 'Partially Refunded':
        return (
          {
            color:'white',
            backgroundColor:'indianred'

          }
        )
      case 'Fully Refunded':
        return (
          {
            color:'white',
            backgroundColor:'indianred'

          }
        )
      default:
        return (
          {
            color:'white',
            backgroundColor:'darkred'

          }
        )
    }
  }
}
