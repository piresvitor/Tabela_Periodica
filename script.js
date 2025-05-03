import { elements } from "./elements.js"; 

// Obtém a lista de elementos ordenados pelo nº atômico:
function getList() {
  elements.sort((a, b) => a.element.atomicNumber - b.element.atomicNumber);
  return elements;
}

// Formata a classe do elemento para uso como classe CSS:
function formatClass(c) {
  return c
    .normalize("NFD") // Normaliza acentos (ex: á → a)
    .replace(/[\u0301-\u0327]/g, "") // Remove sinais diacríticos
    .replace(/\s+/g, "-") // Substitui espaços por hífens
    .toLowerCase(); // Converte tudo para minúsculo
}

// Formata a massa atômica, limitando a 3 casas decimais:
function formatAtomicMass(element) {
  const num = element.element.atomicMass.range.min;

  if (Number.isInteger(num)) return num;

  const numString = num.toString().split(".");
  return `${numString[0]}.${numString[1].slice(0, 3)}`;
}

const list = getList(); // Lista de elementos já ordenada
const table = document.querySelector(".table");

// Renderiza o conteúdo HTML interno de um elemento:
function renderElementContent(element) {
  return `
  <div class="header d-flex">
    <span class="atomNum">${element.element.atomicNumber}</span>
    <span class="atomMass">${formatAtomicMass(element)}</span>
  </div>
  <h2>${element.abbr}</h2>
  <p>${element.element.name}</p>
  `;
}

// Cria e adiciona um elemento na tabela:
function renderElement(element, elementClass) {
  const el = document.createElement("div");
  el.classList.add("element", elementClass, "fd-col");
  el.style.gridColumn = element.element.group.column;
  el.style.gridRow = element.element.period;
  el.innerHTML = renderElementContent(element);
  table.appendChild(el);
}

// Renderiza cada elemento da lista principal na tabela:
list.forEach((element) => {
  const elClass = formatClass(element.element.class);
  renderElement(element, elClass);
});

const btnMode = document.querySelector(".btn-mode");
const btnVisibility = document.querySelector(".btn-visibility");

document.addEventListener('DOMContentLoaded', () => {
    const btnMode = document.querySelector(".btn-mode");
  
function toggleMode() {
    const isDarkMode = document.body.classList.toggle("dark-mode");
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
}
  
function applySavedTheme() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
        document.body.classList.toggle("dark-mode", savedTheme === "dark");
    }
 }
  
// Aplica o tema salvo ao carregar a página
applySavedTheme();
  
// Configura o evento de clique no botão para alternar modo
btnMode.addEventListener("click", toggleMode);
});

// Alterna visibilidade dos elementos na tabela:
function toggleVisibility() {
  const isHidden = document.body.classList.toggle("hide-elements");
  btnVisibility.innerHTML = isHidden
    ? '<i class="bx bx-hide"></i>'
    : '<i class="bx bx-show"></i>';

  // Se estiver à mostra novamente, remove destaque de visibilidade individual:
  if (!isHidden) {
    allElements.forEach((element) => element.classList.remove("visible"));
  }
}

btnMode.addEventListener("click", toggleMode);
btnVisibility.addEventListener("click", toggleVisibility);

// Filtra elementos do bloco f (Lantanídeos e Actinídeos):
function filterFBlock(fb) {
  return list.filter((e) => e.element.class == fb);
}

const filteredLantanideos = filterFBlock("Lantanídeos");
const filteredActinideos = filterFBlock("Actinídeos");

// Remove o primeiro elemento da lista:
filteredLantanideos.shift();
filteredActinideos.shift();

// Oculta os elementos do bloco f duplicados na tabela principal:
function hideFBlock(fb) {
  const fbEl = document.querySelectorAll(`.${fb}`);
  fbEl.forEach((el, i) => {
    if (i !== 0) el.style.display = "none";
  });
}

hideFBlock("lantanideos");
hideFBlock("actinideos");

const fBlock = document.querySelector(".f-block"); // Bloco inferior da tabela (f-block)

