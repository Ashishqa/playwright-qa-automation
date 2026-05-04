const environments = {
  staging: {
    baseURL: 'https://qa-practice.netlify.app',
    credentials: {
      valid: {
        username: 'admin@admin.com',
        password: 'admin123'
      },
      invalid: [
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
        }
      ]
    }
  },
  production: {
    baseURL: 'https://qa-practice.netlify.app',
    credentials: {
      valid: {
        username: 'admin@admin.com',
        password: 'admin123'
      },
      invalid: [
        {
          username: 'invaliduser',
          password: 'admin123',
          description: "Bad credentials! Please try again! Make sure that you've registered."
        },
        {
          username: 'admin@admin.com',
          password: 'WrongPassword',
          description: "Bad credentials! Please try again! Make sure that you've registered."
        }
      ]
    }
  }
};

export default environments;
