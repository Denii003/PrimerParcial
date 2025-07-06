// Main application JavaScript
console.log("Application starting...")

//imports
import { showSideMenu } from "./sidemenu.js"
import Highcharts from "highcharts" // Declare Highcharts variable

// Global variables
let sideMenuVisible = true
let intervalReceive = null
let intervalEnd = null
const intervalChart = null

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded, initializing...")

  // Show side menu
  showSideMenu()

  // Initialize sidebar
  initializeSidebar()

  // Load default component (dashboard)
  setTimeout(() => {
    window.loadComponent("dashboard")
  }, 500)

  // Initialize dashboard
  initializeDashboard()

  // Start data updates
  startDataUpdates()

  // Initialize charts
  setTimeout(initializeCharts, 1000)
})

// Initialize sidebar functionality
function initializeSidebar() {
  const sideMenuIcon = document.getElementById("icon-side-menu")
  const sideMenuOptions = document.querySelectorAll(".side-menu-option")

  // Toggle sidebar
  if (sideMenuIcon) {
    sideMenuIcon.addEventListener("click", toggleSideMenu)
  }

  // Add click handlers to sidebar options
  sideMenuOptions.forEach((option) => {
    option.addEventListener("click", function () {
      // Remove active class from all options
      sideMenuOptions.forEach((opt) => opt.classList.remove("active"))

      // Add active class to clicked option
      this.classList.add("active")

      // Get component name
      const component = this.getAttribute("data-component")
      window.loadComponent(component)
    })
  })
}

// Initialize dashboard functionality
function initializeDashboard() {
  const kpiCards = document.querySelectorAll(".kpi")
  const startButton = document.getElementById("button-start")
  const stopButton = document.getElementById("button-stop")

  // Add click handlers to KPI cards
  kpiCards.forEach((card) => {
    card.addEventListener("click", function () {
      const component = this.getAttribute("data-component")
      if (component) {
        window.loadComponent(component)
      }
    })
  })

  // Add button handlers
  if (startButton) {
    startButton.addEventListener("click", startCallGenerator)
  }

  if (stopButton) {
    stopButton.addEventListener("click", stopCallGenerator)
  }
}

// Toggle sidebar visibility
function toggleSideMenu() {
  const sideMenu = document.getElementById("side-menu")
  const content = document.getElementById("content")

  sideMenuVisible = !sideMenuVisible

  if (sideMenuVisible) {
    sideMenu.style.display = "block"
    content.style.marginLeft = "250px"
  } else {
    sideMenu.style.display = "none"
    content.style.marginLeft = "0"
  }
}

// Global function to load components
window.loadComponent = (component) => {
  console.log("Loading component:", component)
  const content = document.getElementById("content")

  switch (component) {
    case "dashboard":
      loadDashboardContent()
      break
    case "agents":
      loadAgentsContent()
      break
    case "calls":
      loadCallsContent()
      break
    case "reports":
      loadReportsContent()
      break
    case "analytics":
      loadAnalyticsContent()
      break
    case "queue":
      loadQueueContent()
      break
    case "charts":
      loadChartsContent()
      break
    case "map":
      loadMapContent()
      break
    case "layout":
      loadLayoutContent()
      break
    case "settings":
      loadSettingsContent()
      break
    default:
      loadDashboardContent()
  }
}

// Load dashboard content (default)
function loadDashboardContent() {
  // Dashboard is already loaded in the HTML, just reinitialize
  initializeDashboard()
  startDataUpdates()
  setTimeout(initializeCharts, 500)
}

// Load agents content
function loadAgentsContent() {
  const content = document.getElementById("content")
  content.innerHTML = `
      <div class="component-container">
          <div class="component-header">
              <h1>Active Agents</h1>
              <div class="component-stats">
                  <span class="stat">Total: 999</span>
                  <span class="stat">Available: 856</span>
                  <span class="stat">Busy: 143</span>
              </div>
          </div>
          <div class="agents-grid">
              ${generateAgentCards()}
          </div>
      </div>
  `
}

// Load calls content
function loadCallsContent() {
  const content = document.getElementById("content")
  content.innerHTML = `
      <div class="component-container">
          <div class="component-header">
              <h1>Active Calls</h1>
              <div class="component-stats">
                  <span class="stat">Incoming: 456</span>
                  <span class="stat">Outgoing: 234</span>
                  <span class="stat">On Hold: 89</span>
              </div>
          </div>
          <div class="calls-list">
              ${generateCallsList()}
          </div>
      </div>
  `
}

