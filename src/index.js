import './css/styles.css';
import { fetchCountries } from './js/fetchCountries.js';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const inputEl = document.querySelector('#search-box');
const listEl = document.querySelector('.country-list');
const infoEl = document.querySelector('.country-info');

listEl.style.listStyle = 'none';

inputEl.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
  e.target.value = e.target.value.trim();

  if (e.target.value === '') {
    clearElement(infoEl);
    clearElement(listEl);
    return;
  }
  fetchCountries(e.target.value)
    .then(countries => {
      if (countries.length > 10) {
        clearElement(infoEl);
        clearElement(listEl);
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
      if (countries.length >= 2 && countries.length <= 10) {
        clearElement(infoEl);
        clearElement(listEl);
        createList(countries);
      }
      if (countries.length === 1) {
        clearElement(listEl);
        clearElement(infoEl);
        createCard(countries);
      }
    })
    .catch(error => {
      clearElement(infoEl);
      clearElement(listEl);
      Notify.failure('Oops, there is no country with that name');
    });
}

function clearElement(el) {
  return (el = el.innerHTML = '');
}

function createList(countries) {
  const newItem = countries
    .map(
      ({ name, flags }) =>
        `<li><img src="${flags.svg}" alt="flag" width="30">   ${name.official}</li>`
    )
    .join('');
  listEl.insertAdjacentHTML('beforeend', newItem);
  return newItem;
}
function createCard(countries) {
  const newItem2 = countries
    .map(
      ({ name, capital, population, flags, languages }) =>
        ` 
          <h1><img src="${flags.svg}" alt="flag" width="50"> ${
          name.official
        }</h1>
          <p><b>Capital</b>:   ${capital}</p>
          <p><b>Population</b>:   ${population}</p>
          <p><b>Languages</b>:   ${Object.values(languages)}</p>
          
        `
    )
    .join('');
  infoEl.insertAdjacentHTML('beforeend', newItem2);
  return newItem2;
}


