document.addEventListener("DOMContentLoaded", function () {
  const dogRequest = "https://freetestapi.com/api/v1/dogs";
  const catRequest = "https://freetestapi.com/api/v1/cats";
  const birdRequest = "https://freetestapi.com/api/v1/birds";
  const container = document.querySelector(".main-container");
  let currentRequest = dogRequest;

  function fetchAndDisplayAnimals(
    requestUrl,
    limit = -1,
    searchQuery = "",
    filter = null
  ) {
  
    let url = requestUrl;

    console.log(url);

    if (searchQuery) {
      url += `?search=${searchQuery}`;
    } else if (filter) {
      url += `?${filter.category}=${ filter.value}`;
    } else {
      url += `?limit=${limit}`; 
    }

    console.log("url:", url);
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((animals) => {
        console.log("animals:", animals);
        cleanContainer();
        let showedProducts = false;
        animals.forEach((animal) => {
          if (showAnimal(animal, filter)) {
            showedProducts = true;
           
            buildElement(animal);
          }
        });
        if (!showedProducts) {
          buildEmptyProducts();
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  function buildElement(animal) {
    const itemElement = document.createElement("div");
    itemElement.classList.add(
      "col-lg-2",
      "col-md-6",
      "col-sm-6",
      "col-12",
      "item"
    );
    const cardMarkup = buildCard(animal);
    itemElement.insertAdjacentHTML("beforeend", cardMarkup);
    container.appendChild(itemElement);
  }

  function cleanContainer() {
    container.innerHTML = "";
  }
  function buildCard(animal) {
    return (
      `<div class="card" data-bs-toggle="modal" data-bs-target="#animalModal" data-animal-id="${animal.id}">
        <img src="${animal.image}" alt="${animal.name}">
        <h3>${animal.name}</h3>` +
      (animal.origin ? `<p>Origin: ${animal.origin}</p>` : "") + 
      `</div>`
    );
  }

  function buildEmptyProducts() {
    console.log("buildEmptyProducts");
    const emptyProductElement = document.createElement("div");
    emptyProductElement.classList.add("alert", "alert-warning");
    emptyProductElement.setAttribute("role", "alert");
    emptyProductElement.innerText = "No more animals";

    container.appendChild(emptyProductElement);
  }

  function fetchAnimalDetails(animalId) {
    return fetch(`${currentRequest}/${animalId}`).then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    });
  }

  const animalModal = document.getElementById("animalModal");
  animalModal.addEventListener("show.bs.modal", function (event) {
    const button = event.relatedTarget;
    const animalId = button.dataset.animalId;
    fetchAnimalDetails(animalId)
      .then((animal) => {
        const modalBody = animalModal.querySelector(".modal-body");
        const modalImage = animalModal.querySelector("#animalImage");
        modalImage.src = animal.image;
        modalBody.querySelector("#animalName").innerText = animal.name;
        modalBody.querySelector(
          "#animalOrigin"
        ).innerText = `Origin: ${animal.origin}`;
        modalBody.querySelector("#animalDescription").innerText =
          animal.description;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });

  const searchButtons = document.getElementsByClassName("searchButton");

  console.log(searchButtons);
  for (let i = 0; i < searchButtons.length; i++) {
    console.log(this);

    this.addEventListener("click", function (event) {
      const searchInputs = document.getElementsByClassName("searchInput");
      let searchInput = searchInputs[0].value || searchInputs[1].value;

      if (searchInput) {
        searchInput = searchInput.trim().toLowerCase();
        console.log(searchInput);
        fetchAndDisplayAnimals(currentRequest, -1, searchInput);
      }
      searchInputs[0].value = "";
      searchInputs[1].value = "";
    });
  }

  function showAnimal(animal, filter) {
    if (!filter) return true;

    switch (filter.category) {
      case "origin":
        console.log("filtering origin");
        if (
          filter.value.trim().toLowerCase() !=
          (animal.origin || "").trim().toLowerCase()
        ) {
         
          return false;
        }
        break;
      case "size":
        console.log("filtering size");
        if (
          filter.value.trim().toLowerCase() != animal.size.trim().toLowerCase()
        ) {
          return false;
        }
        break;
      case "color":
        console.log("filtering color");
        if (
          filter.value.trim().toLowerCase() != (animal.color ?? '').trim().toLowerCase()
        ) {
          return false;
        }
        break;

      default:
        console.log("no filter");
    }

    return true;
  }

  const showAllButton = document.getElementById("showAllButton");
  showAllButton.addEventListener("click", function () {
    fetchAndDisplayAnimals(currentRequest, -1);
  });

  const showDogsButton = document.getElementById("dogs");
  showDogsButton.addEventListener("click", function () {
    currentRequest = dogRequest;
    fetchAndDisplayAnimals(currentRequest, 5);
  });

  const showCatsButton = document.getElementById("cats");
  showCatsButton.addEventListener("click", function () {
    currentRequest = catRequest;
    fetchAndDisplayAnimals(currentRequest, 5);
  });

  const showBirdsButton = document.getElementById("birds");
  showBirdsButton.addEventListener("click", function () {
    currentRequest = birdRequest;
    fetchAndDisplayAnimals(currentRequest, 5);
  });

  const showFilterButtons = document.getElementsByClassName("filter");
  console.log(showFilterButtons);
  for (let i = 0; i < showFilterButtons.length; i++) {
    showFilterButtons[i].addEventListener("click", function () {
      console.log("filterName:", this.textContent);

      const category = this.parentElement.parentElement.getAttribute(
        "category"
      );
      console.log(category);
      const content = this.textContent;

      const filter = {
        category: category,
        value: content.trim(),
      };

      console.log(filter);

      fetchAndDisplayAnimals(currentRequest, -1, "", filter); 
    });
  }

  fetchAndDisplayAnimals(currentRequest, 5);
});

document.getElementById("dogsNav").addEventListener("click", function () {
  document.getElementById("dogs").click();
});

document.getElementById("catsNav").addEventListener("click", function () {
  document.getElementById("cats").click();
});

document.getElementById("birdsNav").addEventListener("click", function () {
  document.getElementById("birds").click();
});


let goToTopBtn = document.getElementById("goToTopBtn");

window.onscroll = function () {
  scrollFunction();
};


function scrollFunction() {
  if (
   
    document.documentElement.scrollTop > 100
  ) {
    goToTopBtn.style.display = "block";
  } else {
    goToTopBtn.style.display = "none";
  }
}


goToTopBtn.addEventListener("click", function () {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});
