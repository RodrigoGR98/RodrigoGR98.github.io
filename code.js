let apiKey = "c89ec6adb55c00d663f144a4af18cf62";

let carregarCarrossel = () => {
  $.ajax({
    url:
      "https://api.themoviedb.org/3/movie/now_playing?api_key=c89ec6adb55c00d663f144a4af18cf62&language=pt-BR&page=1",
    type: "GET",
    success: function (resultado) {
      let filmes = [];

      while (filmes.length < 4) {
        let pos = Math.floor(Math.random() * resultado.results.length);

        if (filmes.includes(pos)) {
          continue;
        } else {
          filmes.push(pos);
        }
      }

      filmes.forEach((value, index) => {
        pegarTrailer(
          resultado.results[value].id,
          resultado.results[value].title,
          resultado.results[value].overview,
          resultado.results[value].release_date,
          resultado.results[value].vote_average,
          index == 0
        );
      });
    },
  });
};



let pegarTrailer = (id, titulo, sinopse, data, nota, active) => {
  $.ajax({
    url: `https://api.themoviedb.org/3/movie/${id}/videos?api_key=c89ec6adb55c00d663f144a4af18cf62&language=en-US`,
    type: "GET",
    success: function (resultado) {
      console.log("Antes: " + titulo);
  
      pegarInfo(
        id,
        titulo,
        sinopse,
        data,
        nota,
        resultado.results.length > 0 ? resultado.results[0].key : "",
        active
      );
    },
  });
};

let pegarInfo = (id, titulo, sinopse, data, nota, trailer, active) => {
  

  let diretor = "";
  let roteiro = "";
  let elenco = "";
  
  nota = nota / 2;

  console.log("Nota: " + nota)

  let aval = nota.toString().split(".");

  if(aval.length == 1) {
    aval[1] = 0;
  } else {
    aval[1] = aval[1].substring(0,1);
  }

  console.log("nota 2: " + aval[0] + " . " + aval[1]);

  aval[0] = parseInt(aval[0]);
  aval[1] = parseInt(aval[1]);
 
  let stars = "";

  for (let i = 0; i < aval[0]; i++) {
    stars += `<span class="fas fa-star text-dark"></span>`;
  }
  if(aval[1] >= 3 && aval[1] <=7) {
    stars += `<span class="fas fa-star-half-alt"></span>`;
  }
  if(aval[1] >= 8) {
    stars += `<span class="fas fa-star text-dark"></span>`;
  }
  if(aval[1] <= 3) {
    stars += `<span class="far fa-star"></span>`;
  }
  if(aval[0] < 4){
    let calc = 4 - aval[0];
    for(let i = 0; i < calc; i++)
    stars += `<span class="far fa-star"></span>`;
  }
  
  
  $.ajax({
    url: `https://api.themoviedb.org/3/movie/${id}/credits?api_key=c89ec6adb55c00d663f144a4af18cf62&language=en-US`,
    type: "GET",
    success: function (resultado) {
      console.log("Pos: " + id);
      resultado.crew.forEach((value) => {
        if (value.job === "Director") {
          diretor = value.name;
        }
        if (value.job === "Writer" || value.job === "Story" || value.job === "Script") {
          roteiro = value.name;
        }
      });

      for (let i = 0; i < 3; i++) {
        elenco += resultado.cast[i].name + ", ";
      }

      elenco = elenco.substring(0, elenco.length - 2);

      data = data.substring(0, 4);

      let htmlcont;

      

      htmlcont = `<div class="carousel-item ${active ? "active" : ""}">

        <div class="row">
          <div class="col-12 col-sm-12 col-md-12 col-lg-6 car-sec">
            <iframe class="video-car" src="https://www.youtube.com/embed/${trailer}" frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen></iframe>
          </div>

          <div class="col-12 col-sm-12 col-md-12 col-lg-6 car-sec">
            <h4>${titulo}</h4>
            <div>
              <p><strong>Sinopse:</strong> ${sinopse}
              </p>
            </div>

            <div class="row">
              <div class="col-xs-12 col-md-6 col-lg-4">
                <p><strong>Diretor:</strong> ${diretor}</p>
              </div>
              <div class="col-xs-12 col-md-6 col-lg-4">
                <p><strong>Roteiro:</strong> ${roteiro}</p>
              </div>
              <div class="col-xs-12 col-md-6 col-lg-4">
                <p><strong>Estreia:</strong> ${data}</p>
              </div>
            </div>

            <div>
              <p><strong>Elenco:</strong> ${elenco}</p>
            </div>

            <div>
              <p class="><strong class=">Avaliação:</strong>
                ${stars}</p>
            </div>
          </div>
        </div>
      </div>`;
      //cont++;
      $("#carousel").append(htmlcont);
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      console.log("oi");
      alert("Status: " + textStatus);
      alert("Error: " + errorThrown);
    },
  });
};

