Place.destroy_all

#seed Places
Place.create! ([
  {
    installation: false,
    name: 'Crest Hollow Country Club',
    short_name: 'CHCC',

    address_id: 1
  },
  {
    installation: true,
    name: 'Carlyle at the Palace',
    short_name: 'CATP',
    commission: 0.5,

    address_id: 2
  },
  {
    installation: true,
    name: 'The Heritage Club',
    short_name: 'THC',
    commission: 0.5,

    address_id: 3
  }
])
