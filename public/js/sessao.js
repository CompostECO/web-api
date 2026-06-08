// sessão
function validarSessao() {
    var email = sessionStorage.EMAIL_USUARIO;

    // var b_usuario = document.getElementById("b_usuario");

    if (email.includes("@composteco.com.br")) {
        window.location = "../../painel-adm/index.html";
    }
    else {
        window.location = "../../login/index.html";
    }
}

function limparSessao() {
    sessionStorage.clear();
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

validarSessao()