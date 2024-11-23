const menu = (() => {
  const btn = document.querySelector("#menu-btn");
  const menu = document.querySelector("#menu-mobile");

  btn.addEventListener("click", () => {
    const expaned = btn.ariaExpanded === "true" ? true : false;
    btn.ariaExpanded = !expaned;

    if (expaned) menu.classList.add("hidden");
    else menu.classList.remove("hidden");
  });
})();

const popup = (() => {
  const element = document.querySelector(".popup");
  const closeBtn = element.querySelector(".btn-close");
  const title = element.querySelector(".popup-title");
  const value = element.querySelector(".popup-value");

  const open = (id, text) => {
    element.classList.remove("hidden");
    title.textContent = `ID: ${id}`;
    value.textContent = `Wartość: ${text}`;
  };

  const close = () => {
    element.classList.add("hidden");
  };

  closeBtn.addEventListener("click", () => close());

  return { open };
})();

const navScroll = (() => {
  const navList = document.querySelector(".nav-list-desktop");
  const navLinks = navList.querySelectorAll(".nav-list-link");
  const sections = document.querySelectorAll(".section");

  let values = {};

  const createValues = () => {
    values = {};

    sections.forEach((section, index) => {
      const rect = section.getBoundingClientRect();
      const scrollY = window.scrollY;

      values[section.id] = {
        start: index === 0 ? 0 : scrollY + rect.top,
        end: scrollY + rect.bottom,
      };
    });
  };

  const getCurrentSection = () => {
    const scrollY = window.scrollY;

    for (const [id, range] of Object.entries(values)) {
      if (scrollY >= range.start && scrollY < range.end) {
        return id;
      }
    }

    return null;
  };

  const showActiveNavLink = (id) => {
    navLinks.forEach((navLink) => {
      const link = navLink.querySelector("a");
      const href = link.href.split("#")[1];

      if (id === href) {
        navLink.classList.add("nav-list-link-active");
      } else {
        navLink.classList.remove("nav-list-link-active");
      }
    });
  };

  createValues();

  window.addEventListener("resize", () => createValues());
  window.addEventListener("scroll", () => {
    const current = getCurrentSection();
    if (!current) return;

    showActiveNavLink(current);
  });
})();

const products = (() => {
  let generatedCount = 0;

  const container = document.querySelector(".products");
  const select = document.querySelector("#products-count");
  const btns = [];

  const showModal = (e) => {
    const btn = e.target;
    const id = btn.dataset.id;
    const text = btn.dataset.text;

    popup.open(id, text);
  };

  const clear = () => {
    while (btns.length > 0) {
      const btn = btns.pop();

      btn.removeEventListener("click", showModal);
      btn.remove();
    }
  };

  const addBtn = ({ id, text }) => {
    const btn = document.createElement("button");

    btn.type = "button";
    btn.className = "btn btn-product";
    btn.textContent = `ID: ${id}`;
    btn.dataset.id = id;
    btn.dataset.text = text;
    btn.addEventListener("click", showModal);

    container.appendChild(btn);
    btns.push(btn);
  };

  const getData = async (pages, size) => {
    const response = await fetch(
      `https://brandstestowy.smallhost.pl/api/random?pageNumber=${pages}&pageSize=${size}`
    );
    const { data } = await response.json();

    return data;
  };

  const generateProducts = async (size) => {
    const pages = Math.floor(size / 100) + 1;
    const arr = [];

    for (let i = 1; i <= pages; i++) {
      const data = await getData(i, size);
      if (data && Array.isArray(data)) arr.push(...data);
    }

    clear();
    arr.forEach(addBtn);

    generatedCount = size;
  };

  select.addEventListener("change", (e) => generateProducts(e.target.value));
  window.addEventListener("scroll", () => {
    const rect = container.getBoundingClientRect();
    const scrollY = window.scrollY;
    const productsBottom = scrollY + rect.bottom;

    if (window.scrollY + window.innerHeight >= productsBottom) {
      generateProducts(generatedCount + 16);
    }
  });

  generateProducts(20);
})();
