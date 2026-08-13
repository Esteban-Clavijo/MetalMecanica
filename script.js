const themeToggle = document.getElementById('themeToggle');
const themeColor = document.querySelector('meta[name="theme-color"]');

function applyTheme(theme){
  const isLight = theme === 'light';
  document.body.classList.toggle('light-mode', isLight);
  themeToggle.textContent = isLight ? '🌙' : '☀️';
  themeToggle.setAttribute('aria-label', isLight ? 'Cambiar a modo noche' : 'Cambiar a modo día');
  themeToggle.title = isLight ? 'Cambiar a modo noche' : 'Cambiar a modo día';
  if(themeColor) themeColor.setAttribute('content', isLight ? '#f4f7fb' : '#07111f');
}

const savedTheme = localStorage.getItem('mmc-theme');
applyTheme(savedTheme === 'dark' ? 'dark' : 'light');

themeToggle.addEventListener('click', () => {
  const nextTheme = document.body.classList.contains('light-mode') ? 'dark' : 'light';
  localStorage.setItem('mmc-theme', nextTheme);
  applyTheme(nextTheme);
});

const topbar = document.getElementById('topbar');
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    topbar.classList.toggle('scrolled', window.scrollY > 18);
  }, { passive:true });

  menuToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.textContent = open ? '✕' : '☰';
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuToggle.setAttribute('aria-expanded','false');
      menuToggle.textContent = '☰';
    });
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold:.13 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  document.getElementById('quoteForm').addEventListener('submit', event => {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const service = document.getElementById('service').value;
    const message = document.getElementById('message').value.trim();

    const text =
      `Hola, soy ${name}.%0A` +
      `Mi teléfono es: ${phone}.%0A` +
      `Servicio: ${service}.%0A` +
      `Descripción: ${message}`;

    window.open(`https://wa.me/593984192851?text=${text}`, '_blank');
  });


  const memorySymbols = ["⚙️","🔧","🔨","🧰","🏗️","🦺"];
  const memoryGrid = document.getElementById("memoryGrid");
  const memoryMoves = document.getElementById("memoryMoves");
  const memoryPairs = document.getElementById("memoryPairs");
  const memoryTime = document.getElementById("memoryTime");
  const memoryMessage = document.getElementById("memoryMessage");
  const restartMemory = document.getElementById("restartMemory");

  let firstCard = null;
  let secondCard = null;
  let boardLocked = false;
  let moves = 0;
  let pairs = 0;
  let seconds = 0;
  let timer = null;
  let started = false;

  function shuffleMemory(items){
    const copy = [...items];
    for(let i = copy.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function formatMemoryTime(total){
    const min = String(Math.floor(total / 60)).padStart(2,"0");
    const sec = String(total % 60).padStart(2,"0");
    return `${min}:${sec}`;
  }

  function startMemoryTimer(){
    if(started) return;
    started = true;
    timer = setInterval(() => {
      seconds++;
      memoryTime.textContent = formatMemoryTime(seconds);
    },1000);
  }

  function showCard(card){
    card.classList.add("flipped");
    card.textContent = card.dataset.symbol;
    card.setAttribute("aria-label",`Tarjeta ${card.dataset.symbol}`);
  }

  function hideCard(card){
    card.classList.remove("flipped");
    card.textContent = "MMC";
    card.setAttribute("aria-label","Tarjeta oculta");
  }

  function resetTurn(){
    firstCard = null;
    secondCard = null;
    boardLocked = false;
  }

  function handleMemoryCard(card){
    if(boardLocked || card === firstCard || card.classList.contains("matched")) return;

    startMemoryTimer();
    showCard(card);

    if(!firstCard){
      firstCard = card;
      memoryMessage.textContent = "Selecciona otra tarjeta.";
      return;
    }

    secondCard = card;
    moves++;
    memoryMoves.textContent = moves;
    boardLocked = true;

    if(firstCard.dataset.symbol === secondCard.dataset.symbol){
      firstCard.classList.add("matched");
      secondCard.classList.add("matched");
      firstCard.disabled = true;
      secondCard.disabled = true;

      pairs++;
      memoryPairs.textContent = pairs;
      memoryMessage.textContent = "¡Pareja encontrada!";

      if(pairs === memorySymbols.length){
        clearInterval(timer);
        memoryMessage.textContent =
          `¡Excelente! Completaste el juego en ${moves} movimientos y ${formatMemoryTime(seconds)}.`;
      }

      resetTurn();
    }else{
      memoryMessage.textContent = "No coinciden. Inténtalo nuevamente.";

      setTimeout(() => {
        hideCard(firstCard);
        hideCard(secondCard);
        resetTurn();
        memoryMessage.textContent = "Selecciona dos tarjetas.";
      },900);
    }
  }

  function createMemoryGame(){
    clearInterval(timer);

    firstCard = null;
    secondCard = null;
    boardLocked = false;
    moves = 0;
    pairs = 0;
    seconds = 0;
    started = false;

    memoryMoves.textContent = "0";
    memoryPairs.textContent = "0";
    memoryTime.textContent = "00:00";
    memoryMessage.textContent = "Selecciona dos tarjetas para comenzar.";
    memoryGrid.innerHTML = "";

    const cards = shuffleMemory([...memorySymbols,...memorySymbols]);

    cards.forEach(symbol => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "memory-card";
      button.dataset.symbol = symbol;
      button.textContent = "MMC";
      button.setAttribute("aria-label","Tarjeta oculta");
      button.addEventListener("click",() => handleMemoryCard(button));
      memoryGrid.appendChild(button);
    });
  }

  restartMemory.addEventListener("click",createMemoryGame);
  createMemoryGame();

// AMPLIAR IMAGENES DE TRABAJOS

const imageLightbox = document.getElementById("imageLightbox");
const imageLightboxImg = document.getElementById("imageLightboxImg");
const imageLightboxClose = document.getElementById("imageLightboxClose");

document.querySelectorAll(".work img").forEach((img) => {
    img.addEventListener("click", () => {

        imageLightboxImg.src = img.src;
        imageLightbox.classList.add("open");
        imageLightbox.setAttribute("aria-hidden", "false");

        document.body.style.overflow = "hidden";
    });
});

function closeImageLightbox() {
    imageLightbox.classList.remove("open");
    imageLightbox.setAttribute("aria-hidden", "true");
    imageLightboxImg.src = "";
    document.body.style.overflow = "";
}

imageLightboxClose.addEventListener("click", closeImageLightbox);

imageLightbox.addEventListener("click", (event) => {
    if (event.target === imageLightbox) {
        closeImageLightbox();
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && imageLightbox.classList.contains("open")) {
        closeImageLightbox();
    }
});
