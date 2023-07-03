// Title : http://www.omdbapi.com/?s=avengers&apikey=e9573d45;
// Details : http://www.omdbapi.com/?i=tt3896198&apikey=e9573d45

const searchBox = document.getElementById('searchBox');
const searchList= document.getElementById('search-list');
const result = document.getElementById('result');
const resultContainer = document.querySelector('.result-container');
const deleted = document.querySelector('.delete');
const like = document.querySelector('.like');
const favourite = document.querySelector('.fav');
const favourites = document.querySelector('.favourites');
const favList = document.querySelector('.fav-list');
const goBack = document.querySelector('.go-back');
const container = document.querySelector('.container');

let listOfFavorites=[];

//for fetching movies from api
async function loadMovies(searchTerm){
const URL = `https://www.omdbapi.com/?s=${searchTerm}&page=1&apikey=e9573d45`;
const res = await fetch(`${URL}`);
const data = await res.json();
  if(data.Response==="True"){
   displayMoviesList(data.Search);
  }
}

//finding searched movies from api
function findMovies(){
 let searchTerm = (searchBox.value).trim();
 if(searchTerm.length>0){
 	searchList.classList.remove('hide-search-list');
 	loadMovies(searchTerm);
 }
 else{
 	searchList.classList.add('hide-search-list');
 }

}

//displaying movies list 
function displayMoviesList(movies){
	searchList.innerHTML ="";
	for(let i = 0; i<movies.length; i++){
		let movieListItem = document.createElement('div');
		movieListItem.dataset.id = movies[i].imdbID;
		// deleted.dataset.id = movies[i].imdbID;
		movieListItem.classList.add('search-item');
		let moviePoster="";
		if(movies[i]!=="N/A"){
			moviePoster = movies[i].Poster;
		}
		movieListItem.innerHTML = `
		<div class="search-item-thumbnail">
		    <img src="${moviePoster}"></div>
		<div class="search-item-info">
			<h3>${movies[i].Title}</h3>
			<p>${movies[i].Year}</p>
		</div>
		`;
		searchList.append(movieListItem);
	}
	loadMovieDetails();
}
//fetching movie details from api
function loadMovieDetails(){
	const searchListMovies = document.querySelectorAll('.search-item');
	searchListMovies.forEach(function(movie){
		 movie.addEventListener('click', async function(){
		 		searchList.classList.add('hide-search-list');
		 		searchBox.value="";
		 		const result = await fetch(`https://www.omdbapi.com/?i=${movie.dataset.id}&apikey=e9573d45`);
		 		const movieDetails = await result.json();
		 	  displayMovieDetails(movieDetails);
		 });
	})
}

//adding the liked movie to the favourite list
async function addToFavourites(id){
const result = await fetch(`https://www.omdbapi.com/?i=${id}&apikey=e9573d45`);
const movie= await result.json();
console.log(movie);
	const favItem = document.createElement('div');
	favItem.classList.add('data-id="${movie.imdbID}"');
	favItem.classList.add('fav-item');
	favItem.innerHTML=`
		<div class="fav-item-thumbnail">
					<img src="${movie.Poster}"></div>
					<div class="fav-item-info">
						<h3>${movie.Title}</h3>
						<p>${movie.Year}</p>
					</div><i class="fa-solid fa-trash delete" data-id="${movie.imdbID}"></i>
	`;
	favList.append(favItem);
	listOfFavorites.push(movie);
	localStorage.setItem("movies", JSON.stringify(listOfFavorites));
}

// loading favourite list after adding or deleting movie from list
function loadFavList(movies){
   for(let i = 0; i<movies.length; i++){
   	 addToFavourites(movies[i].imdbID);
   	 localStorage.setItem("movies", JSON.stringify(listOfFavorites));
   }
}

//displaying details of selected movie
function displayMovieDetails(details){
	result.innerHTML = `
<div class="movie-poster">
			<img src="${details.Poster}" alt="movie-poster">
		</div>
		<div class="movie-info">
			<h3 class="movie-title">${details.Title}</h3><i class="fa-solid fa-heart like" data-id="${details.imdbID}"></i>
			<ul class="movie-details">
				<li class="year">Year: ${details.Year}</li>
				<li class="rated">Ratings: ${details.Rated}</li>
				<li class="released">Released: ${details.Released}</li>
			</ul>
			<p class="genre"><b>Genre: </b>${details.Genre}</p>
			<p class="actors"><b>Actors: </b>${details.Actors}</p>
			<p class="plot"><b>Plot: </b>${details.Plot}</p>
			<p class="language"><b>Language: </b>${details.Language}</p>
			<p class="awards"><b><i class="fa-solid fa-award"></i></b>${details.Awards}</p>

		</div>
	  `;
}

window.addEventListener('click',function(event){
	if(event.target.className!=='searchBox'){
		searchList.classList.add('hide-search-list');
	}
	if(event.target.classList.contains('like')){
		event.target.style.color = "red";
		addToFavourites(event.target.dataset.id);
	}
	if(event.target.classList.contains('delete')){
		console.log(listOfFavorites);
		const deletedId = event.target.dataset.id;
		let finalList = listOfFavorites.filter(function(movie){
				return  movie.imdbID != deletedId;
		})
		console.log(finalList);
		listOfFavorites = [];
		favList.innerHTML="";
		loadFavList(finalList);
	}
	if(event.target.className==='fav'){
		favourite.classList.add('hide');
		resultContainer.classList.add('hide');
		favourites.style.display = 'flex';
		goBack.classList.remove('hide');
	}
	if(event.target.className==='go-back'){
	  favourites.style.display = 'none';
		resultContainer.classList.remove('hide');
		favourite.classList.remove('hide');
		goBack.classList.add('hide');
	}

});

//storing favourites to local Storage, so that after reloading the page list of favourites remains as it is
window.onload = (event) => {
  const movies = JSON.parse(localStorage.getItem("movies"));
   for(let i = 0; i<movies.length; i++){
   	 addToFavourites(movies[i].imdbID);
   }
   console.log(movies);
};

