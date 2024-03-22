// get references to html elements
const searchForm = $('#search-form');
const textInput = $('#text-input');
const submitBtn = $('#submit-btn');
const historyContainer = $('#history-container');
const resultsContainer = $('#results-container');

// openweathermap api key
const API_KEY = "227ca1573a3af857ae2b452b0dc9fe17";

// function to convert city name into long/lat
const getLongLat = function (cityName) {

	// variable to store long and lat
	let longLat = "";

	// geocoding request url
	const requestUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

	// async fetch request function
	const fetchLongLat = async function () {
		const response = await fetch(requestUrl);
		const data = await response.json();

		console.log(data);
		return data;
	};

	fetchLongLat()
		.then(data => {
			// concat long and lat delimited by ',' for later split(',')
			longLat = data[0].lon + ',' + data[0].lat;
			console.log(longLat);
		});
	
	return longLat;

};

// function to handle form submit
const handleFormSubmit = function (event) {

	// prevent default submit behaviour
	event.preventDefault();

	console.log('textInput:', textInput.val());

	// encode search string for url query
	const encodedSearchString = encodeURI(textInput.val());


};

// event handler for submit-btn
searchForm.on('submit', handleFormSubmit);