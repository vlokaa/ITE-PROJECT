// Pagely - shared script
document.addEventListener("DOMContentLoaded", () => {
  const safe = {
    get: k => { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  // Feature 1: dark / light mode
  const root = document.documentElement, themeBtn = document.getElementById("themeBtn");
  const applyTheme = t => {
    root.setAttribute("data-theme", t);
    if (themeBtn) themeBtn.textContent = t === "dark" ? "Light mode" : "Dark mode";
  };
  applyTheme(safe.get("theme") || "light");
  if (themeBtn) themeBtn.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next); safe.set("theme", next);
  });

  // Feature 2: like button (saved per story)
  document.querySelectorAll(".like-btn").forEach(btn => {
    const key = "like-" + btn.dataset.id;
    const render = on => {
      btn.classList.toggle("liked", on);
      btn.setAttribute("aria-pressed", on);
      btn.textContent = on ? "Liked" : "Like";
    };
    render(safe.get(key) === "1");
    btn.addEventListener("click", () => {
      const on = safe.get(key) !== "1"; safe.set(key, on ? "1" : "0"); render(on);
    });
  });

  // Feature 3: show / hide synopsis
  const toggle = document.querySelector(".toggle-syn"), syn = document.getElementById("synopsis");
  if (toggle && syn) toggle.addEventListener("click", () => {
    syn.hidden = !syn.hidden;
    toggle.textContent = syn.hidden ? "Show synopsis" : "Hide synopsis";
    toggle.setAttribute("aria-expanded", !syn.hidden);
  });

  // Feature 4: reading progress bar
  const bar = document.getElementById("progress");
  if (bar) {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + "%";
    };
    window.addEventListener("scroll", update, { passive: true }); update();
  }

  // Feature 5: library search + genre filter
  const grid = document.getElementById("bookGrid");
  if (grid) {
    const search = document.getElementById("search"), genre = document.getElementById("genreFilter");
    const count = document.getElementById("count"), empty = document.getElementById("empty");
    const cards = [...grid.querySelectorAll(".book-card")];
    const param = new URLSearchParams(location.search).get("genre");
    if (param) genre.value = param;
    const filter = () => {
      const q = search.value.trim().toLowerCase(); let shown = 0;
      cards.forEach(c => {
        const ok = (genre.value === "all" || c.dataset.genre === genre.value) &&
                   (c.dataset.title.includes(q) || c.dataset.author.includes(q));
        c.hidden = !ok; if (ok) shown++;
      });
      count.textContent = "Showing " + shown + " of " + cards.length + " stories";
      empty.hidden = shown !== 0;
    };
    search.addEventListener("input", filter); genre.addEventListener("change", filter); filter();
  }
});