// Load charts content
function loadChartsContent() {
  const content = document.getElementById("content")
  content.innerHTML = `
      <div class="component-container">
          <div class="component-header">
              <h1>Analytics & Charts</h1>
          </div>
          <div class="charts-grid">
              <div class="chart-card">
                  <h3>Call Volume Trends</h3>
                  <div id="volume-chart" class="chart"></div>
              </div>
              <div class="chart-card">
                  <h3>Agent Performance</h3>
                  <div id="performance-chart" class="chart"></div>
              </div>
              <div class="chart-card">
                  <h3>Response Times</h3>
                  <div id="response-chart" class="chart"></div>
              </div>
              <div class="chart-card">
                  <h3>Customer Satisfaction</h3>
                  <div id="satisfaction-chart" class="chart"></div>
              </div>
          </div>
      </div>
  `

  // Initialize charts after content is loaded
  setTimeout(initializeComponentCharts, 500)
}

// Load other components
function loadReportsContent() {
  const content = document.getElementById("content")
  content.innerHTML = `
      <div class="component-container">
          <h1>Reports & Analytics</h1>
          <div class="reports-grid">
              <div class="report-card">
                  <h3>Daily Report</h3>
                  <p>Total calls: 1,234</p>
                  <p>Average duration: 4:32</p>
              </div>
              <div class="report-card">
                  <h3>Weekly Report</h3>
                  <p>Total calls: 8,567</p>
                  <p>Peak hours: 2-4 PM</p>
              </div>
          </div>
      </div>
  `
}

function loadAnalyticsContent() {
  const content = document.getElementById("content")
  content.innerHTML = `
      <div class="component-container">
          <h1>Analytics Dashboard</h1>
          <div class="analytics-metrics">
              <div class="metric-card">
                  <h3>Average Handle Time</h3>
                  <div class="metric-value">4:32</div>
              </div>
              <div class="metric-card">
                  <h3>First Call Resolution</h3>
                  <div class="metric-value">87%</div>
              </div>
          </div>
      </div>
  `
}

function loadQueueContent() {
  const content = document.getElementById("content")
  content.innerHTML = `
      <div class="component-container">
          <h1>Call Queue Management</h1>
          <div class="queue-stats">
              <div class="queue-card">
                  <h3>Calls in Queue</h3>
                  <div class="queue-number">23</div>
              </div>
              <div class="queue-card">
                  <h3>Average Wait Time</h3>
                  <div class="queue-time">2:15</div>
              </div>
          </div>
      </div>
  `
}

function loadMapContent() {
  const content = document.getElementById("content")
  content.innerHTML = `
      <div class="component-container">
          <h1>Geographic Distribution</h1>
          <div class="map-placeholder">
              <p>Interactive map showing call distribution by location</p>
          </div>
      </div>
  `
}

function loadLayoutContent() {
  const content = document.getElementById("content")
  content.innerHTML = `
      <div class="component-container">
          <h1>Layout Configuration</h1>
          <div class="layout-options">
              <div class="layout-card">
                  <h3>Dashboard Layout</h3>
                  <p>Customize dashboard appearance</p>
              </div>
          </div>
      </div>
  `
}

function loadSettingsContent() {
  const content = document.getElementById("content")
  content.innerHTML = `
      <div class="component-container">
          <h1>System Settings</h1>
          <div class="settings-sections">
              <div class="settings-card">
                  <h3>General Settings</h3>
                  <p>Configure system preferences</p>
              </div>
              <div class="settings-card">
                  <h3>User Management</h3>
                  <p>Manage user accounts and permissions</p>
              </div>
          </div>
      </div>
  `
}

// Generate agent cards
function generateAgentCards() {
  let html = ""
  for (let i = 1; i <= 12; i++) {
    const status = Math.random() > 0.3 ? "available" : "busy"
    html += `
        <div class="agent-card ${status}">
            <div class="agent-avatar">
                <i class="fas fa-user"></i>
            </div>
            <div class="agent-info">
                <h4>Agent ${i.toString().padStart(3, "0")}</h4>
                <p class="agent-status">${status}</p>
                <p class="agent-calls">Calls: ${Math.floor(Math.random() * 50)}</p>
            </div>
        </div>
    `
  }
  return html
}

