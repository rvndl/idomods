const BASE_URL = "https://brandstestowy.smallhost.pl/api";

function fetchRandom() {
  return fetch(`${BASE_URL}/random`)
    .then((response) => response.json())
    .then((data) => data.data);
}

export { fetchRandom };
