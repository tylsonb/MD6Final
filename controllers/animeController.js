import { AnimeModel } from "../models/animeModel.js";
import * as crypto from "node:crypto";
import * as url from "node:url";

export const animeController = async (req, res, payloadBruto, urlparts) => {
  const queryParams = url.parse(req.url, true);
  console.log(urlparts)

  if (req.method == "GET" && !urlparts[2] && !queryParams.search) {
    try {
      let animes = await AnimeModel.getALL();
      res.writeHead(200, "OK", { "content-type": "application/json" });
      res.end(JSON.stringify(animes));
    } catch (error) {
      res.writeHead(500, "Internal Server Error", {
        "content-type": "application/json",
      });
      res.end(JSON.stringify({ message: error.message }));
    }

    /* Mostrar Anime por ID */

  } else if (req.method == "GET" && urlparts[2] && urlparts.length <= 3) {

    let anime = await AnimeModel.getById(urlparts[2]);
    if (anime) {
      res.writeHead(200, "OK", { "content-type": "application/json" });
      res.end(JSON.stringify(anime));
    } else {
      res.writeHead(404, "Not Found", { "content-type": "application/json" });
      res.end(JSON.stringify({ message: "Anime no encotrado" }));
    }

    /* Buscar Aime por nombre */

  } else if (req.method == "GET" && !urlparts[2] && queryParams.search) {
    const { nombre } = queryParams.query;
    const animes = await AnimeModel.getALL();

    let ids = Object.keys(animes);

    for (let id of ids) {
      let anime = animes[id];
      if (!anime.nombre.toLowerCase().includes(nombre.toLowerCase())) {
        delete animes[id];
      }
    }
    let remainingKeys = Object.keys(animes);

    if (remainingKeys.length == 0) {
      res.writeHead(404, "Not Found", { "content-type": "application/json" });
      return res.end(JSON.stringify({ message: "No se encontraron discos" }));
    } else {
      res.writeHead(200, "OK", { "content-type": "application/json" });
      return res.end(JSON.stringify(animes));
    }

    /* Crear Anime */

  } else if (req.method == "POST" && !urlparts[2]) {  
    try {
      
      let data = JSON.parse(payloadBruto);
      let id = crypto.randomUUID();

      let animes = await AnimeModel.getALL();
      animes[id] = data;
      
      let status = await AnimeModel.CreateAndUpdateAnime(animes);

      if (status) {
        res.writeHead(201, "Created", { "content-type": "application/json" });
        res.end(JSON.stringify({ message: "Anime Creado" }));
      } else {
        res.writeHead(500, "Internal Server Error", {"content-type": "application/json",});
        res.end(JSON.stringify({ message: "Error interno al crear el Anime" }));
      }
    } catch (err) {

      res.writeHead(400, "Bad Request", { "content-type": "application/json" });
      res.end(JSON.stringify({ message: "Solicitud mal hecha" , error: err.message}));
    }

    /* Actualiza Anime */

  } else if (req.method == "PUT" && urlparts[2]) {

    try {
      let animes = await AnimeModel.getALL();
      let anime = await AnimeModel.getById(urlparts[2]);

      if (anime) {
        try {
          let payload = JSON.parse(payloadBruto);
          anime = { ...anime, ...payload };
          animes[urlparts[2]] = anime;

          await AnimeModel.CreateAndUpdateAnime(animes);

          res.writeHead(200, "OK", { "content-type": "application/json" });
          return res.end(JSON.stringify({ message: "updated", anime }));
        } catch (err) {
          res.writeHead(400, "Bad Request", {
            "content-type": "application/json",
          });
          return res.end(JSON.stringify({ message: "Payload mal formado" }));
        }
      } else {
        res.writeHead(404, "Not Found", { "content-type": "application/json" });
        return res.end(JSON.stringify({ message: "Anime no encontrado" }));
      }
    } catch (err) {
      console.log(err);
      res.writeHead(500, "Internal Server Error", {
        "content-type": "application/json",
      });
      return res.end(JSON.stringify({ message: "Error interno de servidor" }));
    }

    /* Eliminar Anime */

  } else if (req.method == "DELETE" && urlparts[2]) {
    let animes = await AnimeModel.getALL();

    let ids = Object.keys(animes);
    if (ids.includes(urlparts[2])) {
      delete animes[urlparts[2]];

      await AnimeModel.CreateAndUpdateAnime(animes);

      res.writeHead(200, "OK", { "content-type": "application/json" });
      return res.end(JSON.stringify({ message: "Anime eliminado" }));
    } else {
      res.writeHead(404, "Not Found", { "content-type": "application/json" });
      return res.end(JSON.stringify({ message: "Anime no encontrado" }));
    }
  }
};
