import API from './api';

export const login = async payload => {
  try {
    const { data } = await API.post('/login', payload);
    return data;
  } catch (error) {
    console.error('Login error:', error);
  }
};
