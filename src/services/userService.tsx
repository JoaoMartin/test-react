import axios from 'axios';
import { User } from '../interfaces/User';

const API_URL = 'https://randomuser.me/api/';

interface UserFilters {
  gender?: string;
  nat?: string;
}

export const fetchUsers = async (filters: UserFilters): Promise<User[]> => {
  const { gender, nat } = filters;
  const response = await axios.get(API_URL, {
    params: {
      results: 10,
      gender: gender || '',
      nat: nat || '',
    },
  });
  return response.data.results;
};
