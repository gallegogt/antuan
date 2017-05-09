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
      google.script.run.withSuccessHandler((data) => {
        this.sheetData.sheetColumns = data
        resolve(this.sheetData.sheetColumns)
      }).sheetColumns()

      // TODO: Reemplazar dicho código por el código que haga
      //       referencia al la petición al
      /*
      setTimeout(() => {
        resolve(this.sheetData.sheetColumns)
      }, 100)
      */
    })
  }

  /**
   * @param {Object} info Información para generar los carteles
   * @return {Promise} Devuelve un Promise
   */
  static async generatePosters(info) {
    // return new Promise((resolve /* reject*/) => {

    // Copia hojas desde un template
    await Antuan.copyGSTemplates()

    // Obtiene los datos desde la hoja activa
    const data = await Antuan.getDataFromSpreadsheet()

    console.log('data: ', data)
    console.log('info: ', info)
    // Procesar la información
    const signsInfo = Antuan.processInfo(data, info)

    console.log('data: ', signsInfo)
    // crear las etiquetas
    await Antuan.createGSSetSigns(signsInfo.sets)
    await Antuan.createGSBoxSigns(signsInfo.boxes)
    await Antuan.createGSResumeSign(signsInfo.resume)

      // TODO: Reemplazar dicho código por el código que haga
      //       referencia al la petición al
      /*
      setTimeout(() => {
        resolve(info)
      }, 1000)
      */
   // })
  }


  /**
   * @return {Promise} Devuelve un Promise
   */
  static copyGSTemplates() {
    return new Promise((resolve /* reject*/) => {
      google.script.run.withSuccessHandler(() => {
        resolve()
      }).copyTemplateSheets()
    })
  }

  /**
   * @return {Promise} Devuelve un Promise
   */
  static getDataFromSpreadsheet() {
    return new Promise((resolve /* reject*/) => {
      google.script.run.withSuccessHandler((data) => {
        const spreadsheetData = data
        resolve(spreadsheetData)
      }).getDataFromActiveSheet()
    })
  }

  /**
   * @return {Promise} Devuelve un Promise
   */
  static createGSSetSigns(sets) {
    return new Promise((resolve /* reject*/) => {
      google.script.run.withSuccessHandler(() => {
        resolve()
      }).createSetSigns(sets)
    })
  }
  /**
   * @return {Promise} Devuelve un Promise
   */
  static createGSBoxSigns(boxes) {
    return new Promise((resolve /* reject*/) => {
      google.script.run.withSuccessHandler(() => {
        resolve()
      }).createBoxSigns(boxes)
    })
  }

  /**
   * @return {Promise} Devuelve un Promise
   */
  static createGSResumeSign(resume) {
    return new Promise((resolve /* reject*/) => {
      google.script.run.withSuccessHandler(() => {
        resolve()
      }).createResumeSign(resume)
    })
  }


  static groupClothes(rows, clothingPos, sizePos, quantityPos) {
    const reducedArray = []
    rows.map(row => ({
      clothing: row[clothingPos],
      size: row[sizePos],
      quantity: parseFloat(row[quantityPos]),
    })).forEach((clothing) => {
      let found = false
      reducedArray.forEach((obj) => {
        if (obj.clothing === clothing.clothing
            && obj.size === clothing.size) {
          // eslint-disable-next-line no-param-reassign
          obj.quantity += clothing.quantity
          // Logger.log('obj.quantity: ' + obj.quantity)
          // Logger.log('clothing.quantity: ' + clothing.quantity)
          found = true
        }
      })
      if (!found) {
        reducedArray.push(clothing)
      }
    })
    return reducedArray
  }

  static getCustomItems(rows, customElementsConf) {
    return customElementsConf.map((customElementConf) => {
      // Asigna label
      const customItem = {
        label: customElementConf.label,
      }
      // Asigna value
      if (customElementConf.isRelativeByColumn) {
        customItem.value = rows[0][customElementConf.value - 1]
      } else {
        customItem.value = customElementConf.value
      }
      return customItem
    })
  }

  static processSets(data, confData) {
    // extrae columna groupBy
    const groupByValuesArray = data.map(row => (
      // -1 debido a que spreadsheet entrega posición columna y no arreglo
      row[confData.set.groupBy - 1]
    ))

    // extrae label de la columna
    const groupByLabel = groupByValuesArray.shift()

    // Arreglo son valores sin repetición. Será utilizado como index
    const groupByUniqueArray = groupByValuesArray.filter((value, index, self) => (
      self.indexOf(value) === index
    ))

    // Crea los set para el listado de elementos únicos
    const sets = groupByUniqueArray.map((groupByValue) => {
      const set = {}
      const setRows = data.filter((row, index, self) => (
        self[index][confData.set.groupBy - 1] === groupByValue
      ))

      // añade los rows del set para que sean utilizados en la generación de Box
      set.rows = setRows

      // Define los items fijos a partir de la primera fila
      set.groupBy = groupByLabel
      set.groupByValue = setRows[0][confData.set.groupBy - 1]
      set.serialNumber = setRows[0][confData.set.correlativeNumber - 1]

      // Define los customItems a partir de la primera fila
      set.customItems = Antuan.getCustomItems(setRows, confData.set.customItems)

      // Define arreglo de prendas
      set.clothes = Antuan.groupClothes(
        setRows,
        confData.clothingInfo.colClothing - 1,
        confData.clothingInfo.colSize - 1,
        confData.clothingInfo.colAmount - 1 // eslint-disable-line comma-dangle
      )
      return set
    })

    return sets
  }

  static processBoxes(sets, confData) {
    const setGroups = []
    let setGroup = []
    let boxCounter = 0
    // Divide el arreglo de sets en sub arreglos
    sets.forEach((set) => {
      if (boxCounter % confData.box.setsAmount === 0) {
        setGroup = []
        setGroups.push(setGroup)
      }
      setGroup.push(set)
      boxCounter += 1
    })

    // Genera el contenido de Box en función de los sets
    const boxes = setGroups.map((setsItems) => {
      const box = {}

      // Define los items fijos
      box.provider = confData.box.provider
      box.to = confData.box.receiver
      box.orderNumber = confData.box.purchaseOrde

      // Define los customItems a partir de la primera fila
      box.customItems = Antuan.getCustomItems(sets[0].rows, confData.box.customItems)

      // arreglo para agrupar prendas
      let rows = []
      // arreglo para contenido del set de los ítems.
      const setItems = []
      setsItems.forEach((set) => {
        setItems.push(
          {
            groupByValue: set.groupByValue,
            serialNumber: set.serialNumber // eslint-disable-line comma-dangle
          },
        )
        rows = rows.concat(set.rows)
      })

      // añade arreglo de los sets al objeto boxes
      box.sets = setItems

      // Define arreglo de prendas
      box.clothes = Antuan.groupClothes(
        rows,
        confData.clothingInfo.colClothing - 1,
        confData.clothingInfo.colSize - 1,
        confData.clothingInfo.colAmount - 1 // eslint-disable-line comma-dangle
      )
      return box
    })

    return boxes
  }


  static processResume(data, confData) {
    const resume = {}
    // extrae la fila de labels
    data.shift()

    // Define los items fijos a partir de la primera fila
    resume.provider = confData.box.provider
    resume.to = confData.box.receiver
    resume.orderNumber = confData.box.purchaseOrder

    // Define arreglo de prendas
    resume.clothes = Antuan.groupClothes(
      data,
      confData.clothingInfo.colClothing - 1,
      confData.clothingInfo.colSize - 1,
      confData.clothingInfo.colAmount - 1 // eslint-disable-line comma-dangle
    )
    return resume
  }

  /**
   * @param {Object} info Información para generar los carteles
   * @return {Promise} Devuelve un Promise
   */
  static processInfo(data, confData) {
    const setItems = Antuan.processSets(data, confData)
    const boxItems = Antuan.processBoxes(setItems, confData)
    const resumeItem = Antuan.processResume(data, confData)

    const signsInfo = {
      sets: setItems,
      boxes: boxItems,
      resume: resumeItem,
    }
    // Logger.log(signInfo)
    return signsInfo
  }

}
