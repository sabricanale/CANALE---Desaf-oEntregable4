let estudiantes = [];
let formulario = document.getElementById("formulario");
let nombreEstudiante = document.getElementById("nombreEstudiante")
let inputNota1 = document.getElementById("inputNota1")
let inputNota2 = document.getElementById("inputNota2")
let inputNota3 = document.getElementById("inputNota3")
let tabla = document.getElementById("tablaProductos")
let btnMostrarAlert = document.getElementById("mostrarAlert")

class Estudiante {
    constructor(nombre, nota1, nota2, nota3){
        this.nombre = nombre;
        this.nota1 = nota1;
        this.nota2 = nota2;
        this.nota3 = nota3;
        this.promedio = (nota1 + nota2 + nota3) / 3;
        this.resultado;
        this.calcularResultado();
    }
    calcularResultado() {
        this.resultado = this.promedio >= 6 ? "APROBÓ" : "NO APROBÓ"; 
    }
}

// ENVIO DE MAILS
const botonEnviarLista = document.getElementById("enviarLista");
botonEnviarLista.addEventListener("click", () => {
    enviarCorreoConLista();
})

function enviarCorreoConLista() {

    const serviceID = 'service_9hhchxf';
    const templateID = 'template_bsey3b6';
    let dataToSend = localStorage.getItem("listaEstudiantes");
    const data = {
        service_id: serviceID,
        template_id: templateID,
        user_id: 'i6dRkNBsCRNCyTSh1',
        template_params: {
            'estudiantes': dataToSend
        },
        accessToken: 'a0AT2KfCmQFtn3om5t_8q'
    }
    console.log(data);

    $.ajax('https://api.emailjs.com/api/v1.0/email/send', {
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json'
    }).done(function() {
        Swal.fire({title: `La lista fue enviada a su correo`})
    }).fail(function(error) {
        alert('Error' + JSON.stringify(error));
    });
}

function actualizarTabla() {
    while(tabla.rows.length > 1){
        tabla.deleteRow(1)
    }
    agregarEstudiantesTabla();
    renovarLocalStorage();
}
function agregarEstudiantesTabla(){
    estudiantes.forEach((estudiante) => {let filaTabla = document.createElement("tr")
        filaTabla.innerHTML = `
        <td>${estudiante.nombre}</td>
        <td>${estudiante.nota1}</td>
        <td>${estudiante.nota2}</td>
        <td>${estudiante.nota3}</td>
        <td>${estudiante.promedio}</td>
        <td>${estudiante.resultado}</td>
        ` 
        tabla.tBodies[0].append(filaTabla)
    });
}

formulario.addEventListener('submit', (event) => {
    event.preventDefault();
    let formularioValidado = validarFormulario();
    if(formularioValidado) {
        let estudiante = new Estudiante(
            nombreEstudiante.value, 
            parseFloat(document.getElementById("inputNota1").value),
            parseFloat(document.getElementById("inputNota2").value),
            parseFloat(document.getElementById("inputNota3").value)
        )
        estudiantes.push(estudiante);
        actualizarTabla();
        formulario.reset();
    }
})

function validarFormulario(){
    let nombre = nombreEstudiante.value;
    if(nombre == "") {
        Swal.fire({title: `No ingresaste nombre`});
        return false;
    }
    let nota1 = parseFloat(document.getElementById("inputNota1").value);
    if(isNaN(nota1) || nota1 > 10 || nota1 < 0){
        Swal.fire({title: `Error al ingresar la primera nota`});
        return false;
    }
    let nota2 = parseFloat(document.getElementById("inputNota2").value);
    if(isNaN(nota2) || nota2 > 10 || nota2 < 0){
        Swal.fire({title: `Error al ingresar la segunda nota`});
        return false;
    }
    let nota3 = parseFloat(document.getElementById("inputNota3").value);
    if(isNaN(nota3) || nota3 > 10 || nota3 < 0){
        Swal.fire({title: `Error al ingresar la tercera nota`});
        return false;
    }
    return true;    
}

function renovarLocalStorage(){
    localStorage.removeItem("listaEstudiantes");
    localStorage.setItem("listaEstudiantes", JSON.stringify(estudiantes));
}

function obtenerProductosLocalStorage(){
    let estudiantesRegistrados = localStorage.getItem("listaEstudiantes")
    estudiantesRegistrados !== null ? estudiantes = JSON.parse(estudiantesRegistrados) : console.log("No hay información registrada")
}

function mostrarAlert(){
    Swal.fire({
        icon: 'success', 
        text: 'Estudiante ingresado correctamente',
    })
}

function main (){    
    obtenerProductosLocalStorage()
    agregarEstudiantesTabla()
}
main()