carregarCarrossel();

let carregarDestaques = () => {
  $.ajax({
    url:
      "https://api.themoviedb.org/3/movie/popular?api_key=c89ec6adb55c00d663f144a4af18cf62&language=pt-BR&page=1",
    type: "GET",
    success: function (resultado) {
      let filmes = [];

      while (filmes.length < 4) {
        let pos = Math.floor(Math.random() * resultado.results.length);

        if (filmes.includes(pos)) {
          continue;
        } else {
          filmes.push(pos);
        }
      }


      filmes.forEach((value, index) => {
        
        var pars = new URLSearchParams();
        pars.append("movie",resultado.results[value].id);
        var urlx = "./movie.html?" + pars.toString();

        let htmlcont = `<div class="col-12 col-sm-6 col-md-6 col-lg-3">
                  <div id ="" class="card">
                  <a href="${urlx}"><img src="https://image.tmdb.org/t/p/w500/${resultado.results[value].poster_path}" class="card-img-top h-100" alt="..."></a>
                    <div class="card-body">
                      <h5 class="card-title">${resultado.results[value].title}</h5>
                    </div>
                  </div>
                </div>`;
        $("#cards").append(htmlcont);
      });
    },
  });
};

carregarDestaques();

$("#load-movies").click(function () {
  carregarDestaques();
  $("#load-movies").prop("disabled", true);
});

