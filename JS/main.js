//importing external JS files//
import {
  setSearchFocus,
  showClearTextButton,
  clearSearchText,
  clearPushListener,
} from './searchBar.js';

import {
  deleteSearchResults,
  buildSearchResults,
  clearStatsLine,
  setStatsLine,
} from './searchResults.js';
import { getSearchTerm, retrieveSearchResults } from './dataFunctions.js';

//check if page as loaded, if true, run application.//
document.addEventListener('readystatechange', (event) => {
  if (event.target.readyState === 'complete') {
    initApp();
  }
});

const initApp = () => {
  //set the focus//
  setSearchFocus();
  const search = document.getElementById('search');
  search.addEventListener('input', showClearTextButton);
  const clear = document.getElementById('clear');
  clear.addEventListener('click', clearSearchText);
  clear.addEventListener('keydown', clearPushListener);
  const form = document.getElementById('searchBar');
  //lissten for when the submit button is registerd//
  form.addEventListener('submit', submitTheSearch);
};

//call everything we need when the eventListner hears the submit event//
const submitTheSearch = (event) => {
  //prevent the from from re-loading the page//
  event.preventDefault();
  deleteSearchResults();
  processTheSearch();
  setSearchFocus();
  //TODO: clear the stats line//
};
const processTheSearch = async () => {
  clearStatsLine();
  const searchTerm = getSearchTerm();
  // if data is empty, return nothing//
  if (searchTerm === '') return;
  const resultArray = await retrieveSearchResults(searchTerm);
  if (resultArray.length) buildSearchResults(resultArray);
  setStatsLine(resultArray.length);
};
