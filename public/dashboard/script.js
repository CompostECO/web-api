const limitParameters = {
  temperature: {
    min: 0,
    max: 45,
  },
  humidity: {
    min: 0,
    max: 100
  }
}

// fonte: https://stackoverflow.com/questions/74935293/chartjs-updating-values-in-beforedraw
const temperatureBackgroundZonesPlugin = {
  id: 'temperatureBackgroundZones',
  beforeDraw: (chart) => {
    const { ctx, chartArea, scales } = chart
    const yScale = scales.y

    const { left, right } = chartArea

    ctx.fillStyle = 'rgba(255, 0, 0, 0.08)'
    ctx.fillRect(
      left,
      yScale.getPixelForValue(30), 
      right - left,
      yScale.getPixelForValue(limitParameters.temperature.max) - yScale.getPixelForValue(30)
    )

    ctx.fillStyle = 'rgba(255, 255, 0, 0.08)'
    ctx.fillRect(
      left,
      yScale.getPixelForValue(15),
      right - left,
      yScale.getPixelForValue(20) - yScale.getPixelForValue(15)
    )

    ctx.fillStyle = 'rgba(0, 255, 0, 0.08)'
    ctx.fillRect(
      left,
      yScale.getPixelForValue(20),
      right - left,
      yScale.getPixelForValue(25) - yScale.getPixelForValue(20)
    )

    ctx.fillStyle = 'rgba(255, 255, 0, 0.08)'
    ctx.fillRect(
      left,
      yScale.getPixelForValue(25),
      right - left,
      yScale.getPixelForValue(30) - yScale.getPixelForValue(25)
    )

    ctx.fillStyle = 'rgba(255, 0, 0, 0.08)'
    ctx.fillRect(
      left,
      yScale.getPixelForValue(limitParameters.temperature.min), 
      right - left,
      yScale.getPixelForValue(15) - yScale.getPixelForValue(limitParameters.temperature.min)
    )
  }
}

const humidityBackgroundZonesPlugin = {
  id: 'humidityBackgroundZones',
  beforeDraw: (chart) => {
    const { ctx, chartArea, scales } = chart
    const yScale = scales.y

    const { left, right } = chartArea

    ctx.save()

    ctx.fillStyle = 'rgba(255, 0, 0, 0.08)'
    ctx.fillRect(
      left,
      yScale.getPixelForValue(90), 
      right - left,
      yScale.getPixelForValue(limitParameters.humidity.max) - yScale.getPixelForValue(90)
    )

    ctx.fillStyle = 'rgba(255, 255, 0, 0.08)'
    ctx.fillRect(
      left,
      yScale.getPixelForValue(85),
      right - left,
      yScale.getPixelForValue(90) - yScale.getPixelForValue(85)
    )

    ctx.fillStyle = 'rgba(0, 255, 0, 0.08)'
    ctx.fillRect(
      left,
      yScale.getPixelForValue(70),
      right - left,
      yScale.getPixelForValue(85) - yScale.getPixelForValue(70)
    )

    ctx.fillStyle = 'rgba(255, 255, 0, 0.08)'
    ctx.fillRect(
      left,
      yScale.getPixelForValue(60),
      right - left,
      yScale.getPixelForValue(70) - yScale.getPixelForValue(60)
    )

    ctx.fillStyle = 'rgba(255, 0, 0, 0.08)'
    ctx.fillRect(
      left,
      yScale.getPixelForValue(limitParameters.temperature.min), 
      right - left,
      yScale.getPixelForValue(60) - yScale.getPixelForValue(limitParameters.humidity.min)
    )

    ctx.restore()
  }
}

let showInfo = false
function toggleShowInfo() {
  const infoCard = document.getElementById('infoCard')
  showInfo = !showInfo
  infoCard.style.display = showInfo ? 'flex' : 'none'
}

