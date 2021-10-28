//You can edit ALL of the code here
let episodeLength;
let allEpisodes = [];

// Load page
function setup() {
  makeFilterSection();
  makeShowSection(null);
  makeSearchEpisodeSection();
  makeEpisodeSection();
  fillSelectOfShows();
}

// Fetch episodes
function fetchEpisodes(url) {
  fetch(url)
    .then((Response) => Response.json())
    .then(function (data) {
      allEpisodes = data;
      episodeLength = allEpisodes.length;
      fillSelectOfEpisodes(allEpisodes);
      fillSectionOfEpisodes(allEpisodes);
    })
    .catch((error) => console.error(error));
}

// Make section of filtering show
function makeFilterSection() {
  let filterSectionElement = document.createElement("section");
  filterSectionElement.id = "filterSection";
  filterSectionElement.style.display = "block";
  filterSectionElement.className = "px-3 ";
  let filterDivElement = document.createElement("div");
  filterDivElement.className = "row p-3 text-start  ";
  let filteringLabelElement = document.createElement("h6");
  filteringLabelElement.className = "col-lg-1 col-md-2 col-4 m-1 p-2";
  filteringLabelElement.textContent = `Filtering for `;
  let parentOfInputElement = document.createElement("div");
  parentOfInputElement.className = "col-md-3 col-7 p-0";
  let filterInputElement = document.createElement("input");
  filterInputElement.id = "filterKey";
  filterInputElement.className = "form-control p-1 m-1";
  filterInputElement.placeholder = "Enter to search show";
  parentOfInputElement.append(filterInputElement);
  let filterFoundLabelElement = document.createElement("h6");
  filterFoundLabelElement.id = "countOfShows";
  filterFoundLabelElement.className = " col-md-3 col-7 p-2 pl-lg-3 ";
  let parentOfSelectElement = document.createElement("div");
  parentOfSelectElement.className = "col-md-3 col-11 ml-1 p-0";
  let filterSelectElement = document.createElement("select");
  filterSelectElement.id = "filteredShows";
  filterSelectElement.className = "form-control p-1 m-1";
  parentOfSelectElement.append(filterSelectElement);
  filterDivElement.append(
    filteringLabelElement,
    parentOfInputElement,
    filterFoundLabelElement,
    parentOfSelectElement
  );
  filterSectionElement.append(filterDivElement);
  const rootElement = document.getElementById("root");
  rootElement.append(filterSectionElement);
  fillShowsDropDown();
  filterSelectElement.addEventListener("change", function () {
    const rootElem = document.getElementById("root");
    const showSectionElement = document.getElementById("displayShows");
    rootElem.removeChild(showSectionElement);
    let selectedShow = getSelectedShow(this.value);
    makeShowSection(selectedShow);
  });

  function getSelectedShow(selectedId) {
    return getAllShows().filter((show) => show.id == selectedId);
  }
  filterInputElement.addEventListener("input", function () {
    const rootElem = document.getElementById("root");
    const showSectionElement = document.getElementById("displayShows");
    rootElem.removeChild(showSectionElement);
    let filteredShows = fillShowsDropDown();
    makeShowSection(filteredShows);
  });
}

// Display show/shows
function makeShowSection(displayedShows) {
  const rootElem = document.getElementById("root");
  let showSectionElement = document.createElement("section");
  showSectionElement.className = "p-2";
  showSectionElement.id = "displayShows";
  showSectionElement.style.display = "block";
  rootElem.appendChild(showSectionElement);
  let allShows =
    displayedShows == null || displayedShows.length == 0
      ? getAllShows()
      : displayedShows;
  allShows.sort((a, b) => (a.name > b.name ? 1 : -1));
  allShows.map((show) => {
    let ShowElement = document.createElement("div");
    ShowElement.className = " m-4 ";
    let showNameElement = document.createElement("h3");
    showNameElement.id = show.id;
    showNameElement.innerHTML = show.name;
    showNameElement.className = "display-6 text-left p-2 m-3";
    let showDescriptionElement = document.createElement("div");
    showDescriptionElement.className = "row";
    ShowElement.append(showNameElement, showDescriptionElement);
    let showImageParentElement = document.createElement("div");
    showImageParentElement.className = "col-md-3 col-12";
    let showImageElement = document.createElement("img");
    showImageElement.className =
      "img-responsive img-thumbnail shadow-lg ml-2 mb-3";
    if (show.image != null) {
      showImageElement.src = show.image.medium;
    }
    showImageElement.alt = "imageOfShow";
    showImageParentElement.append(showImageElement);
    let showSummaryElement = document.createElement("div");
    showSummaryElement.className = "col-md-6 col-12";
    showSummaryElement.innerHTML = show.summary;
    let showItemElement = document.createElement("div");
    showItemElement.className = "col-md-3 col-12";
    let showRateElement = document.createElement("p");
    showRateElement.innerHTML = `<span class="font-weight-bold">Rated:</span> ${show.rating.average}`;
    let showRuntimeElement = document.createElement("p");
    showRuntimeElement.innerHTML = `<span class="font-weight-bold">Runtime:</span> "${show.runtime}`;
    let showGenresElement = document.createElement("p");
    let genres = show.genres.join(" | ");
    showGenresElement.innerHTML = `<span class="font-weight-bold">Genres:</span>  ${genres}`;
    let showStatusElement = document.createElement("p");
    showStatusElement.innerHTML = `<span class="font-weight-bold">Status:</span> ${show.status}`;
    showItemElement.append(
      showRateElement,
      showGenresElement,
      showStatusElement,
      showRuntimeElement
    );
    showDescriptionElement.append(
      showImageParentElement,
      showSummaryElement,
      showItemElement
    );
    showSectionElement.appendChild(ShowElement);
  });
  document.querySelectorAll("h3").forEach((element) => {
    element.addEventListener("click", function () {
      document.getElementById("filterSection").style.display = "none";
      document.getElementById("displayShows").style.display = "none";
      document.getElementById("searchSection").style.display = "block";
      document.getElementById("displayEpisode").style.display = "block";
      let url = `https://api.tvmaze.com/shows/${element.id}/episodes`;
      let episodeSectionElement = document.getElementById("displayEpisode");
      removeChild(episodeSectionElement);
      document.getElementById("showSelect").value = element.id;
      fetchEpisodes(url);
    });
  });
}

