const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");

const allaSvamparContainer = document.getElementById("svamp-grid");
const egenskaperContainer = document.getElementById("risk-grid");


// Skapar en sparaFynd Function
function sparaFynd(svamp) {

  let hittadeSvamparna; // lokal variabel undefind

  hittadeSvamparna = JSON.parse(localStorage.getItem("hittadeSvamparna")); // Kollar om det finns något sparat på localstorage
  // If-sats som gemför om hittadesvamparna är tom dvs igen data finns sparad iden om det inte finns skapar den en tom array.
  if (hittadeSvamparna === null) {
    hittadeSvamparna = [];
  }

  hittadeSvamparna.push(svamp); // svapar som väljs pushas in till array dom hanar sist i listan.

  localStorage.setItem("hittadeSvamparna", JSON.stringify(hittadeSvamparna));// sparar dom valda svamparna i localstorage samt gör om dom till en sträng

  console.log(`Fynd sparat: ${svamp.svenskt_namn}`);
}

// skapar en ny function visafynd, svampar man väljs visas påsidan.
function visaFynd() {

  const visaSvamp = document.getElementById("found-mushrooms"); //variabel som får infon vart dom valda svamparna ska visas. 

  const hittadeSvamparna = JSON.parse(localStorage.getItem("hittadeSvamparna"));



}



function createSvampKort(svamp, container) {
  const article = document.createElement("article");
  article.classList.add("svamp-card");

  const img = document.createElement("img");
  img.src = `./img/${svamp.bild}`;
  img.alt = svamp.svenskt_namn;
  article.appendChild(img);

  const div = document.createElement("div");
  div.classList.add("card-content");
  article.appendChild(div);

  const namn = document.createElement("h3");
  namn.textContent = svamp.svenskt_namn;
  div.appendChild(namn);

  const latinsktNamn = document.createElement("p");
  latinsktNamn.textContent = `Latinskt namn: ${svamp.latinskt_namn}`;
  div.appendChild(latinsktNamn);

  const ätlig = document.createElement("p");
  ätlig.textContent = `Ätlighet: ${svamp.ätlig}`;
  div.appendChild(ätlig);

  const beskrivning = document.createElement("p");
  beskrivning.textContent = `Beskrivning: ${svamp.beskrivning}`;
  div.appendChild(beskrivning);

  const fyndPlats = document.createElement("p");
  fyndPlats.textContent = `Fyndplats: ${svamp.fyndplats}`;
  div.appendChild(fyndPlats);

  if (allaSvamparContainer) {
    const btn = document.createElement("button");
    btn.textContent = "Jag har hittat denna svamp!";
    btn.addEventListener("click", () => {
      sparaFynd(svamp);
    });
    div.appendChild(btn);
  }

  container.appendChild(article);
}

function createEgenskaper(egenskap, container) {
  const article = document.createElement("article");

  const par = document.createElement("h3");
  par.textContent = egenskap.par;
  article.appendChild(par);

  const risk = document.createElement("p");
  risk.textContent = `Risk: ${egenskap.risk}`;
  article.appendChild(risk);

  const särskiljande = document.createElement("h4");
  särskiljande.textContent = `Särskiljande:`;
  article.appendChild(särskiljande);

  const särskiljandeList = document.createElement("ul");
  egenskap.särskiljande.forEach((skillnad) => {
    const li = document.createElement("li");
    li.textContent = skillnad;
    särskiljandeList.appendChild(li);
  });
  article.appendChild(särskiljandeList);

  container.appendChild(article);
}

async function fetchData() {
  try {
    const responceSvampar = await fetch("./svampar.json");
    const responceEgenskaper = await fetch("./speciellaegenskaper.json");

    if (!responceSvampar.ok) {
      throw new Error("Fetch svampar is failed!");
    }

    if (!responceEgenskaper.ok) {
      throw new Error("Fetch egenskaper is failed!");
    }

    const dataSvampar = await responceSvampar.json();
    console.log(dataSvampar);

    const dataEgenskaper = await responceEgenskaper.json();
    console.log(dataEgenskaper);

    //skapa artikel på Risker och egenskaper
    if (egenskaperContainer) {
      dataEgenskaper.särskiljande_egenskaper.forEach((egenskap) => {
        createEgenskaper(egenskap, egenskaperContainer);
      });
    }

    //skapa alla svampKort på start-sidan
    if (allaSvamparContainer) {
      dataSvampar.svampar.forEach((svamp) => {
        createSvampKort(svamp, allaSvamparContainer);
      });
    }
  } catch (error) {
    console.error(error);
  }
}

function init() {
  menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("show");
  });
  fetchData();
  visaFynd();
}

window.onload = init;