async function getKpis() {
  let dado = await fetch(`/grafico/mostrarDados/${sessionStorage.ID_USUARIO}`).then(res => res.json()).catch(erro => console.error(erro))
  return dado;
} 

async function pegarTodasComposteiras(){
  let dado = await fetch(`/composteira/pegarTodas/${sessionStorage.ID_USUARIO}`).then(res => res.json()).catch(erro => console.error(erro))
  return dado;
}

let tempChart, humChart, composteirasGlobal
async function loadCharts () {
  const dados = await getKpis()
  const composteirasDados = await pegarTodasComposteiras()
  const { kpis, composteiras } = dados
  composteirasGlobal = composteiras

  loadCompostersSidebar(composteirasDados)
  loadCompostersSummary(composteiras)
  adicionarNomeEmpresa()
  loadKPIs(kpis)
  loadButtons(composteiras)
  drawCharts(composteiras)

  setTimeout(() => loadCharts(), 5000)
}

const priorities = {
  0: {
    class: "normal",
    stableIndex: ", ",
  },
  1: {
    class: "moderate",
    stableIndex: ", ",
  },
  2: {
    class: "danger",
    stableIndex: " apenas ",
  },
  3: {
    class: "urgent",
    stableIndex: " apenas ",
  },
}

async function loadKPIs (kpis) {
  const activeValueElement = document.getElementById("activeValue")
  const alertValueElement = document.getElementById("alertValue")
  const stableValueElement = document.getElementById("stableValue")

  const activeDescElement = document.getElementById("activeDescription")
  const alertDescElement = document.getElementById("alertDescription")
  const stableDescElement = document.getElementById("stableDescription")

  const {
    qntComposteira,
    qntComposteirasAlerta,
    taxaEstabilidade
  } = kpis

  const totalComposters = (await pegarTodasComposteiras()).length
  activeValueElement.innerHTML = `<span>${qntComposteira}</span>`
  alertValueElement.innerHTML = `<span class='${getStatus("active", (100 - (qntComposteirasAlerta / qntComposteira * 100))).class}'>${qntComposteirasAlerta}</span>`
  stableValueElement.innerHTML =`<span class='${getStatus("active", taxaEstabilidade).class}'>${taxaEstabilidade}%</span>`

  activeDescElement.innerHTML = `<p class="desc" id="activeDescription">De ${totalComposters} caixa(s) de vermicompostagem, ${qntComposteira} está(ão) sendo monitorada(s).</p>`
  
  alertDescElement.innerHTML = `<p class="desc " id="alertDescription">De ${totalComposters} composteira(s) ativa(s), ${qntComposteirasAlerta} está(ão) <span class="${getStatus("active", (100 - (qntComposteirasAlerta / qntComposteira * 100))).class}">fora</span> das condições ideais.</p>`

  stableDescElement.innerHTML = `<p class="desc " id="stableDescription">Suas composteiras passam <span class="${getStatus("active", taxaEstabilidade).class}">${(100 - taxaEstabilidade)}% do tempo fora</span> das condições ideais.</p>`
}

function getStatus (parameter, data) {
  if ((parameter === "active") && (Number(data) >= 90))
    return priorities[0]
  if ((parameter === "active") && (Number(data) >= 60))
    return priorities[1]
  if ((parameter === "active") && (Number(data) >= 50))
    return priorities[2]
  if (parameter === "active")
    return priorities[3]
}

function loadCompostersSidebar (composters) {
  const composterContainerElement = document.getElementById("composterContainer")

  composterContainerElement.innerHTML = ""
  composters.forEach(composter => {
    composterContainerElement.innerHTML += `
      <div class="item" onclick="window.location.href='composteira/index.html?composteira=${composter.id}'" id='${composter.id}'>
        <i class="ph ph-cube icon"></i>
        <p>${composter.nome}</p>
      </div>
    `
  })
}