// Make section for search episode
function makeSearchEpisodeSection() {
  const rootElem = document.getElementById("root");
  let searchSection = document.createElement("section");
  searchSection.id = "searchSection";
  searchSection.className = " px-2 mx-auto py-4";
  searchSection.style.display = "none";
  rootElem.append(searchSection);
  let parentOfSearchElements = document.createElement("div");
  parentOfSearchElements.className = "row g-1 mx-auto";
  parentOfSearchElements.id = "parentOfSearchElements";
  searchSection.append(parentOfSearchElements);
  let parentOfShowSelect = document.createElement("div");
  parentOfShowSelect.className = "col-12 col-sm-6 col-md-3";
  let showSelectElement = document.createElement("select");
  showSelectElement.id = "showSelect";
  showSelectElement.className = "form-control m-1 p-2";
  parentOfShowSelect.append(showSelectElement);
  let parentOfEpisodeSelect = document.createElement("div");
  parentOfEpisodeSelect.className = "col-12 col-sm-6 col-md-3";
  let episodeSelectElement = document.createElement("select");
  episodeSelectElement.className = " form-control m-1 p-2 ";
  episodeSelectElement.id = "selectEpisode";
  parentOfEpisodeSelect.append(episodeSelectElement);
  let parentOfInputElement = document.createElement("div");
  parentOfInputElement.className = "col-md-2 col-12 col-sm-6 ";
  let inputElement = document.createElement("input");
  inputElement.id = "searchKey";
  inputElement.className = "form-control m-1 ";
  parentOfInputElement.append(inputElement);
  let labelElement = document.createElement("label");
  labelElement.id = "searchComment";
  labelElement.className = "col-md-2 col-12 col-sm-5 m-1 p-1 pl-3 text-left";
  let backBtnElement = document.createElement("button");
  backBtnElement.id = "btn";
  backBtnElement.className = "col-md-1 col-11 mt-3 m-md-1 mx-auto btn";
  backBtnElement.innerHTML = "Back";
  backBtnElement.addEventListener("click", displayShowsSection);
  parentOfSearchElements.append(
    parentOfShowSelect,
    parentOfEpisodeSelect,
    parentOfInputElement,
    labelElement,
    backBtnElement
  );
  inputElement.addEventListener("input", searchEpisode);
}

// Search episode
function searchEpisode() {
  let episodeFilter = allEpisodes.filter(filterByKey);
  let episodeSectionElement = document.getElementById("displayEpisode");
  removeChild(episodeSectionElement);
  fillSectionOfEpisodes(episodeFilter);
}

// Search episode by input value
function filterByKey(episode) {
  let searchKey = document.getElementById("searchKey").value;
  return (
    episode.name.toLowerCase().includes(searchKey.toLowerCase()) ||
    episode.summary.toLowerCase().includes(searchKey.toLowerCase())
  );
}

// Display show section when click the back button
function displayShowsSection() {
  document.getElementById("filterSection").style.display = "block";
  document.getElementById("displayShows").style.display = "block";
  document.getElementById("searchSection").style.display = "none";
  document.getElementById("displayEpisode").style.display = "none";
  const rootElem = document.getElementById("root");
  const showSectionElement = document.getElementById("displayShows");
  rootElem.removeChild(showSectionElement);
  makeShowSection(null);
}

// Fill DropDown of episodes
function fillSelectOfEpisodes(allEpisodes) {
  let SelectElement = document.getElementById("selectEpisode");
  removeChild(SelectElement);
  let episodeCode;
  let allOpt = document.createElement("option");
  allOpt.value = 0;
  allOpt.innerHTML = "All Episode";
  SelectElement.appendChild(allOpt);
  allEpisodes.map((episode) => {
    episodeCode = createEpisodeCode(episode.number, episode.season);
    let episodeTitle = `${episodeCode}-${episode.name}`;
    let opt = document.createElement("option");
    opt.value = episode.id;
    opt.innerHTML = episodeTitle;
    SelectElement.appendChild(opt);
  });
  SelectElement.addEventListener("change", function () {
    let searchElement = document.getElementById("searchKey");
    searchElement.value = "";
    displayEpisode(allEpisodes, this.value);
  });
}

