let alerts  = []
let globalHref
async function getAlerts (pageHref) {
  if (typeof pageHref === "string")
    globalHref = pageHref
  if (alerts.length === 0)  {
    alerts = await fetch(`/alertas/listar-produtor/${sessionStorage.ID_USUARIO}`)
    .then(res => res.json())
    .catch(err => console.error(err))
  }
  else {
    const newAlerts = await fetch(`/alertas/listar-produtor/${sessionStorage.ID_USUARIO}`)
    .then(res => res.json()).
    catch(err => console.error(err)) 

    if (JSON.stringify(alerts[0]) !== JSON.stringify(newAlerts[0]))
      showAlert(newAlerts[0])

    alerts = newAlerts.map(a => a)
  }
  
  setTimeout(() => getAlerts(), 1000)
}

function showAlert (alert) {
  const { modelo, alerta_id, composteira_id, enviado_em, prioridade, tipo } = alert

  const container = document.getElementById("alertsContainer2")
  const date = new Date(enviado_em)

  const hrefSplitted = globalHref.split('/')
  console.log(hrefSplitted[4])

  const dir = 
    ["alertas", "codigos", "suporte"].includes(hrefSplitted[4]) 
    ? "../composteira/"
    : hrefSplitted[4].includes("index.html") 
    ? "./composteira/"
    : "./"
  
  container.innerHTML += `
    <div class='alert' id='alert-${alerta_id}' onclick="window.location.href='${dir}index.html?composteira=${composteira_id}'">
      <i class='ph-bold ph-${priorities2[prioridade].icon} color-${priorities2[prioridade].class}'></i><p class="alert-title">Foi detectado <span class='color-${priorities2[prioridade].class}'>${tipo.toLowerCase()}</span> com prioridade <span class='color-${priorities2[prioridade].class}'>${priorities2[prioridade].word}</span> na composteira ${modelo} às <span>${date.getHours() < 10 ? "0" : ""}${date.getHours()}:${date.getMinutes() < 10 ? "0" : ""}${date.getMinutes()}</span>.</p>
    </div>
  `

  setTimeout(() => hideAlert(alerta_id), 20000)
}

function hideAlert (id) {
  const element = document.getElementById(`alert-${id}`)

  element.classList.add("hidden")
}

const priorities2 = {
  0: {
    class: "normal",
    word: "normal",
    icon: "info",
    temperature: "dentro da faixa ideal",
    humidity: "dentro da faixa ideal",
    stableIndex: ", ",
    healthIndex: "condições ideais"
  },
  1: {
    class: "moderate",
    word: "moderada",
    icon: "warning-diamond",
    temperature: "levemente fora da faixa ideal",
    humidity: "levemente fora da faixa ideal",
    stableIndex: ", ",
    healthIndex: "sem risco eminente"
  },
  2: {
    class: "danger",
    word: "alta",
    icon: "warning",
    temperature: "fora da faixa ideal",
    humidity: "fora da faixa ideal",
    stableIndex: " apenas ",
    healthIndex: "risco elevado"
  },
  3: {
    class: "urgent",
    word: "urgênte",
    icon: "warning-octagon",
    temperature: "totalmente fora da faixa ideal",
    humidity: "totalmente fora da faixa ideal",
    stableIndex: " apenas ",
    healthIndex: "risco crítico"
  },
}