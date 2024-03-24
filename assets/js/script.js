// get references to html elements
const searchForm = $('#search-form');
const textInput = $('#text-input');
const submitBtn = $('#submit-btn');
const historyContainer = $('#history-container');
const currentContainer = $('#current-container');
const fiveDayContainer = $('#5-day-container');

// openweathermap api key
const API_KEY = "227ca1573a3af857ae2b452b0dc9fe17";

// function to handle search history
const handleHistory = function (cityName) {

	// retrieve history from localStorage
	let history = JSON.parse(localStorage.getItem('history'));

	// if no history exists assign empty array
	if (!history) {
		history = [];
	}
	
	// if cityName isn't present in current history push new cityName on history
	if (!history.includes(cityName)) {
		history.push(cityName);
	}

	// store updated history in localStorage
	localStorage.setItem('history', JSON.stringify(history));
	
};

// function to print history buttons
const printHistory = function () {

	// empty existing history elements
	historyContainer.empty();

	// retrieve history from localStorage
	let history = JSON.parse(localStorage.getItem('history'));

	// if no history exists stop function
	if (!history) {
		return;
	}

	// loop through history and create buttons for each element
	for (const cityName of history) {
		const historyBtn = $('<button>').addClass('btn btn-secondary m-1 btn-show-history').attr('data-city-name', cityName).text(cityName);
		historyContainer.append(historyBtn);
	}
	
};

// function to show history results
const showHistoryResults = function (event) {

	// get cityName from event.target
	const cityName = $(event.target).attr('data-city-name');

	// run fetch for cityName
	getWeather(cityName);

};

// function to print fetched data
const printWeather = function (data) {

	// clear existing results
	currentContainer.empty();
	fiveDayContainer.empty();

	// CURRENT WEATHER CARD
	// extract relevent data
	const cityName = data.city.name;
	const date = dayjs(data.list[0].dt * 1000).format('DD/MM/YYYY');
	const icon = data.list[0].weather[0].icon;
	const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
	const temp = data.list[0].main.temp;
	const humidity = data.list[0].main.humidity;
	const wind = data.list[0].wind.speed;

	// create elements for each portion of the card
	const currentCard = $('<div>').addClass('card border border-2 border-dark bg-light m-1');
	const cardBody = $('<div>').addClass('card-body');
	const cardTitle = $('<h3>').addClass('card-title h3').text(`${cityName} ${date}`);
	const weatherIcon = $('<img>').attr('src', iconUrl);
	const cardTemp = $('<p>').addClass('card-text').text(`Temp: ${temp}°C`);
	const cardWind = $('<p>').addClass('card-text').text(`Wind: ${wind} KPH`);
	const cardHumidity = $('<p>').addClass('card-text').text(`Humidity: ${humidity} %`);

	// construct card
	cardBody.append(cardTitle, weatherIcon, cardTemp, cardWind, cardHumidity);
	currentCard.append(cardBody);

	// append card to results-container
	currentContainer.append(currentCard);

	// 5 DAY FORECAST
	// loop to cycle through every 8 data.list elements to get 24hr increments
	for (let i = 7; i < data.list.length; i += 8) {

		// extract relevent data
		const date = dayjs(data.list[i].dt * 1000).format('DD/MM/YYYY');
		const icon = data.list[i].weather[0].icon;
		const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
		const temp = data.list[i].main.temp;
		const humidity = data.list[i].main.humidity;
		const wind = data.list[i].wind.speed;

		// create elements for each portion of the card
		const currentCard = $('<div>').addClass('card bg-dark col-6 col-md text-light');
		const cardBody = $('<div>').addClass('card-body');
		const cardTitle = $('<p>').addClass('card-title fw-bold').text(`${date}`);
		const weatherIcon = $('<img>').attr('src', iconUrl);
		const cardTemp = $('<p>').addClass('card-text').text(`Temp: ${temp}°C`);
		const cardWind = $('<p>').addClass('card-text').text(`Wind: ${wind} KPH`);
		const cardHumidity = $('<p>').addClass('card-text').text(`Humidity: ${humidity} %`);

		// construct card
		cardBody.append(cardTitle, weatherIcon, cardTemp, cardWind, cardHumidity);
		currentCard.append(cardBody);

		// append card to results-container
		fiveDayContainer.append(currentCard);
	}

	// update history with new search
	handleHistory(cityName);

	// print history buttons
	printHistory();

};

// function to convert city name into lon/lat
const getWeather = function (cityName) {

	// geocoding request url
	const requestLonLatUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

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

			// weather request url
			const requestWeatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&cnt=40`;

			// async weather fetch request function
			const fetchWeather = async function () {
				const response = await fetch(requestWeatherUrl);
				const data = await response.json();

				return data;
			};

			fetchWeather()
				.then(data => {
					// print results to page
					printWeather(data);
				});
		});
	

};

// function to handle form submit
const handleFormSubmit = function (event) {

	// prevent default submit behaviour
	event.preventDefault();

	// encode search string for url query
	const encodedSearchString = encodeURI(textInput.val());

	getWeather(encodedSearchString);

	// clear form input field
	searchForm[0].reset();

};

// event handler for submit-btn
searchForm.on('submit', handleFormSubmit);

// event handler for showing history results
historyContainer.on('click', '.btn-show-history', showHistoryResults);

// event handler to print history on page load
$(document).ready(printHistory);