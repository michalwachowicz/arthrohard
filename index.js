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

const products = (() => {
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

  const generateProducts = async (size) => {
    const response = await fetch(
      `https://brandstestowy.smallhost.pl/api/random?pageNumber=1&pageSize=${size}`
    );
    const { data } = await response.json();
    if (!data || !Array.isArray(data)) return;

    clear();
    data.forEach(addBtn);
  };

  select.addEventListener("change", (e) => generateProducts(e.target.value));
  generateProducts(20);
})();
