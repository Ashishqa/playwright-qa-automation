export const shippingAddresses = [
  {
    id: 1,
    phoneNumber: '+1-202-555-0173',
    street: '123 Main Street',
    city: 'New York',
    country: 'United States of America'
  },
  {
    id: 2,
    phoneNumber: '+44-20-7946-0958',
    street: '456 Oxford Street',
    city: 'London',
    country: 'United Kingdom'
  },
  {
    id: 3,
    phoneNumber: '+33-1-42-68-53-00',
    street: '789 Champs-Élysées',
    city: 'Paris',
    country: 'France'
  },
  {
    id: 4,
    phoneNumber: '+49-30-2000-0',
    street: '321 Unter den Linden',
    city: 'Berlin',
    country: 'Germany'
  },
  {
    id: 5,
    phoneNumber: '+81-3-6433-1111',
    street: '654 Shibuya Crossing',
    city: 'Tokyo',
    country: 'Japan'
  }
];

export const getShippingAddressById = (id) => {
  return shippingAddresses.find(addr => addr.id === id);
};

export const getShippingAddressByCity = (city) => {
  return shippingAddresses.find(addr => addr.city.toLowerCase() === city.toLowerCase());
};
