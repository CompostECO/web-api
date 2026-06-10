let showInfo = false

function toggleShowInfo() {
  const infoCard = document.getElementById('infoCard')
  showInfo = !showInfo
  infoCard.style.display = showInfo ? 'flex' : 'none'
}


//Função tirada do seguinte link https://stackoverflow.com/questions/19700283/how-can-i-convert-time-in-milliseconds-to-hours-min-sec-format-in-javascript
// O usuário apresentava dificuldades para converter milisegundo em tempo, mesma que a minha, então para poupar tempo eu decidi apena copiar e colar a solução proposta por outro usuário
//Ela tem algumas modificações
function msToTime(ms) {
  let seconds = (ms / 1000).toFixed(0);
  let minutes = (ms / (1000 * 60)).toFixed(0);
  let hours = (ms / (1000 * 60 * 60)).toFixed(0);
  let days = (ms / (1000 * 60 * 60 * 24)).toFixed(0);
  if (seconds < 60) return seconds + " Segundo" + (seconds > 1 ? "s" : "");
  else if (minutes < 60) return minutes + " Minuto" + (minutes > 1 ? "s" : "");
  else if (hours < 24) return hours + " Hora" + (hours > 1 ? "s" : "")
  else return days + " Dia" + (days > 1 ? "s" : "")
}

async function getComposters() {
  let dado = await fetch(`/composteira/pegarTodas/${sessionStorage.ID_USUARIO}`).then(res => res.json()).catch(erro => console.log(erro))
  return dado;
}


function loadCompostersSidebar(composters) {
  const composterContainerElement = document.getElementById("composterContainer")

  composterContainerElement.innerHTML = ""
  composters.forEach(composter => {
    composterContainerElement.innerHTML += `
      <div class="item" onclick="window.location.href='../composteira/index.html?composteira=${composter.id}'" id='${composter.id}'>
        <i class="ph ph-cube icon"></i>
        <p>${composter.nome}</p>
      </div>
    `
  })
}

const priorities = {
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

function callGetAlertsFromProdutor() {
  fetch(`/alertas/listar-produtor/${sessionStorage.ID_USUARIO}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  }).then((res) => {
    res.json().then((response) => {
      let html = ""

      for (let i = 0; i < response.length; i++) {
        let dataEnviado = new Date(response[i].enviado_em);
        let dataAtual = new Date();
        let diferencaMili = Math.abs(dataAtual.getTime() - dataEnviado.getTime())
        let tempo = msToTime(diferencaMili)

        html += ` 
          <div class="alert ${priorities[response[i].prioridade].class}" onclick="window.location.href='../composteira/index.html?composteira=${response[i].composteira_id}'">
            <div class="heading">
            <i class="ph-bold ph-${priorities[response[i].prioridade].icon} icon"></i>
            <h1 class="title"><strong>${response[i].tipo[0].toUpperCase() + response[i].tipo.substring(1)}</strong> na composteira ${response[i].modelo}</h1>
            <p class="date">${tempo} atrás</p>
          </div>
          <p class="desc">
              ${response[i].descricao}
          </p>
        </div>`
      }
      
      alertaSection.innerHTML = html
    })


  }).catch((erro) => {
    console.log(erro)
  })
}

async function loadAlerts() {
  callGetAlertsFromProdutor()
  const composteiras = await getComposters();
  loadCompostersSidebar(composteiras)
  adicionarNomeEmpresa()

  setTimeout(() => loadAlerts(), 2000)
}
