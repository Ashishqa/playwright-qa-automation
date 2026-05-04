export const validUser = {
  username: 'admin@admin.com',
  password: 'admin123'
};

export const invalidUsers = [
  {
    username: 'invaliduser',
    password: 'admin123',
    description: "Bad credentials! Please try again! Make sure that you've registered."
  },
  {
    username: 'admin@admin.com',
    password: 'WrongPassword',
    description: "Bad credentials! Please try again! Make sure that you've registered."
  },
  {
    username: '',
    password: '',
    description: "Bad credentials! Please try again! Make sure that you've registered."
  },
  {
    username: 'admin@admin.com',
    password: '',
    description: "Bad credentials! Please try again! Make sure that you've registered."
  },
  {
    username: '',
    password: 'admin123',
    description: "Bad credentials! Please try again! Make sure that you've registered."
  }
];

export const users = {
  valid: validUser,
  invalid: invalidUsers
};
