

let lista=document.getElementById("lista");
let btnBuscar=document.getElementById("btnBuscar");
let input=document.getElementById("inputBuscar");


fetch("https://japceibal.github.io/japflix_api/movies-data.json")
    .then(respuesta =>{
        if(!respuesta.ok){
            throw new Error('No se pudo cargar la información')
        }
        return respuesta.json();
    })
    .then(data=>{
        window.info=data;
    })
    .catch(error=>{
        console.error('Error:', error);
    });

    
btnBuscar.addEventListener("click",function(){
    if (input.value !== ""){
        lista.innerHTML="";
        let resultado=buscar(input.value.trim()); 
        console.log(resultado);//uso trim para elimiar los espacios
        resultado.forEach(element => {
            let li=document.createElement("li");
            li.classList.add("elemento");
            let title=document.createElement("h4");
            let tagline=document.createElement("p");
            title.textContent=element.title;
            tagline.textContent =element.tagline;
            li.appendChild(title);
            li.appendChild(tagline);
            li.classList.add("list-group-item");
            li.appendChild(estrellas(element));
            lista.appendChild(li);
            mostrarInfo(li,element);
        });
       
    }
});


function buscar(atributo){
    let palabra=atributo.toLowerCase();
    return window.info.filter(pelicula=>
        pelicula.title.toLowerCase().includes(palabra) ||
        pelicula.genres.join(" ").toLowerCase().includes(palabra) || //convierto el array en una cadena de string con join
        pelicula.tagline.toLowerCase().includes(palabra) ||
        pelicula.overview.toLowerCase().includes(palabra)
    )};

function estrellas(pelicula){
    let contEstrellas=document.createElement("div");
    contEstrellas.id="divEstrellas";        //asigno un id para darle estilo
    let cant=Math.round(pelicula.vote_average/2); //lo divido entre dos porque la puntuación va del 1-10 y quiero tener 5 estrellas   
    for (let i=0;i<cant;i++){
        let estrella=document.createElement("span");
        estrella.classList.add("fa", "fa-star", "checked");
        contEstrellas.appendChild(estrella);
    }

for (let i = cant; i < 5; i++) { //completo las 5 estrellas con estrellas "vacias"
        let estrella = document.createElement("span");
        estrella.classList.add("fa", "fa-star");
        contEstrellas.appendChild(estrella);
    }

    return contEstrellas;
}


function mostrarInfo(li,element){
    li.addEventListener("click",function(){
        let info=document.createElement("div");
        info.classList.add("offcanvas","offcanvas-top");
        info.innerHTML=`<div class="offcanvas-header">
                            <h5 class="offcanvas-title">${element.title}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Cerrar"></button>
                        </div>
                        <div class="offcanvas-body">
                            <p>${element.overview}</p>
                            <p><strong>Genres:</strong> ${element.genres.map(g => g.name).join(", ")}</p>
                            <div class="btn-group">
                                <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">More</button>
                                <ul class="dropdown-menu">
                                    <li><a class="dropdown-item" href="#">Year: ${element.release_date.split("-")[0]}</a></li>
                                    <li><a class="dropdown-item" href="#">Runtime: ${element.runtime}</a></li>
                                    <li><a class="dropdown-item" href="#">Busget: $${element.budget}</a></li>
                                    <li><a class="dropdown-item" href="#">Revenue: $${element.revenue}</a></li>
                                </ul>
                            </div>

                        </div>`;
        document.body.appendChild(info);
        const offcanvas = new bootstrap.Offcanvas(info);
        offcanvas.show();
}) }
