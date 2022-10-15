export const getSearchTerm = () => {
  //gets the data from the search box and removes white space//
  const rawSearchTerm = document.getElementById('search').value.trim();
  //look for more than one space//
  const regex = /[ ]{2, }/gi;
  //find more than one space, remove them//
  const searchTerm = rawSearchTerm.replaceAll(regex, ' ');
  return searchTerm;
};
export const retrieveSearchResults = async (searchTerm) => {
  const wikiSearchString = getWikiSearchString(searchTerm);
  const wikiSearchResults = await requestData(wikiSearchString);
  //look for a property(query) in json//
  let resultArray = [];
  if (wikiSearchResults.hasOwnProperty('query')) {
    resultArray = processwikiResults(wikiSearchResults.query.pages);
  }
  return resultArray;
};

const getWikiSearchString = (searchTerm) => {
  //pass a value into a searchString//
  const maxChars = getMaxChars();
  //define raw search string//
  const rawSearchString = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${searchTerm}&gsrlimit=20&prop=pageimages|extracts&exchars=${maxChars}&exintro&explaintext&exlimit=max&format=json&origin=*`;
  const searchString = encodeURI(rawSearchString);
  return searchString;
};
const getMaxChars = () => {
  //get a value back of viewPort width//
  const width = window.innerWidth || document.body.clientWidth;
  //tell Wiki how many chars to return//
  let maxChars;
  if (width < 414) maxChars = 65;
  if (width >= 414 && width < 1400) maxChars = 100;
  if (width >= 1400) maxChars = 130;
  return maxChars;
};

const requestData = async (searchString) => {
  try {
    //await result from the fetch request//
    const response = await fetch(searchString);
    const data = await response.json();
    return data;
    //if an error, log to console//
  } catch (err) {
    console.error(err);
  }
};

const processwikiResults = (results) => {
  const resultArray = [];
  Object.keys(results).forEach((key) => {
    const id = key;
    const title = results[key].title;
    const text = results[key].extract;
    const img = results[key].hasOwnProperty('thumbnail')
      ? results[key].thumbnail.source
      : null;
    //pass object into array//
    const item = {
      id: id,
      title: title,
      img: img,
      text: text,
    };
    resultArray.push(item);
  });
  return resultArray;
};