// Generate calls list
function generateCallsList() {
  let html = ""
  for (let i = 1; i <= 10; i++) {
    const duration = `${Math.floor(Math.random() * 10)}:${Math.floor(Math.random() * 60)
      .toString()
      .padStart(2, "0")}`
    html += `
        <div class="call-item">
            <div class="call-info">
                <span class="call-number">+1 (555) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}</span>
                <span class="call-agent">Agent ${Math.floor(Math.random() * 100) + 1}</span>
            </div>
            <div class="call-duration">${duration}</div>
            <div class="call-status">Active</div>
        </div>
    `
  }
  return html
}

// Start data updates
function startDataUpdates() {
  // Update KPI values every 5 seconds
  setInterval(updateKPIValues, 5000)

  // Update timestamp
  setInterval(updateTimestamp, 1000)

  // Initial update
  updateKPIValues()
  updateTimestamp()
}

// Update KPI values
function updateKPIValues() {
  const kpiNumbers = document.querySelectorAll(".kpi-number")

  kpiNumbers.forEach((element, index) => {
    if (index < 3) {
      // Numeric KPIs
      const baseValue = [999, 999, 999][index]
      const variation = Math.floor(Math.random() * 100) - 50
      element.textContent = Math.max(0, baseValue + variation)
    } else {
      // Time-based KPIs
      const minutes = Math.floor(Math.random() * 10)
      const seconds = Math.floor(Math.random() * 60)
      element.textContent = `0:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
    }
  })
}

// Update timestamp
function updateTimestamp() {
  const timestampElement = document.getElementById("label-last-update")
  if (timestampElement) {
    const now = new Date()
    timestampElement.textContent = now.toLocaleTimeString()
  }
}

// Initialize charts
function initializeCharts() {
  if (typeof Highcharts === "undefined") {
    console.log("Highcharts not loaded")
    return
  }

  // Chart 1: Call Duration
  if (document.getElementById("chart-duration")) {
    Highcharts.chart("chart-duration", {
      chart: {
        type: "column",
        backgroundColor: "transparent",
      },
      title: {
        text: "Call Duration Distribution",
        style: { color: "#fff" },
      },
      xAxis: {
        categories: ["0-1 min", "1-3 min", "3-5 min", "5-10 min", "10+ min"],
        labels: { style: { color: "#fff" } },
      },
      yAxis: {
        title: {
          text: "Number of Calls",
          style: { color: "#fff" },
        },
        labels: { style: { color: "#fff" } },
      },
      series: [
        {
          name: "Calls",
          data: [120, 340, 280, 150, 60],
          color: "#40E0D0",
        },
      ],
      legend: { itemStyle: { color: "#fff" } },
    })
  }

  // Chart 2: Hourly Volume
  if (document.getElementById("chart-hour")) {
    Highcharts.chart("chart-hour", {
      chart: {
        type: "line",
        backgroundColor: "transparent",
      },
      title: {
        text: "Hourly Call Volume",
        style: { color: "#fff" },
      },
      xAxis: {
        categories: ["8AM", "9AM", "10AM", "11AM", "12PM", "1PM", "2PM", "3PM", "4PM", "5PM"],
        labels: { style: { color: "#fff" } },
      },
      yAxis: {
        title: {
          text: "Calls per Hour",
          style: { color: "#fff" },
        },
        labels: { style: { color: "#fff" } },
      },
      series: [
        {
          name: "Incoming",
          data: [45, 67, 89, 95, 120, 110, 98, 87, 76, 54],
          color: "#32CD32",
        },
        {
          name: "Outgoing",
          data: [23, 34, 45, 56, 67, 78, 65, 54, 43, 32],
          color: "#FF6347",
        },
      ],
      legend: { itemStyle: { color: "#fff" } },
    })
  }
}

// Initialize component charts
function initializeComponentCharts() {
  if (typeof Highcharts === "undefined") return

  // Volume Chart
  if (document.getElementById("volume-chart")) {
    Highcharts.chart("volume-chart", {
      chart: { type: "area", backgroundColor: "transparent" },
      title: { text: "Call Volume Trends", style: { color: "#fff" } },
      xAxis: { categories: ["Mon", "Tue", "Wed", "Thu", "Fri"], labels: { style: { color: "#fff" } } },
      yAxis: { title: { text: "Calls", style: { color: "#fff" } }, labels: { style: { color: "#fff" } } },
      series: [{ name: "Volume", data: [100, 150, 120, 180, 160], color: "#667eea" }],
      legend: { itemStyle: { color: "#fff" } },
    })
  }

  // Performance Chart
  if (document.getElementById("performance-chart")) {
    Highcharts.chart("performance-chart", {
      chart: { type: "bar", backgroundColor: "transparent" },
      title: { text: "Agent Performance", style: { color: "#fff" } },
      xAxis: { categories: ["Agent 1", "Agent 2", "Agent 3", "Agent 4"], labels: { style: { color: "#fff" } } },
      yAxis: { title: { text: "Calls Handled", style: { color: "#fff" } }, labels: { style: { color: "#fff" } } },
      series: [{ name: "Calls", data: [45, 67, 34, 89], color: "#f093fb" }],
      legend: { itemStyle: { color: "#fff" } },
    })
  }
}

// Call generator functions
function startCallGenerator() {
  console.log("Starting call generator...")
  intervalReceive = setInterval(receiveCall, 3000)
  intervalEnd = setInterval(endCalls, 60000)
}

function stopCallGenerator() {
  console.log("Stopping call generator...")
  if (intervalReceive) clearInterval(intervalReceive)
  if (intervalEnd) clearInterval(intervalEnd)
}

function receiveCall() {
  const phoneNumber = generatePhoneNumber()
  console.log("Received call from " + phoneNumber)
}

function endCalls() {
  console.log("Ending calls...")
}

function generatePhoneNumber() {
  let number = "664"
  for (let i = 0; i < 7; i++) {
    number += Math.floor(Math.random() * 10)
  }
  return number
}

// Add component styles
const componentStyles = `
    <style>
        .component-container {
            padding: 20px;
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            min-height: 100vh;
            color: white;
        }
        
        .component-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 1px solid rgba(255,255,255,0.2);
        }
        
        .component-stats {
            display: flex;
            gap: 20px;
        }
        
        .stat {
            background: rgba(255,255,255,0.1);
            padding: 8px 15px;
            border-radius: 5px;
            backdrop-filter: blur(10px);
        }
        
        .agents-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 20px;
        }
        
        .agent-card {
            background: rgba(255,255,255,0.1);
            backdrop-filter: blur(10px);
            border-radius: 10px;
            padding: 20px;
            display: flex;
            align-items: center;
            gap: 15px;
            border: 1px solid rgba(255,255,255,0.2);
        }
        
        .agent-card.available {
            border-left: 4px solid #32CD32;
        }
        
        .agent-card.busy {
            border-left: 4px solid #FF6347;
        }
        
        .agent-avatar {
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
        }
        
        .agent-info h4 {
            margin: 0 0 5px 0;
        }
        
        .agent-status {
            margin: 0;
            text-transform: capitalize;
            opacity: 0.8;
        }
        
        .agent-calls {
            margin: 0;
            font-size: 0.9rem;
            opacity: 0.7;
        }
        
        .calls-list {
            background: rgba(255,255,255,0.1);
            backdrop-filter: blur(10px);
            border-radius: 10px;
            padding: 20px;
        }
        
        .call-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 0;
            border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        
        .call-item:last-child {
            border-bottom: none;
        }
        
        .call-info {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }
        
        .call-number {
            font-weight: bold;
        }
        
        .call-agent {
            opacity: 0.7;
            font-size: 0.9rem;
        }
        
        .call-duration {
            font-size: 1.1rem;
            font-weight: bold;
        }
        
        .call-status {
            background: #32CD32;
            padding: 5px 10px;
            border-radius: 15px;
            font-size: 0.8rem;
        }
        
        .charts-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: 20px;
        }
        
        .chart-card {
            background: rgba(255,255,255,0.1);
            backdrop-filter: blur(10px);
            border-radius: 10px;
            padding: 20px;
            border: 1px solid rgba(255,255,255,0.2);
        }
        
        .chart-card h3 {
            margin: 0 0 15px 0;
        }
        
        .reports-grid, .analytics-metrics, .queue-stats, .layout-options, .settings-sections {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
        }
        
        .report-card, .metric-card, .queue-card, .layout-card, .settings-card {
            background: rgba(255,255,255,0.1);
            backdrop-filter: blur(10px);
            border-radius: 10px;
            padding: 25px;
            border: 1px solid rgba(255,255,255,0.2);
        }
        
        .metric-value, .queue-number, .queue-time {
            font-size: 2.5rem;
            font-weight: bold;
            margin-top: 10px;
        }
        
        .map-placeholder {
            background: rgba(255,255,255,0.1);
            backdrop-filter: blur(10px);
            border-radius: 10px;
            padding: 100px;
            text-align: center;
            border: 1px solid rgba(255,255,255,0.2);
        }
    </style>
`

// Add styles to head
document.head.insertAdjacentHTML("beforeend", componentStyles)
