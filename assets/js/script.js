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
		const historyBtn = $('<button>').addClass('btn btn-secondary m-1').text(cityName);
		historyContainer.append(historyBtn);
	}
	
};

// function to print fetched data
const printWeather = function (data) {

	// clear existing results
	currentContainer.empty();
	fiveDayContainer.empty();

	// CURRENT WEATHER CARD
	// extract relevent data
	const cityName = data.city.name;
	console.log('cityName', cityName);
	const date = dayjs(data.list[0].dt * 1000).format('DD/MM/YYYY');
	console.log('date', date);
	const icon = data.list[0].weather[0].icon;
	console.log('icon', icon);
	const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
	const temp = data.list[0].main.temp;
	console.log('temp', temp);
	const humidity = data.list[0].main.humidity;
	console.log('humidity', humidity);
	const wind = data.list[0].wind.speed;
	console.log('wind', wind);

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
		console.log('date', date);
		const icon = data.list[i].weather[0].icon;
		console.log('icon', icon);
		const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
		const temp = data.list[i].main.temp;
		console.log('temp', temp);
		const humidity = data.list[i].main.humidity;
		console.log('humidity', humidity);
		const wind = data.list[i].wind.speed;
		console.log('wind', wind);

		// create elements for each portion of the card
		const currentCard = $('<div>').addClass('card bg-dark col text-light');
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
			const requestWeatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&cnt=40`;

			console.log(requestWeatherUrl);

			// async weather fetch request function
			const fetchWeather = async function () {
				const response = await fetch(requestWeatherUrl);
				const data = await response.json();

				return data;
			};

			fetchWeather()
				.then(data => {
					console.log(data);
					printWeather(data);
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