function loadCompostersSummary (composters) {
  const summaryComponent = document.getElementById("composterSummary")

  let html = `
    <div class="composter composter-title">
      <p>Composteira</p>
      <p>Temperatura</p>
      <p>Umidade</p>
      <p>Estado</p>
      <p>Última detecção</p>
    </div>
  `
  composters.forEach(composter => {
    const { temperatura, umidade, estado, hora } = composter.dados.ultimaDeteccao
    html += `
      <div class="composter" id="${composter.id}" onclick="window.location.href='composteira/index.html?composteira=${composter.id}'">
        <p class="${estado.replace(" ", "-").toLowerCase()}">${composter.nome}</p>
        <p>${temperatura}°C</p>
        <p>${umidade}%</p>
        <p>${estado}</p>
        <p>${hora}</p>
      </div>
    `
  })

  summaryComponent.innerHTML = html
}

function loadButtons(composters) {
  const containerElement = document.getElementById("composterFilters")
  console.log(composters)

  let html = ""

  const ls = localStorage.getItem("composterFilter").split(" ")
  console.log(ls)
  composters.forEach((composter, i) => {
    html += `
      <button class="button-primary-dark ${ls.includes(composter.id + '') ? "" : " less"}" id='btn-${composter.id}' onclick="clickButtons('btn-${composter.id}')">${composter.nome}</button>
    `
  })

  containerElement.innerHTML = html
}

function clickButtons (btnId) {
  const id = btnId.split('-')[1]

  const button = document.getElementById(btnId)

  const ls = localStorage.getItem("composterFilter")
  if (button.classList.contains("less")) {
    localStorage.setItem("composterFilter", `${ls} ${id}`)
    button.classList.remove("less")
  } else {
    localStorage.setItem("composterFilter", `${ls.replace(id, "")}`)
    button.classList.add("less")
  }

  drawCharts()
}

function drawCharts () {
  if(!localStorage.getItem("composterFilter")) 
    localStorage.setItem("composterFilter", composteirasGlobal[0].id)

  const ids = localStorage.getItem("composterFilter").split(" ")

  if (tempChart) 
    tempChart.destroy()

  if (humChart) 
    humChart.destroy()

  tempChart = new Chart(document.getElementById('chartTemperature'), {
    type: 'line',

    data: {
      labels: composteirasGlobal[0].dados.hora.map(hora => hora + "h"),

      datasets: composteirasGlobal
      .filter(composteira => ids.includes(composteira.id + ''))
      .map((composteira) => ({
        label: composteira.nome,
        data: composteira.dados.temperatura,
        tension: 0.4,
      }))
    },

    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Temperatura das Composteiras',
          align: 'start',
          color: '#0C0C09',
          font: {
            size: 16,
            padding: 12,
            family: '"Poppins", sans-serif'
          }
        },
        // legend: {
        //   display: false,
        //   labels: {
        //     display: false
        //   }
        // }
      },

      scales: {
        y: {
          min: 0,
          max: 45,
          title: {
            display: true,
            text: 'Temperatura (°C)',
          }
        }
      }
    },
    plugins: [temperatureBackgroundZonesPlugin]
  })

  humChart = new Chart(document.getElementById('chartHumidity'), {
    type: 'line',

    data: {
      labels: composteirasGlobal[0].dados.hora.map(hora => hora + "h"),

      datasets: composteirasGlobal
      .filter(composteira => ids.includes(composteira.id + ''))
      .map((composteira) => ({
        label: composteira.nome,
        data: composteira.dados.umidade,
        tension: 0.4,
      }))
    },

    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Umidade das Composteiras',
          align: 'start',
          color: '#0C0C09',
          font: {
            size: 16,
            padding: 12,
            family: '"Poppins", sans-serif'
          }
        },
        // legend: {
        //   display: false,
        //   labels: {
        //     display: false
        //   }
        // }
      },

      scales: {
        y: {
          min: 0,
          max: 100,
          title: {
            display: true,
            text: 'Umidade (%)'
          }
        }
      }
    },
    plugins: [humidityBackgroundZonesPlugin]
  })
}