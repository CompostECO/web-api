// sessão
function validarSessao() {
  const email = sessionStorage.getItem("EMAIL_USUARIO")
  const nome  = sessionStorage.getItem("NOME_USUARIO")

  if (!email || !nome) {
    if (!window.location.href.includes("login")) {
      window.location.href = "../../login/index.html"
    }
    return
  }

  if (
    email.includes("@composteco.com.br") &&
    !window.location.href.includes("painel-adm")
  ) {
    window.location.href = "../../painel-adm/index.html"
    return
  }
}

function limparSessao() {
    sessionStorage.clear()
    window.location = "../../../index.html";
}

// carregamento (loading)
function aguardar() {
    var divAguardar = document.getElementById("div_aguardar");
    divAguardar.style.display = "flex";
}

function finalizarAguardar(texto) {
    var divAguardar = document.getElementById("div_aguardar");
    divAguardar.style.display = "none";

    var divErrosLogin = document.getElementById("div_erros_login");
    if (texto) {
        divErrosLogin.style.display = "flex";
        divErrosLogin.innerHTML = texto;
    }
}

async function adicionarNomeEmpresa() {
    const nomeEmpresa = await fetch(`/empresas/buscarPorUsuario/${sessionStorage.ID_USUARIO}`).then(res => res.json()).catch(erro => console.log(erro))
    const nomeUsuario = sessionStorage.NOME_USUARIO;
    const nomeArray = nomeUsuario.split(" ")

    if (nomeArray.length > 1){
        siglaNome.innerHTML = `${nomeArray[0][0]}${nomeArray[1][0]}`;
    }else if(nomeArray.length == 1){
        siglaNome.innerHTML = `${nomeArray[0][0]}${nomeArray[0][1]}`;
    }
    nomeEmpresaId.innerHTML = `${nomeEmpresa[0].nome_empresa}`;
    nomeUsuarioId.innerHTML = `${nomeUsuario}`;
    try {nomeUsuarioHome.innerHTML = `Bem vindo, ${nomeUsuario}!`}
    catch {console.log("a")}
}

validarSessao()