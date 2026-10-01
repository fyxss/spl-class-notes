const userPref = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"
const currentTheme = localStorage.getItem("theme") ?? userPref
document.documentElement.setAttribute("saved-theme", currentTheme)

const emitThemeChangeEvent = (theme: "light" | "dark") => {
  const event: CustomEventMap["themechange"] = new CustomEvent("themechange", {
    detail: { theme },
  })
  document.dispatchEvent(event)
}

document.addEventListener("nav", () => {
  // Enforce saved theme state on every SPA navigation
  const activeTheme = localStorage.getItem("theme") ?? userPref
  document.documentElement.setAttribute("saved-theme", activeTheme)

  const switchTheme = () => {
    const current = document.documentElement.getAttribute("saved-theme")
    const newTheme = current === "dark" ? "light" : "dark"
    document.documentElement.setAttribute("saved-theme", newTheme)
    localStorage.setItem("theme", newTheme)
    emitThemeChangeEvent(newTheme)
  }

  for (const darkmodeButton of document.getElementsByClassName("darkmode")) {
    darkmodeButton.addEventListener("click", switchTheme)
    window.addCleanup(() => darkmodeButton.removeEventListener("click", switchTheme))
  }

  // Listen for OS scheme change only if user hasn't explicitly set a preference
  const colorSchemeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
  const themeChange = (e: MediaQueryListEvent) => {
    if (localStorage.getItem("theme")) return
    const newTheme = e.matches ? "dark" : "light"
    document.documentElement.setAttribute("saved-theme", newTheme)
    emitThemeChangeEvent(newTheme)
  }
  colorSchemeMediaQuery.addEventListener("change", themeChange)
  window.addCleanup(() => colorSchemeMediaQuery.removeEventListener("change", themeChange))
})
