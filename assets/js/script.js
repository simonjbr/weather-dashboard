// get references to html elements
const searchForm = $('#search-form');
const textInput = $('#text-input');
const submitBtn = $('#submit-btn');
const historyContainer = $('#history-container');
const resultsContainer = $('#results-container');

// openweathermap api key
const API_KEY = "227ca1573a3af857ae2b452b0dc9fe17";

// function to convert city name into lon/lat
const getWeather = function (cityName) {

	// geocoding request url
	const requestLonLatUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

	// async lon lat fetch request function
	const fetchLonLat = async function () {
		const response = await fetch(requestLonLatUrl);
		const data = await response.json();

		return data;
	};

	fetchLonLat()
		.then(data => {
			// store lon and lat
			const lon = data[0].lon;
			const lat = data[0].lat;

			console.log(data);
			console.log(lon, lat);

			// weather request url
			const requestWeatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

			// async weather fetch request function
			const fetchWeather = async function () {
				const response = await fetch(requestWeatherUrl);
				const data = await response.json();

				return data;
			};

			fetchWeather()
				.then(data => {
					console.log(data);
					// printWeather(data);
				});
		});
	

};

// function to handle form submit
const handleFormSubmit = function (event) {

	// prevent default submit behaviour
	event.preventDefault();

	console.log('textInput:', textInput.val());

	// encode search string for url query
	const encodedSearchString = encodeURI(textInput.val());

	getWeather(encodedSearchString);


};

// event handler for submit-btn
searchForm.on('submit', handleFormSubmit);