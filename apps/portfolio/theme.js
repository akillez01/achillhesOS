(() => {
  const root = document.documentElement;
  const toggle = document.getElementById("themeToggle");
  const initialTheme = root.getAttribute("data-theme") || "dark";

  root.setAttribute("data-theme", initialTheme);

  const updateToggleLabel = (theme) => {
    if (!toggle) return;
    const isDark = theme === "dark";
    toggle.textContent = isDark ? "Modo claro" : "Modo escuro";
    toggle.setAttribute("aria-label", isDark ? "Ativar modo claro" : "Ativar modo escuro");
    toggle.setAttribute("aria-pressed", String(!isDark));
  };

  updateToggleLabel(initialTheme);

  if (toggle) {
    toggle.addEventListener("click", () => {
      const current = root.getAttribute("data-theme") || "dark";
      const next = current === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      updateToggleLabel(next);

      try {
        localStorage.setItem("ao-theme", next);
      } catch (error) {
        // Ignora falha de storage.
      }
    });
  }
})();
