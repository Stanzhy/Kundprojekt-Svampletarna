// variabler för menyknappen och navigeringslänkarna
const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");

// variabler för container till svampkort och särskiljande egenskaper
const allaSvamparContainer = document.getElementById("svamp-grid");
const egenskaperContainer = document.getElementById("risk-grid");

// Skapar en sparaFynd Function
function sparaFynd(svamp) {
  let hittadeSvamparna; // lokal variabel undefind
  let finnsRedan; // lokal variabel undefind

  hittadeSvamparna = JSON.parse(localStorage.getItem("hittadeSvamparna")); // Kollar om det finns något sparat på localstorage
  // If-sats som gemför om hittadesvamparna är tom dvs igen data finns sparad i den, om det inte finns skapar den en tom array.
  if (hittadeSvamparna === null) {
    hittadeSvamparna = [];
  }
  // Går igenom svamparna och kollar om den redan är sparad.
  finnsRedan = hittadeSvamparna.find(
    (hittadSvamp) => hittadSvamp.svenskt_namn === svamp.svenskt_namn,
  );

  //  om if-satsen är true så skriver den ut alert meddelandet.
  if (finnsRedan) {
    alert("Du har redan hittat den svamp typ");
    return;
  }

  hittadeSvamparna.push(svamp); // svamp som väljs pushas in till array, den hanmnar sist i kön.

  localStorage.setItem("hittadeSvamparna", JSON.stringify(hittadeSvamparna)); // sparar dom valda svamparna i localstorage samt gör om dom till en sträng

  alert("Sparad svamp."); // Meddelande skrivs ut efter att en svamp har sparats.
}

// Skapar en functiion
function visaSvamp() {
  // Hämtar alla sparade svamparna från localstorage och sparar värdet i kollarSvamparna.
  const kollarSvamparna = JSON.parse(localStorage.getItem("hittadeSvamparna"));
  // Sparar/Hittar elementet med id found-mushrooms. där ceateSvampKort ska visas.
  const visaSvampar = document.getElementById("found-mushrooms");

  // Här gemförst variabeln med null dvs om inga svampar är sparade så avslutas functionen.
  if (kollarSvamparna === null) {
    return;
  }

  // Kollar om elementet finns,omden inte finns avslutas functionen
  if (visaSvampar === null) {
    return;
  }

  // Går igenom all svamparna en efter en som finns i variabeln kollarSvamparna. och sparar dom i parametern svamp.
  kollarSvamparna.forEach((svamp) => {
    // Här körs functionen createSvampKort med parametrar svamp och visaSvampar är där dom svamparna visas dvs  i det elemetet som sparats i den variabeln.
    createSvampKort(svamp, visaSvampar);
  });
}

function rensaHistorik() {
  localStorage.removeItem("hittadeSvamparna");

  const visaSvampar = document.getElementById("found-mushrooms");
  if (visaSvampar) {
    visaSvampar.innerHTML = "";
  }
}

// Skapar ett element med textinnehåll. Tar emot tag och textinnehåll som argument.
function createElement(tag, textContent) {
  const element = document.createElement(tag);
  element.textContent = textContent;
  return element;
}

// Skapar ett img element med src och alt attribut.
function createImageElement(src, alt) {
  const img = document.createElement("img");
  img.src = src;
  img.alt = alt;
  return img;
}

// Skapar ett svampkort med information om svampen och lägger till den i rätt container. Tar emot svamp objektet och container elementet som argument.
function createSvampKort(svamp, container) {
  const article = document.createElement("article");
  article.classList.add("svamp-card");

  const img = createImageElement(`./img/${svamp.bild}`, svamp.svenskt_namn);
  article.appendChild(img);

  const div = createElement("div");
  div.classList.add("card-content");
  article.appendChild(div);

  const namn = createElement("h3", svamp.svenskt_namn);
  div.appendChild(namn);

  const latinsktNamn = createElement(
    "p",
    `Latinskt namn: ${svamp.latinskt_namn}`,
  );
  div.appendChild(latinsktNamn);

  const ätlig = createElement("p", `Ätlighet: ${svamp.ätlig}`);
  div.appendChild(ätlig);

  const beskrivning = createElement("p", `Beskrivning: ${svamp.beskrivning}`);
  div.appendChild(beskrivning);

  const fyndPlats = createElement("p", `Fyndplats: ${svamp.fyndplats}`);
  div.appendChild(fyndPlats);

  if (allaSvamparContainer) {
    const btn = createElement("button", "Jag har hittat denna svamp!");
    btn.addEventListener("click", () => {
      sparaFynd(svamp);
    });
    div.appendChild(btn);
  }

  container.appendChild(article);
}

// Skapar en element för varje särskiljande egenskap och lägger till den i rätt container. Tar emot egenskap objektet och container elementet som argument.
function createEgenskaper(egenskap, container) {
  const article = document.createElement("article");

  const par = createElement("h3", egenskap.par);
  article.appendChild(par);

  const risk = createElement("p", `Risk: ${egenskap.risk}`);
  article.appendChild(risk);

  const särskiljande = createElement("h4", `Särskiljande:`);
  article.appendChild(särskiljande);

  const särskiljandeList = document.createElement("ul");
  egenskap.särskiljande.forEach((skillnad) => {
    const li = createElement("li", skillnad);
    särskiljandeList.appendChild(li);
  });
  article.appendChild(särskiljandeList);

  container.appendChild(article);
}

async function fetchData() {
  try {
    const responceSvampar = await fetch("svampar.json");
    const responceEgenskaper = await fetch("speciellaegenskaper.json");

    if (!responceSvampar.ok) {
      throw new Error("Fetch svampar is failed!");
    }

    if (!responceEgenskaper.ok) {
      throw new Error("Fetch egenskaper is failed!");
    }

    const dataSvampar = await responceSvampar.json();
    const dataEgenskaper = await responceEgenskaper.json();

    if (egenskaperContainer) {
      //skapar artilel för varje särskiljande egenskap i speciellaegenskaper.json
      dataEgenskaper.särskiljande_egenskaper.forEach((egenskap) => {
        createEgenskaper(egenskap, egenskaperContainer);
      });
    }

    if (allaSvamparContainer) {
      //skapar svampKort för alla svampar i svampar.json
      dataSvampar.svampar.forEach((svamp) => {
        createSvampKort(svamp, allaSvamparContainer);
      });
    }
  } catch (error) {
    console.error(error);
  }
}

function init() {
  // Event listener för menyknappen
  menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("show");
  });

  const clearBtn = document.getElementById("clear-btn");
  if (clearBtn) {
    clearBtn.addEventListener("click", rensaHistorik);
  }

  fetchData();
  visaSvamp();
}

window.onload = init;
