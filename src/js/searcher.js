import axios from 'axios';
// axios.defaults.headers.common['x-api-key'] =
//   'live_FZepRFg8FuRHMrH9K01MmohQZHWyZkU7tHDFcCE5ET63fBDMIofv93QFs4EW4wN9';

const BASE_URL = 'https://pixabay.com/api/';

// Початковий запрос
const fetchImg = async (findValue, onPage, currentPage) => {
  const options = new URLSearchParams({
    key: '39143786-0ff2c921daf19103e1ab64df2',
    q: findValue,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: currentPage,
    per_page: onPage,
  });

  const response = await axios.get(`${BASE_URL}?${options}`);
  console.log(response.data);
  return response.data;
};

export { fetchImg };
