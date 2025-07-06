// Dashboard component JavaScript
class Dashboard {
  constructor() {
    this.initializeKPIs()
    this.startRealTimeUpdates()
    this.setupClickHandlers()
    this.setupButtonHandlers()
  }

  initializeKPIs() {
    // Initialize KPI values
    this.kpiData = {
      activeAgents: 999,
      activeCalls: 999,
      totalCalls: 999,
      averageHandleTime: "0:00:00",
      waitTime: "0:00:00",
      callsOnQueue: "0:00:00",
    }
  }

  setupClickHandlers() {
    // Add click handlers to KPI cards
    const kpiCards = document.querySelectorAll(".kpi")
    kpiCards.forEach((card, index) => {
      card.addEventListener("click", () => {
        const component = card.getAttribute("data-component")
        if (component) {
          this.navigateToComponent(component)
        }
      })

      // Add hover effect
      card.addEventListener("mouseenter", () => {
        card.classList.add("active")
      })

      card.addEventListener("mouseleave", () => {
        card.classList.remove("active")
      })
    })
  }

  setupButtonHandlers() {
    const startButton = document.getElementById("button-start")
    const stopButton = document.getElementById("button-stop")

    if (startButton) {
      startButton.addEventListener("click", () => {
        console.log("Starting call monitoring...")
        startButton.textContent = "Monitoring Active"
        startButton.disabled = true
        if (stopButton) {
          stopButton.disabled = false
        }
      })
    }

    if (stopButton) {
      stopButton.addEventListener("click", () => {
        console.log("Stopping call monitoring...")
        stopButton.textContent = "Stop Monitoring"
        stopButton.disabled = true
        if (startButton) {
          startButton.disabled = false
          startButton.textContent = "Start Monitoring"
        }
      })
    }
  }

  navigateToComponent(component) {
    console.log(`Navigating to: ${component}`)

    // Check if the loadComponent function exists (from sidemenu.js)
    if (window.loadComponent) {
      window.loadComponent(component)
    } else {
      // Fallback navigation method
      this.loadComponentContent(component)
    }
  }

  loadComponentContent(component) {
    const url = `${component}/index.html`
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return response.text()
      })
      .then((html) => {
        // Find the main content area and update it
        const mainContent = document.querySelector("#main-content") || document.querySelector("main") || document.body
        if (mainContent) {
          mainContent.innerHTML = html

          // Load component-specific CSS and JS
          this.loadComponentAssets(component)
        }
      })
      .catch((error) => {
        console.error("Error loading component:", error)
        this.showErrorMessage(`Error loading ${component}`)
      })
  }

  loadComponentAssets(component) {
    // Load CSS
    const cssPath = `${component}/style.css`
    const existingCSS = document.querySelector(`link[href="${cssPath}"]`)
    if (!existingCSS) {
      const link = document.createElement("link")
      link.rel = "stylesheet"
      link.href = cssPath
      document.head.appendChild(link)
    }

    // Load JS
    const jsPath = `${component}/code.js`
    const existingJS = document.querySelector(`script[src="${jsPath}"]`)
    if (!existingJS) {
      const script = document.createElement("script")
      script.src = jsPath
      script.type = "module"
      document.head.appendChild(script)
    }
  }

  showErrorMessage(message) {
    const errorDiv = document.createElement("div")
    errorDiv.className = "error-message"
    errorDiv.style.cssText = `
      background: linear-gradient(135deg, #ff6b6b, #ee5a52);
      color: white;
      padding: 20px;
      border-radius: 10px;
      margin: 20px;
      text-align: center;
      box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
    `
    errorDiv.textContent = message

    const mainContent = document.querySelector("#main-content") || document.querySelector("main") || document.body
    if (mainContent) {
      mainContent.innerHTML = ""
      mainContent.appendChild(errorDiv)
    }
  }

  updateKPI(kpiIndex, value) {
    const kpis = document.querySelectorAll(".kpi-number")
    if (kpis[kpiIndex]) {
      // Add animation effect
      kpis[kpiIndex].style.transform = "scale(1.1)"
      kpis[kpiIndex].style.transition = "transform 0.2s ease"

      setTimeout(() => {
        kpis[kpiIndex].textContent = value
        kpis[kpiIndex].style.transform = "scale(1)"
      }, 100)
    }
  }

  formatTime(seconds) {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  startRealTimeUpdates() {
    // Simulate real-time updates every 5 seconds
    setInterval(() => {
      // Update with random values for demonstration
      this.updateKPI(0, Math.floor(Math.random() * 50) + 950) // Active Agents
      this.updateKPI(1, Math.floor(Math.random() * 100) + 900) // Active Calls
      this.updateKPI(2, Math.floor(Math.random() * 200) + 800) // Total Calls

      // Update time-based KPIs
      const randomTime1 = Math.floor(Math.random() * 300)
      const randomTime2 = Math.floor(Math.random() * 180)
      const randomTime3 = Math.floor(Math.random() * 120)

      this.updateKPI(3, this.formatTime(randomTime1)) // Average Handle Time
      this.updateKPI(4, this.formatTime(randomTime2)) // Wait Time
      this.updateKPI(5, this.formatTime(randomTime3)) // Calls on Queue
    }, 5000)
  }

  // Method to handle component switching from external calls
  static switchToComponent(componentName) {
    const dashboard = new Dashboard()
    dashboard.navigateToComponent(componentName)
  }
}

// Initialize dashboard when component loads
document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector(".dashboard-container")) {
    new Dashboard()
  }
})

// Export for external use
if (typeof module !== "undefined" && module.exports) {
  module.exports = Dashboard
} else if (typeof window !== "undefined") {
  window.Dashboard = Dashboard
}
