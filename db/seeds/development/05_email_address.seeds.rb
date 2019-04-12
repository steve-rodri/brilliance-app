EmailAddress.destroy_all

EmailAddress.create!([
  {
    email_address: 'michael_scott@dundermifflin.com',
    contact_id: 1,
  },
  {
    email_address: 'pam_beasely@dundermifflin.com',
    contact_id: 2,
  },
  {
    email_address: 'jim_halpert@dundermifflin.com',
    contact_id: 3,
  },
  {
    email_address: 'dwight_schrute@schrutefarms.com',
    contact_id: 4,
    company_id: 2
  },
  {
    email_address: 'steve_smith@dundermifflin.com',
    contact_id: 5,
  },
  {
    email_address: 'dave_jones@gmail.com',
    contact_id: 6,
  },
  {
    email_address: 'natasha_smith@gmail.com',
    contact_id: 7,
  },
])
