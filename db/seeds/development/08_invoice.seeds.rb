Invoice.destroy_all

#seed Invoices
Invoice.create! ([
  {
    kind: 'On Premise Contract',
    status: 'Email Sent',
    payment_status: 'Paid In Full',
    payment_type: 'Check',
    commission_paid: '1',
    check_info: 'Chase Bank Check#1234',
    discount: 250,
    tip: 0,

    event_id: 1
  },
  {
    kind: 'On Premise Contract',
    status: 'Email Sent',
    payment_status: 'Paid In Full',
    payment_type: 'Check',
    commission_paid: '1',
    check_info: 'Chase Bank Check#1234',
    discount: 250,
    tip: 0,

    event_id: 2
  },
  {
    kind: 'On Premise Contract',
    status: 'Email Sent',
    payment_status: 'Paid In Full',
    payment_type: 'Check',
    commission_paid: '1',
    check_info: 'Chase Bank Check#1234',
    discount: 250,
    tip: 0,

    event_id: 3
  },
  {
    kind: 'On Premise Contract',
    status: 'Email Sent',
    payment_status: 'Paid In Full',
    payment_type: 'Check',
    commission_paid: '1',
    check_info: 'Chase Bank Check#1234',
    discount: 250,
    tip: 0,

    event_id: 4
  },
  {
    kind: 'Production',
    event_id: 5
  }
])
puts "There are now #{Invoice.count} rows in the Invoices table"
