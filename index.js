(() => {
  const btn = document.querySelector("#menu-btn");
  const menu = document.querySelector("#menu-mobile");

  btn.addEventListener("click", () => {
    const expaned = btn.ariaExpanded === "true";
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

(() => {
  const navLinks = document.querySelectorAll('.nav-list a[href^="#"]');
  const sections = document.querySelectorAll(".section");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const links = document.querySelectorAll(
          `.nav-list a[href="#${entry.target.id}"]`
        );

        if (entry.isIntersecting) {
          navLinks.forEach((navLink) => {
            navLink.parentElement.classList.remove("nav-list-link-active");
          });

          if (links && links.length > 0) {
            links.forEach((link) =>
              link.parentElement.classList.add("nav-list-link-active")
            );
          }
        }
      });
    },
    { root: null, threshold: 0.2 }
  );

  sections.forEach((section) => observer.observe(section));
})();

const error = (() => {
  const element = document.querySelector(".error");
  const message = element.querySelector(".error-message");

  const show = (msg) => {
    element.classList.remove("hidden");
    message.textContent = msg;
  };

  const hide = () => {
    element.classList.add("hidden");
    message.textContent = "";
  };

  return { show, hide };
})();

(() => {
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

    error.hide();

    for (let i = 1; i <= pages; i++) {
      try {
        const data = await getData(i, size);
        if (data && Array.isArray(data)) arr.push(...data);
      } catch (err) {
        error.show(err);
      }
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

    if (generatedCount < 1 && scrollY >= scrollY + rect.top) {
      generateProducts(20);
    }

    if (scrollY + window.innerHeight >= productsBottom) {
      generateProducts(generatedCount + 16);
    }
  });
})();
