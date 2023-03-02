import axios from 'axios';
import showAlert from './alerts';

export const fetchSignup = async (formData) => {
  const spinner = document.querySelector('.lds-dual-ring');
  try {
    spinner.classList.remove('hidden');
    const res = await axios({
      method: 'POST',
      url: 'http://localhost:3000/api/v1/users/signup',
      data: { ...formData, withCredentials: true },
    });

    if (res.data.status === 'success') {
      spinner.classList.add('hidden');
      showAlert('success', 'Logged in successfully');
      setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    spinner.classList.add('hidden');
    showAlert('error', err.response.data.message);
  }
};
