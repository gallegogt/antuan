/**
 * Clase Antuan
 *
 * Fachada entre Google API y la aplicación
 */
export default class Antuan {
  /**
   * Constructor de la clase
   */
  constructor() {
    this.sheetData = {
      sheetColumns: [{
        label: 'Column 1',
        index: '1',
      }, {
        label: 'Column 2',
        index: '2',
      }, {
        label: 'Column 3',
        index: '3',
      }],
    }
  }

  /**
   * Pide al servidor los datos de la hoja de calculo
   * @return {Promise} Devuelve un Promise
   */
  getGsSheetData() {
    return new Promise((resolve /* reject*/) => {
      // TODO: Reemplazar dicho código por el código que haga
      //       referencia al la petición al
      setTimeout(() => {
        resolve(this.sheetData.sheetColumns)
      }, 100)
    })
  }
}