function createEpisodeCode(number, season) {
  number = number < 10 ? `0${number}` : number;
  season = season < 10 ? `0${season}` : season;
  return `S${number}E${season}`;
}

// Show one/all episode/episodes
function displayEpisode(allEpisodes, episodeId) {
  let episodeFilter =
    episodeId == "0"
      ? allEpisodes
      : allEpisodes.filter((element) => element.id == episodeId);
  let episodeSectionElement = document.getElementById("displayEpisode");
  removeChild(episodeSectionElement);
  fillSectionOfEpisodes(episodeFilter);
}

// Define section of episodes
function makeEpisodeSection() {
  const rootElem = document.getElementById("root");
  let sectionOfEpisode = document.createElement("section");
  let displayEpisodeElement = document.createElement("div");
  displayEpisodeElement.className = "row justify-content-start p-5";
  displayEpisodeElement.id = "displayEpisode";
  displayEpisodeElement.style.display = "none";
  sectionOfEpisode.append(displayEpisodeElement);
  rootElem.appendChild(sectionOfEpisode);
}

// Display all episodes of a show
function fillSectionOfEpisodes(episodeList) {
  let searchComment = document.getElementById("searchComment");
  searchComment.innerHTML = `<small> Displaying ${episodeList.length}/${episodeLength} episodes </small>`;
  let displayEpisodeElement = document.getElementById("displayEpisode");
  let allEpisodeElement = document.createElement("div");
  allEpisodeElement.className = "row ";
  allEpisodeElement.id = "allEpisode ";
  displayEpisodeElement.appendChild(allEpisodeElement);
  episodeList.map((episodeElement) => {
    let episodeDiv = document.createElement("div");
    episodeDiv.className = "col-lg-3 col-md-4 col-sm-6  p-sm-2 p-md-3 mx-auto ";
    let parentOfTitle = document.createElement("div");
    parentOfTitle.id = "titleOfEpisode";
    let titleEpisode = document.createElement("h5");
    titleEpisode.className = "pd-2 m-2 align-self-start";
    parentOfTitle.append(titleEpisode);
    let imageEpisode = document.createElement("img");
    imageEpisode.className = "img-fluid my-3";
    let description = document.createElement("div");
    description.className = "text-center ml-1 ";
    allEpisodeElement.appendChild(episodeDiv);
    episodeDiv.append(parentOfTitle, imageEpisode, description);
    titleEpisode.innerHTML = `${episodeElement.name}-${createEpisodeCode(
      episodeElement.number,
      episodeElement.season
    )}`;
    if (episodeElement.image != null) {
      imageEpisode.src = episodeElement.image.medium;
      imageEpisode.alt = episodeElement.name;
    }
    description.innerHTML = episodeElement.summary;
  });
}

// Fill the dropdown of shows
function fillSelectOfShows() {
  let SelectElement = document.getElementById("showSelect");
  let allShows = getAllShows();
  allShows.sort((a, b) => (a.name > b.name ? 1 : -1));
  allShows.map((show) => {
    let optionElement = document.createElement("option");
    optionElement.innerText = show.name;
    optionElement.value = show.id;
    SelectElement.appendChild(optionElement);
  });
  SelectElement.addEventListener("change", function () {
    let url = `https://api.tvmaze.com/shows/${this.value}/episodes`;
    let episodeSectionElement = document.getElementById("displayEpisode");
    removeChild(episodeSectionElement);
    fetchEpisodes(url);
  });
}

// Remove all children of the element
function removeChild(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

// Fill dropdown of shows
function fillShowsDropDown() {
  let filterKey = document.getElementById("filterKey").value.toLowerCase();
  let filteredShows = filterKey == "" ? getAllShows() : filterShows(filterKey);
  filteredShows.sort((a, b) => (a.name > b.name ? 1 : -1));
  document.getElementById("countOfShows").innerHTML = `Found ${filteredShows.length}/${getAllShows().length} show's`;
  let SelectElement = document.getElementById("filteredShows");
  removeChild(SelectElement);
  let firstOptionElement = document.createElement("option");
  firstOptionElement.innerHTML = "Choose show";
  firstOptionElement.value = "0";
  SelectElement.append(firstOptionElement);
  filteredShows.forEach((show) => {
    let optionElement = document.createElement("option");
    optionElement.innerHTML = show.name;
    optionElement.value = show.id;
    SelectElement.append(optionElement);
  });
  return filteredShows;
}

// Filter shows by input value
function filterShows(filterKey) {
  let filteredShows = getAllShows().filter((show) => {
    return (
      show.name.toLowerCase().includes(filterKey) ||
      show.summary.toLowerCase().includes(filterKey) ||
      show.genres.join().toLowerCase().includes(filterKey)
    );
  });
  return filteredShows;
}

window.onload = setup();
