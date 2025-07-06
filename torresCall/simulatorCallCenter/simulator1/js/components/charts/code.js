class ChartsComponent {
  constructor() {
    this.charts = {}
    this.initializeCharts()
    this.setupEventListeners()
  }

  initializeCharts() {
    // Initialize all charts
    this.createCallVolumeChart()
    this.createAgentPerformanceChart()
    this.createCallDurationChart()
    this.createQueueChart()
  }

  setupEventListeners() {
    const timeSelector = document.getElementById("timeRange")
    if (timeSelector) {
      timeSelector.addEventListener("change", (e) => {
        this.updateChartsData(e.target.value)
      })
    }
  }

  createCallVolumeChart() {
    const canvas = document.getElementById("callVolumeChart")
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    const data = this.generateCallVolumeData()

    this.drawLineChart(ctx, data, {
      title: "Call Volume Trends",
      colors: ["#40E0D0", "#32CD32"],
      labels: ["Incoming", "Outgoing"],
    })
  }

  createAgentPerformanceChart() {
    const canvas = document.getElementById("agentPerformanceChart")
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    const data = this.generateAgentPerformanceData()

    this.drawBarChart(ctx, data, {
      title: "Agent Performance",
      color: "#FFD700",
    })
  }

  createCallDurationChart() {
    const canvas = document.getElementById("callDurationChart")
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    const data = this.generateCallDurationData()

    this.drawPieChart(ctx, data, {
      title: "Call Duration Distribution",
      colors: ["#FF6347", "#32CD32", "#40E0D0", "#9370DB"],
    })
  }

  createQueueChart() {
    const canvas = document.getElementById("queueChart")
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    const data = this.generateQueueData()

    this.drawAreaChart(ctx, data, {
      title: "Queue Performance",
      color: "#FF1493",
    })
  }

  generateCallVolumeData() {
    const hours = []
    const incoming = []
    const outgoing = []

    for (let i = 0; i < 24; i++) {
      hours.push(`${i}:00`)
      incoming.push(Math.floor(Math.random() * 100) + 50)
      outgoing.push(Math.floor(Math.random() * 80) + 30)
    }

    return { labels: hours, datasets: [incoming, outgoing] }
  }

  generateAgentPerformanceData() {
    const agents = ["Agent 1", "Agent 2", "Agent 3", "Agent 4", "Agent 5"]
    const performance = agents.map(() => Math.floor(Math.random() * 100) + 50)

    return { labels: agents, data: performance }
  }

  generateCallDurationData() {
    return {
      labels: ["0-2 min", "2-5 min", "5-10 min", "10+ min"],
      data: [35, 40, 20, 5],
    }
  }

  generateQueueData() {
    const times = []
    const queueLength = []

    for (let i = 0; i < 12; i++) {
      times.push(`${i * 2}:00`)
      queueLength.push(Math.floor(Math.random() * 20) + 5)
    }

    return { labels: times, data: queueLength }
  }

  drawLineChart(ctx, data, options) {
    const canvas = ctx.canvas
    const width = canvas.width
    const height = canvas.height
    const padding = 60

    ctx.clearRect(0, 0, width, height)

    // Set up chart area
    const chartWidth = width - padding * 2
    const chartHeight = height - padding * 2

    // Find max value for scaling
    const maxValue = Math.max(...data.datasets.flat())

    // Draw grid
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)"
    ctx.lineWidth = 1

    // Vertical grid lines
    for (let i = 0; i <= 10; i++) {
      const x = padding + (chartWidth / 10) * i
      ctx.beginPath()
      ctx.moveTo(x, padding)
      ctx.lineTo(x, height - padding)
      ctx.stroke()
    }

    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(width - padding, y)
      ctx.stroke()
    }

    // Draw datasets
    data.datasets.forEach((dataset, index) => {
      ctx.strokeStyle = options.colors[index]
      ctx.fillStyle = options.colors[index] + "20"
      ctx.lineWidth = 3

      ctx.beginPath()
      dataset.forEach((value, i) => {
        const x = padding + (chartWidth / (dataset.length - 1)) * i
        const y = height - padding - (value / maxValue) * chartHeight

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })
      ctx.stroke()

      // Fill area under line
      ctx.lineTo(width - padding, height - padding)
      ctx.lineTo(padding, height - padding)
      ctx.closePath()
      ctx.fill()
    })

    // Draw axes labels
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
    ctx.font = "12px Arial"
    ctx.textAlign = "center"

    // X-axis labels (show every 4th hour)
    for (let i = 0; i < data.labels.length; i += 4) {
      const x = padding + (chartWidth / (data.labels.length - 1)) * i
      ctx.fillText(data.labels[i], x, height - padding + 20)
    }
  }

  drawBarChart(ctx, data, options) {
    const canvas = ctx.canvas
    const width = canvas.width
    const height = canvas.height
    const padding = 60

    ctx.clearRect(0, 0, width, height)

    const chartWidth = width - padding * 2
    const chartHeight = height - padding * 2
    const barWidth = (chartWidth / data.labels.length) * 0.8
    const maxValue = Math.max(...data.data)

    // Draw bars
    data.data.forEach((value, index) => {
      const barHeight = (value / maxValue) * chartHeight
      const x = padding + (chartWidth / data.labels.length) * index + (chartWidth / data.labels.length - barWidth) / 2
      const y = height - padding - barHeight

      // Create gradient
      const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight)
      gradient.addColorStop(0, options.color)
      gradient.addColorStop(1, options.color + "80")

      ctx.fillStyle = gradient
      ctx.fillRect(x, y, barWidth, barHeight)

      // Draw value on top of bar
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
      ctx.font = "12px Arial"
      ctx.textAlign = "center"
      ctx.fillText(value.toString(), x + barWidth / 2, y - 5)
    })

    // Draw labels
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
    ctx.font = "11px Arial"
    data.labels.forEach((label, index) => {
      const x = padding + (chartWidth / data.labels.length) * index + chartWidth / data.labels.length / 2
      ctx.fillText(label, x, height - padding + 20)
    })
  }

  drawPieChart(ctx, data, options) {
    const canvas = ctx.canvas
    const width = canvas.width
    const height = canvas.height
    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(width, height) / 3

    ctx.clearRect(0, 0, width, height)

    const total = data.data.reduce((sum, value) => sum + value, 0)
    let currentAngle = -Math.PI / 2

    data.data.forEach((value, index) => {
      const sliceAngle = (value / total) * 2 * Math.PI

      // Draw slice
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle)
      ctx.closePath()

      ctx.fillStyle = options.colors[index]
      ctx.fill()

      // Draw label
      const labelAngle = currentAngle + sliceAngle / 2
      const labelX = centerX + Math.cos(labelAngle) * (radius + 30)
      const labelY = centerY + Math.sin(labelAngle) * (radius + 30)

      ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
      ctx.font = "12px Arial"
      ctx.textAlign = "center"
      ctx.fillText(`${data.labels[index]} (${value}%)`, labelX, labelY)

      currentAngle += sliceAngle
    })
  }

  drawAreaChart(ctx, data, options) {
    const canvas = ctx.canvas
    const width = canvas.width
    const height = canvas.height
    const padding = 60

    ctx.clearRect(0, 0, width, height)

    const chartWidth = width - padding * 2
    const chartHeight = height - padding * 2
    const maxValue = Math.max(...data.data)

    // Create gradient
    const gradient = ctx.createLinearGradient(0, padding, 0, height - padding)
    gradient.addColorStop(0, options.color + "80")
    gradient.addColorStop(1, options.color + "20")

    // Draw area
    ctx.beginPath()
    ctx.moveTo(padding, height - padding)

    data.data.forEach((value, index) => {
      const x = padding + (chartWidth / (data.data.length - 1)) * index
      const y = height - padding - (value / maxValue) * chartHeight
      ctx.lineTo(x, y)
    })

    ctx.lineTo(width - padding, height - padding)
    ctx.closePath()

    ctx.fillStyle = gradient
    ctx.fill()

    // Draw line
    ctx.beginPath()
    data.data.forEach((value, index) => {
      const x = padding + (chartWidth / (data.data.length - 1)) * index
      const y = height - padding - (value / maxValue) * chartHeight

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.strokeStyle = options.color
    ctx.lineWidth = 3
    ctx.stroke()

    // Draw points
    data.data.forEach((value, index) => {
      const x = padding + (chartWidth / (data.data.length - 1)) * index
      const y = height - padding - (value / maxValue) * chartHeight

      ctx.beginPath()
      ctx.arc(x, y, 4, 0, 2 * Math.PI)
      ctx.fillStyle = options.color
      ctx.fill()
    })

    // Draw labels
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
    ctx.font = "11px Arial"
    ctx.textAlign = "center"

    data.labels.forEach((label, index) => {
      const x = padding + (chartWidth / (data.labels.length - 1)) * index
      ctx.fillText(label, x, height - padding + 20)
    })
  }

  updateChartsData(timeRange) {
    console.log(`Updating charts for time range: ${timeRange}`)
    // Regenerate data based on time range and redraw charts
    this.initializeCharts()
  }
}

// Initialize charts when component loads
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("callVolumeChart")) {
    new ChartsComponent()
  }
})
