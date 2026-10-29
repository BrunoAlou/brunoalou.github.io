document.querySelectorAll('.glitch').forEach((el) => {
  el.addEventListener('mouseover', () => {
    el.style.transform = 'rotate(5deg)';
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = 'rotate(0deg)';
  });
});

// Tema claro/escuro, lembrado entre visitas
const toggleButton = document.getElementById('theme-toggle');
toggleButton.addEventListener('click', () => {
  const isLight = document.documentElement.classList.toggle('light-mode');
  try { localStorage.setItem('theme', isLight ? 'light' : 'dark'); } catch (e) {}
});

// Menu no celular
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open);
});

// Paginação de listas: <div data-paginate="9"> com os itens como filhos diretos
document.querySelectorAll('[data-paginate]').forEach((list) => {
  const perPage = Number(list.dataset.paginate);
  const items = Array.from(list.children);
  const total = Math.ceil(items.length / perPage);
  if (total <= 1) return;

  const nav = document.createElement('nav');
  nav.className = 'pagination';
  nav.setAttribute('aria-label', 'Paginação');
  list.after(nav);

  function show(page, scroll) {
    page = Math.min(Math.max(page, 1), total);
    items.forEach((item, i) => {
      item.hidden = Math.floor(i / perPage) + 1 !== page;
    });

    nav.innerHTML = '';
    const addButton = (label, target, { current = false, disabled = false } = {}) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = label;
      button.disabled = disabled;
      if (current) button.setAttribute('aria-current', 'page');
      button.addEventListener('click', () => show(target, true));
      nav.appendChild(button);
    };
    addButton('←', page - 1, { disabled: page === 1 });
    for (let p = 1; p <= total; p++) addButton(String(p), p, { current: p === page });
    addButton('→', page + 1, { disabled: page === total });

    const url = new URL(location.href);
    if (page === 1) url.searchParams.delete('pagina');
    else url.searchParams.set('pagina', page);
    history.replaceState(null, '', url);

    if (scroll) list.parentElement.scrollIntoView({ behavior: 'smooth' });
  }

  show(Number(new URLSearchParams(location.search).get('pagina')) || 1, false);
});
