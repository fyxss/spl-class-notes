const defaultTheme = "dark"
const currentTheme = localStorage.getItem("theme") ?? defaultTheme
document.documentElement.setAttribute("saved-theme", currentTheme)

const emitThemeChangeEvent = (theme: "light" | "dark") => {
  const event: CustomEventMap["themechange"] = new CustomEvent("themechange", {
    detail: { theme },
  })
  document.dispatchEvent(event)
}

document.addEventListener("nav", () => {
  // Enforce saved theme state on every SPA navigation
  const activeTheme = localStorage.getItem("theme") ?? defaultTheme
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
})