// Renderiza a linha do bloco f com os elementos filtrados:
function renderRow(els, elClass) {
  els.forEach((el) => {
    const fEl = document.createElement("div");
    fEl.classList.add("element", elClass, "fd-col");
    fEl.innerHTML = renderElementContent(el);
    fBlock.appendChild(fEl);
  });
}

renderRow(filteredLantanideos, "lantanideos");
renderRow(filteredActinideos, "actinideos");

const allElements = document.querySelectorAll(".element"); // Seleciona todos os elementos da tabela

// Alterna visibilidade de um elemento individual quando tudo está oculto:
function toggleElementVisibility(element) {
  element.addEventListener("click", () => {
    if (document.body.classList.contains("hide-elements")) {
      element.classList.toggle("visible");
    } else {
      element.classList.remove("visible");
    }
  });
}

// Aplica o evento de clique a todos os elementos:
allElements.forEach((e) => toggleElementVisibility(e));

const classes = [...new Set(list.map((element) => element.element.class))]; // Lista única de classes de elementos

const legend = document.querySelector(".legend"); // Legenda no topo direito

const root = document.documentElement; // Elemento raiz (para acessar variáveis CSS)

// Aplica estilo de destaque a elementos com base na classe:
function setCustomStyle(element, elementClass) {
  const color = getComputedStyle(root).getPropertyValue(`--${elementClass}`);

  const borderStyle = document.body.classList.contains("dark-mode")
    ? `2px solid color-mix(in srgb, ${color}, #fff 28%)`
    : `2px solid color-mix(in srgb, ${color}, transparent 50%)`;
  element.classList.add("active");
  element.style.border = borderStyle;
}

// Remove o estilo de destaque do elemento:
function setDefaultStyle(element) {
  element.style.border = "none";
}

// Cria a legenda interativa para filtrar por classe:
classes.forEach((cl) => {
  const formattedClass = formatClass(cl);
  const li = document.createElement("li");
  li.classList.add(formattedClass);

  li.innerHTML = `
  <span>${cl}</span>
  `;

  legend.appendChild(li);

  li.addEventListener("click", () => {
    allElements.forEach((element) => {
      element.classList.contains(formattedClass)
        ? setCustomStyle(element, formattedClass)
        : setDefaultStyle(element);
    });
  });
});

// Clique fora da tabela remove o destaque dos elementos:
document.body.addEventListener("click", (event) => {
  if (event.target === event.currentTarget || event.target == table) {
    const active = document.querySelectorAll(".active");
    active.forEach((atv) => {
      atv.classList.remove("active");
      setDefaultStyle(atv);
    });
  }
});

const tipsList = document.querySelector(".tips ul"); // Lista de dicas no aside
const tipsContent = [
  "Clique nas legendas do topo direito para ativar os elementos correspondentes.",
  "Clique fora da tabela para remover o foco dos elementos.",
  "Passe o cursor sobre um elemento para ampliá-lo.",
  "Use os botões do topo esquerdo para alternar entre claro-escuro e visível-oculto",
  "Uma vez oculto, clique sobre o elemento para exibi-lo. Clique novamente para ocultá-lo.",
];

// Renderiza cada dica na lista:
tipsContent.forEach((tc) => {
  const tipsItem = document.createElement("li");
  tipsItem.innerHTML = tc;
  tipsList.appendChild(tipsItem);
});

const tipsBtn = document.querySelector(".show-tips"); // Botão de expandir/recolher dicas
const tipsIcon = document.querySelector(".show-tips i"); // Ícone do botão

// Alterna visibilidade (aberto-fechado) da seção de dicas:
tipsBtn.addEventListener("click", () => {
  const isClosed = tipsIcon.classList.contains("bx-right-arrow-alt");
  tipsList.classList.toggle("opened");
  tipsIcon.classList.replace(
    isClosed ? "bx-right-arrow-alt" : "bx-left-arrow-alt",
    isClosed ? "bx-left-arrow-alt" : "bx-right-arrow-alt"
  );
});
