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
