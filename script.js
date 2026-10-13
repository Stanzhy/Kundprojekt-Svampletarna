const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");

menuBtn.addEventListener("click", () => {
  navLinks.classList.toggle("show");
});
const allaSvamparContainer = document.getElementById("svamp-grid");
const egenskaperContainer = document.getElementById("risk-grid");

function sparaFynd(svamp) {
  console.log(`Fynd sparat: ${svamp.svenskt_namn}`);
}

function createSvampKort(svamp, container) {
  const article = document.createElement("article");

  const img = document.createElement("img");
  img.src = `./img/${svamp.bild}`;
  img.alt = svamp.svenskt_namn;
  article.appendChild(img);

  const namn = document.createElement("p");
  namn.textContent = svamp.svenskt_namn;
  article.appendChild(namn);

  const latinsktNamn = document.createElement("p");
  latinsktNamn.textContent = `Latinskt namn: ${svamp.latinskt_namn}`;
  article.appendChild(latinsktNamn);

  const ätlig = document.createElement("p");
  ätlig.textContent = `Ätlighet: ${svamp.ätlig}`;
  article.appendChild(ätlig);

  const beskrivning = document.createElement("p");
  beskrivning.textContent = `Beskrivning: ${svamp.beskrivning}`;
  article.appendChild(beskrivning);

  const fyndPlats = document.createElement("p");
  fyndPlats.textContent = `Fyndplats: ${svamp.fyndplats}`;
  article.appendChild(fyndPlats);

  if (allaSvamparContainer) {
    const btn = document.createElement("button");
    btn.textContent = "Jag har hittat denna svamp!";
    btn.addEventListener("click", () => {
      sparaFynd(svamp);
    });
    article.appendChild(btn);
  }

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

    //skapa bara en artikel på index-sidan
    //  if (egenskaperContainer) {
    //    createSvampKort(dataSvampar.svampar[0], egenskaperContainer);
    //  }

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
  fetchData();
}

window.onload = init;
