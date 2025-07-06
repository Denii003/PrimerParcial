//load side menu
async function loadSideMenu() {
  //load json file
  return await fetch("./json/menu.json")
    .then((response) => {
      return response.json()
    })
    .catch((error) => {
      console.error(error)
    })
}

//show side menu
export function showSideMenu() {
  //parent div
  var sideMenu = document.getElementById("side-menu")
  sideMenu.innerHTML = ""

  loadSideMenu().then((response) => {
    console.log(response)
    if (response && response.options) {
      response.options.forEach((option) => {
        sideMenu.appendChild(drawOption(option))
      })
    }
  })
}

//draw menu option
function drawOption(option) {
  console.log(option)
  //parent div
  var divOption = document.createElement("div")
  divOption.id = "side-menu-option-" + option.id
  divOption.className = "side-menu-option"
  divOption.addEventListener("click", () => {
    // Remove active class from all options
    document.querySelectorAll(".side-menu-option").forEach((opt) => {
      opt.classList.remove("active")
    })
    // Add active class to clicked option
    divOption.classList.add("active")
    // Load component
    window.loadComponent(option.component)
  })

  //icon
  var divIcon = document.createElement("div")
  divIcon.className = "side-menu-icon"
  divIcon.style.background = option.color
  divOption.appendChild(divIcon)

  var icon = document.createElement("i")
  icon.className = "fas fa-" + option.icon
  divIcon.appendChild(icon)

  //label
  var divLabel = document.createElement("div")
  divLabel.className = "side-menu-label"
  divLabel.innerHTML = option.text
  divOption.appendChild(divLabel)

  //return
  return divOption
}

// Fixed loadComponent function
function loadComponent(component) {
  console.log("Loading component:", component)
  var url = component + "/index.html"

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return response.text()
    })
    .then((html) => {
      console.log("Component loaded successfully")

      // Find the content area and update it
      var contentArea = document.getElementById("content")
      if (contentArea) {
        contentArea.innerHTML = html

        // Load component-specific CSS
        loadComponentCSS(component)

        // Load component-specific JavaScript
        loadComponentJS(component)

        // Initialize component if it has initialization code
        initializeComponent(component)
      } else {
        console.error("Content area not found")
      }
    })
    .catch((error) => {
      console.error("Error loading component:", error)
      var contentArea = document.getElementById("content")
      if (contentArea) {
        contentArea.innerHTML = `
                <div style="padding: 40px; text-align: center; color: white;">
                    <h2>Error Loading Component</h2>
                    <p>Could not load ${component}</p>
                    <p>Error: ${error.message}</p>
                </div>
            `
      }
    })
}

// Load component CSS
function loadComponentCSS(component) {
  const cssPath = component + "/style.css"
  const existingCSS = document.querySelector(`link[href="${cssPath}"]`)

  if (!existingCSS) {
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = cssPath
    link.onload = () => console.log(`CSS loaded: ${cssPath}`)
    link.onerror = () => console.log(`CSS not found: ${cssPath}`)
    document.head.appendChild(link)
  }
}

// Load component JavaScript
function loadComponentJS(component) {
  const jsPath = component + "/code.js"
  const existingJS = document.querySelector(`script[src="${jsPath}"]`)

  if (!existingJS) {
    const script = document.createElement("script")
    script.src = jsPath
    script.type = "module"
    script.onload = () => console.log(`JS loaded: ${jsPath}`)
    script.onerror = () => console.log(`JS not found: ${jsPath}`)
    document.head.appendChild(script)
  }
}

// Initialize component after loading
function initializeComponent(component) {
  // Wait a bit for scripts to load
  setTimeout(() => {
    if (component.includes("dashboard")) {
      // Initialize dashboard
      const Dashboard = window.Dashboard // Declare Dashboard variable
      if (Dashboard) {
        new Dashboard()
      }

      // Initialize charts if Highcharts is available
      const Highcharts = window.Highcharts // Declare Highcharts variable
      if (Highcharts) {
        // Call getData function from main.js if available
        const getData = window.getData // Declare getData variable
        if (getData) {
          getData()
        }
      }
    } else if (component.includes("charts")) {
      // Initialize charts component
      const ChartsComponent = window.ChartsComponent // Declare ChartsComponent variable
      if (ChartsComponent) {
        new ChartsComponent()
      }
    }
  }, 500)
}

// Make loadComponent available globally
window.loadComponent = loadComponent