onload = () => {
  $("#search-site").on("keypress", function (e) {
    if (e.which === 13) {
      $(this).attr("disabled", "disabled");

      if ($("#search-site").val() != "") {
        var params = new URLSearchParams();
        params.append("filme", $("#search-site").val());

        var url = "./search.html?" + params;

        window.location.href = url;

        $("#search-site").val("");
      }
      $(this).removeAttr("disabled");
    }
  });

  let pegarDiretor = (id, poster, titulo, sinopse, data) => {
    let diretor;
    let elenco = "";
    $.ajax({
      url: `https://api.themoviedb.org/3/movie/${id}/credits?api_key=c89ec6adb55c00d663f144a4af18cf62&language=en-US`,
      type: "GET",
      success: function (resultado) {
        resultado.crew.forEach((value) => {
          if (value.job === "Director") {
            diretor = value.name;
          }
        });

        for (let i = 0; i < 3; i++) {
          elenco += resultado.cast[i].name + ", ";
        }

        elenco = elenco.substring(0, elenco.length - 2);

        for (let i = 320; i < sinopse.length; i++) {
          if (sinopse[i] == ".") {
            sinopse = sinopse.substring(0, i + 1);
          }
        }

        data = data.substring(0, 4);

        console.log(poster);


        var par = new URLSearchParams();
        par.append("movie",id);
        var url = "./movie.html?" + par.toString();

        let htmlval = `<div class = "row box-filme shadow-sm p-3 mb-5 bg-white">
            <div class = "col-xl-2 col-lg-3 col-md-4">
            ${poster != null ? `<img src="https://image.tmdb.org/t/p/w500/${poster}" class="card-img-top h-100" alt="">` : `<img src="./imgs/notfound.jpg" class="card-img-top h-100" alt="">`}
            </div>
            <div class = "col-xl-10 col-lg-9 col-md-8">
              <h4 class = "titulo-search">${titulo}</h4>
              <p class = "par-filmes"><strong>Diretor:</strong> ${diretor} - <strong>Data:</strong> ${data}
              <br><strong>Elenco:</strong> ${elenco}
              <br><strong>Sinopse: </strong>${
                sinopse.length > 0 ? sinopse : "Não encontrada"
              }</p>
              <div class = "row coluna-mais">
              <button type="button" onclick="window.location.href='${url}'" class="btn btn-danger btn-mais">Mais informações</button>
              </div>
            </div>
          </div>`;
        $("#filmes").append(htmlval);
      },
    });
  };

  var params = new URLSearchParams(window.location.search),
    filme = params.get("filme");

  let mostrarResultados = (valor) => {
    $("#filmes").empty();

    $("#filme-pesquisado").text(" " + valor);
    $.ajax({
      url: `https://api.themoviedb.org/3/search/movie?api_key=c89ec6adb55c00d663f144a4af18cf62&language=pt-BR&query=${valor}&page=1&include_adult=false`,
      type: "GET",
      success: function (resultado) {
        resultado.results.forEach((value, index) => {
          pegarDiretor(
            value.id,
            value.poster_path,
            value.title,
            value.overview,
            value.release_date
          );
        });
      },
    });
  };

  if (filme != null) {
    mostrarResultados(filme);
  }

  $("#search-site2").on("keypress", function (e) {
    if (e.which === 13) {
      if ($("#search-site2").val() != "") {
        mostrarResultados($("#search-site2").val());
      }
      $(this).removeAttr("disabled");
    }
  });

  $("#btn-destaque").click(function () {
    $("html,body").animate(
      {
        scrollTop: $("#destaques").offset().top,
      },
      "slow"
    );
  });
  $("#btn-release").click(function () {
    $("html,body").animate(
      {
        scrollTop: $(".lancamento").offset().top,
      },
      "slow"
    );
  });
  $("#btn-avaliacoes").click(function () {
    $("html,body").animate(
      {
        scrollTop: $(".row-ult").offset().top,
      },
      "slow"
    );
  });
  $("#btn-entMake").click(function () {
    $("html,body").animate(
      {
        scrollTop: $(".makingof").offset().top,
      },
      "slow"
    );
  });
  $("#btn-news").click(function () {
    $("html,body").animate(
      {
        scrollTop: $(".novidades").offset().top,
      },
      "slow"
    );
  });

  $("#lancamentos").click(function () {
    window.location.href = "./index.html#lancamento";
  });
  $("#destaque").click(function () {
    window.location.href = "./index.html#destaques";
  });
  $("#aval").click(function () {
    window.location.href = "./index.html#avaliacoes";
  });
  $("#entrevista").click(function () {
    window.location.href = "./index.html#entrevistas";
  });
  $("#novidades").click(function () {
    window.location.href = "./index.html#novidades";
  });

  $(".progress").each(function() {

    var value = $(this).attr('data-value');
    var left = $(this).find('.progress-left .progress-bar');
    var right = $(this).find('.progress-right .progress-bar');

    if (value > 0) {
      if (value <= 50) {
        right.css('transform', 'rotate(' + percentageToDegrees(value) + 'deg)')
      } else {
        right.css('transform', 'rotate(180deg)')
        left.css('transform', 'rotate(' + percentageToDegrees(value - 50) + 'deg)')
      }
    }

  })

  function percentageToDegrees(percentage) {

    return percentage / 100 * 360

  }
};

let infoFilme = () => {
  var params = new URLSearchParams(window.location.search),
  mov = params.get("movie");
  movies.forEach((value) => {
    console.log(movies[value].movie.id);
  })
}

infoFilme();
