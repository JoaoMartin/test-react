export interface User {
    login: {
      uuid: string;
    };
    picture: {
      thumbnail: string;
    };
    name: {
      first: string;
      last: string;
    };
    gender: string;
    location: {
      street: {
        name: string;
        number: number;
      };
      country: string;
    };
    phone: string;
    email: string;
  }
  