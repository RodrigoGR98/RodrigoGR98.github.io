onload = () => {
  var params = new URLSearchParams(window.location.search),
    id = params.get("movie");

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

  let filmeInfo = () => {
    id = id.toString();
    console.log(id);
    $.ajax({
      url: `https://api.themoviedb.org/3/movie/${id}?api_key=c89ec6adb55c00d663f144a4af18cf62&language=pt-BR`,
      type: "GET",
      success: function (resultado) {
        let titulo = resultado.title;
        let poster = resultado.poster_path;
        let sinopse = resultado.overview;
        let note = resultado.vote_average;
        note = note.toString();
        note = note.replace(".", "");
        if (note < 10) {
          note = note + "0";
        }
        let data = resultado.release_date;
        let ano = resultado.release_date.substring(0, 4);
        let gen = "";
        let empresa;
        let duracao = resultado.runtime;
        if (resultado.production_companies != "") {
          empresa = resultado.production_companies[0].name;
        } else {
          empresa = "Não encontrada"
        }
        resultado.genres.forEach((element) => {
          gen += element.name + ", ";
        });
        gen = gen.substring(0, gen.length - 2);
        pegarCredito(
          id,
          titulo,
          poster,
          sinopse,
          note,
          data,
          ano,
          gen,
          duracao,
          empresa
        );
      },
    });
  };

  filmeInfo();

  let pegarCredito = (
    id,
    titulo,
    poster,
    sinopse,
    note,
    data,
    ano,
    gen,
    duracao,
    empresa
  ) => {
    let diretor = "";
    let roteiro = "";
    let elenco = "";

    $.ajax({
      url: `https://api.themoviedb.org/3/movie/${id}/credits?api_key=c89ec6adb55c00d663f144a4af18cf62&language=en-US`,
      type: "GET",
      success: function (resultado) {
        let i = 0;
        console.log("Pos: " + id);
        resultado.crew.forEach((value) => {
          if (value.job === "Director") {
            diretor = value.name;
          }
          if (
            value.job === "Writer" ||
            value.job === "Story" ||
            value.job === "Script" ||
            value.job === "Screenplay"
          ) {
            if (i == 0) {
              roteiro = value.name;
              i++;
            }
          }
        });

        for (let i = 0; i < 3; i++) {
          elenco += resultado.cast[i].name + ", ";
        }

        elenco = elenco.substring(0, elenco.length - 2);
        console.log(note);
        let duration = "";
        var hours = duracao / 60;
        var rhours = Math.floor(hours);
        var minutes = (hours - rhours) * 60;
        var rminutes = Math.round(minutes);
        if (rminutes < 10 && rminutes >= 1) {
          rminutes = "0" + rminutes + "m";
        } else {
          rminutes += "m";
        }
        if (rminutes === 0) {
          rminutes == "";
        }
        duration = rhours + "h" + rminutes;
        let datax;
        data = data.split("-");
        datax = data[2] + "/" + data[1] + "/" + data[0];
        let htmlcont;

        htmlcont = `<div class = "container cont-movie">
            <div class = "row">
              <div class = "col-xl-4 col-lg-5 col-md-6 col-sm-12 div-img">
                  ${
                    poster != null
                      ? `<img src="https://image.tmdb.org/t/p/w500/${poster}" class="card-img-top h-100" alt="">`
                      : `<img src="./imgs/notfound.jpg" class="card-img-top h-100" alt="">`
                  }
              </div>
              <div class = "col-xl-8 col-lg-7 col-md-6 col-sm-12 text-movie">

                  <h3>${titulo} (${ano})</h3> 
                  ${datax} ● ${gen} ● ${duration}
                  <p>
                  <div class = "row align-items-center bar-xd">
                    <div class="progress" data-value='${note}'>
                      <span class="progress-left">
                                    <span class="progress-bar border-success"></span>
                      </span>
                      <span class="progress-right">
                                    <span class="progress-bar border-success"></span>
                      </span>
                      <div class="progress-value w-100 h-100 rounded-circle d-flex align-items-center justify-content-center">
                        <div class="h6 font-weight-bold pc-text">${note}%</div>
                      </div>
                    </div>
                    <p style="margin-top: 15px; margin-left: 15px;"><strong>Avaliação dos usuários</strong></p>
                  </div></p>
                  
                    <p style="margin-top: 10px;"><strong>Sinopse: </strong>${sinopse}</p>
                    <p><strong>Diretor: </strong>${diretor}</p>
                    <p><strong>Roteirista: </strong> ${roteiro}</p>
                    <p><strong>Elenco: </strong>${elenco}</p>
                    <p><strong>Empresa: </strong>${empresa}</p>
                  
                  </div>
              </div>
            </div>`;
        $(".holding").append(htmlcont);
        $(".progress").each(function () {
          var value = $(this).attr("data-value");
          var left = $(this).find(".progress-left .progress-bar");
          var right = $(this).find(".progress-right .progress-bar");

          if (value > 0) {
            if (value <= 50) {
              right.css(
                "transform",
                "rotate(" + percentageToDegrees(value) + "deg)"
              );
            } else {
              right.css("transform", "rotate(180deg)");
              left.css(
                "transform",
                "rotate(" + percentageToDegrees(value - 50) + "deg)"
              );
            }
          }
        });

        function percentageToDegrees(percentage) {
          return (percentage / 100) * 360;
        }

        pegarTrailer(id);
      },
    });
  };

  let pegarTrailer = (id) => {
    let trailer = "";
    let content;
    $.ajax({
      url: `https://api.themoviedb.org/3/movie/${id}/videos?api_key=c89ec6adb55c00d663f144a4af18cf62&language=en-US`,
      type: "GET",
      success: function (resultado) {
        if (resultado.results.length > 0) {
          content = `<h2 style="color: white; text-align:center" >Trailer</h2>
                <iframe class = "trailer-info" src="https://www.youtube.com/embed/${resultado.results[0].key}" frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen></iframe>`;
        } else {
          content = `<h2 style="color: white; text-align:center" >Trailer</h2>
                <h5 style="color: white; text-align:center" >Parece que não foi encontrado um trailer =(</h5>
                <img class = "trailer-info" src = "./imgs/nf.gif" alt = "">`;
        }
        $(".trailer-div").append(content);
      },
    });
  };
};
