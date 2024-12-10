/* Guarda, Leer datos de animes */

import {
  createFile,
  deleteFile,
  updateFile,
  readFile,
  fileExists,
  listAll,
} from "../lib/data.js";

export class AnimeModel {
  static folder = '.data/'
  static fileName = 'animes.json'

  static async getALL() {
    
    let animes = await readFile(AnimeModel.folder, AnimeModel.fileName);
    
    return animes;
  }

  static async getById(id) {
    let animes = await AnimeModel.getALL();

    return animes[id]
  }

  static async CreateAndUpdateAnime(animes) {
    try {
      await updateFile(AnimeModel.folder, AnimeModel.fileName, animes);
      return true
    } catch (error) {
      console.error('Error actualizando archivo de animes;', error)
      return false
    }
  }

}