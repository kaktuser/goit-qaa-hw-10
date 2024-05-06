import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  searchEl: document.querySelector('#search-box'),
  countryInfo: document.querySelector('.country-info'),
  countryList: document.querySelector('.country-list'),
};

// const country_list = document.querySelector('.country-list');

const clearMarkup = ref => (ref.innerHTML = '');

const inputHandler = e => {
  const textInput = e.target.value.trim();

  if (!textInput) {
    clearMarkup(refs.countryList);
    clearMarkup(refs.countryInfo);
    return;
  }

  fetchCountries(textInput)
    .then(data => {
      console.log(data);
      if (data.length > 10) {
        clearMarkup(refs.countryList);
        clearMarkup(refs.countryInfo);
        Notify.info(
          'Too many matches found. Please enter a more specific name'
        );
        return;
      }
      renderMarkup(data);
    })
    .catch(err => {
      clearMarkup(refs.countryList);
      clearMarkup(refs.countryInfo);
      Notify.failure('Oops..., there is no country with that name');
    });
};

const renderMarkup = data => {
  if (data.length === 1) {
    clearMarkup(refs.countryList);
    const markupInfo = createInfoMarkup(data);
    refs.countryInfo.innerHTML = markupInfo;
  } else {
    clearMarkup(refs.countryInfo);
    const markupList = createListMarkup(data);
    refs.countryList.innerHTML = markupList;
  }
};

const createListMarkup = data => {
  return data
    .map(
      ({ name, flags }) =>
        `<li><img src="${flags.png}" alt="${name.official}" width="40" height="25"><b> ${name.official}</b></li>`
    )
    .join('');
};

const createInfoMarkup = data => {
  return data.map(
    ({ name, capital, population, flags, languages }) =>
      `<h1><img src="${flags.png}" alt="${
        name.official
      }" width="40" height="20">
      ${name.official}</h1>
      <p><b>Capital</b>: ${capital}</p>
      <p><b>Population</b>: ${population}</p>
      <p><b>Languages</b>: ${Object.values(languages)}</p>`
  );
};

refs.searchEl.addEventListener('input', debounce(inputHandler, DEBOUNCE_DELAY));
