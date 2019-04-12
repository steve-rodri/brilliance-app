require 'csv'
Inventory.destroy_all

#seed Inventory
Inventory.create!([
  {
    category: 'Photography',
    name: 'Rebel T4i',
    manufacturer: 'Canon',
    total_owned: 1,
    sell_price: 100,
  },
  {
    category: 'Lighting,Conventional',
    name: '19 deg. Ellipsoidal (LEKO)',
    manufacturer: 'ETC',
    total_owned: 8,
    sell_price: 75,
  },
  {
    category: 'Lighting,Moving Head',
    name: 'Mac Aura',
    manufacturer: 'Martin',
    total_owned: 12,
    sell_price: 200,
  },
  {
    category: 'Lighting,Moving Head',
    name: 'Mac Quantum',
    manufacturer: 'Martin',
    total_owned: 0,
    sell_price: 300,
  },
  {
    category: 'Sound,Boards',
    name: 'CFX-20',
    manufacturer: 'Mackie',
    total_owned: 1,
    sell_price: 100,
  },
  {
    category: 'Staging',
    name: "4' x 8' Black Stage",
    manufacturer: 'Wenger',
    total_owned: 40,
    sell_price: 100,
  },
  {
    category: 'Video,TV',
    name: '60 in. Plasma TV',
    manufacturer: 'LG',
    total_owned: 2,
    sell_price: 500,
  }
])

puts "There are now #{Inventory.count} rows in the Inventory table"
