export const products = [
  {
    id: 1,
    name: 'Apple iPhone 12, 128GB, Black',
    price: '$905.99'
  },
  {
    id: 2,
    name: 'Huawei Mate 20 Lite, 64GB, Black',
    price: '$236.12'
  },
  {
    id: 3,
    name: 'Samsung Galaxy A32, 128GB, White',
    price: '$286.99'
  },
  {
    id: 4,
    name: 'Apple iPhone 13, 128GB, Blue',
    price: '$918.99'
  },
  {
    id: 5,
    name: 'Nokia 105, Black',
    price: '$19.99'
  }
];

export const getProductById = (id) => {
  return products.find(p => p.id === id);
};

export const getProductByName = (name) => {
  return products.find(p => p.name.toLowerCase().includes(name.toLowerCase()));
};
