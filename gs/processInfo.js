// eslint-disable-next-line no-unused-vars
function getDataFromActiveSheet() {
  // eslint-disable-next-line no-undef
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const sheet = ss.getActiveSheet()
  return sheet.getSheetValues(1, 1, sheet.getLastRow(), sheet.getLastColumn())
}

function groupClothes(rows, clothingPos, sizePos, quantityPos) {
  // eslint-disable-next-line
  var reducedArray = []
  // eslint-disable-next-line
  var objArray = rows.map(function(row) {
    return {
      contenido: row[clothingPos],
      size: row[sizePos],
      quantity: parseFloat(row[quantityPos]),
    }
  }).forEach(function(clothing) { // eslint-disable-line
    // eslint-disable-next-line
    var found = false
    reducedArray.forEach(function(obj) { // eslint-disable-line
      if (obj.contenido === clothing.contenido
            && obj.size === clothing.size) {
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



function getCustomItems(rows, customElementsConf) {
  // eslint-disable-next-line
  return customElementsConf.map(function(customElementConf) {
    // TODO: revisar porque no funciona

    var customItem = {
      label: customElementConf.label
    }

    if (customElementConf.isRelativeByColumn){
      customItem.value = rows[0][customElementConf.value - 1]
    } else {
      customItem.value = customElementConf.value
    }

    Logger.log(customItem)

    return  customItem;

  })
}

function processResume(data, confData) {
  // eslint-disable-next-line
  var resume = {}
  // extrae la fila de labels
  data.shift()

  // Define los items fijos a partir de la primera fila
  resume.provider = confData.boxes.provider
  resume.to = confData.boxes.receiver
  resume.orderNumber = confData.boxes.purchaseOrder

  // Define arreglo de prendas
  resume.clothes = groupClothes(
    data,
    confData.clothingInfo.colClothing - 1,
    confData.clothingInfo.colSize - 1,
    confData.clothingInfo.colAmount - 1 // eslint-disable-line comma-dangle
  )
  return resume
}

function processBoxes(sets, confData) {
  // eslint-disable-next-line
  var setGroups = []
  // eslint-disable-next-line
  var setGroup = []
  // eslint-disable-next-line
  var boxCounter = 0
  // Divide el arreglo de sets en sub arreglos
  // eslint-disable-next-line
  sets.forEach(function(set) {
    if (boxCounter % confData.boxes.setsAmount === 0) {
      setGroup = []
      setGroups.push(setGroup)
    }
    setGroup.push(set)
    boxCounter += 1
  })

  // Genera el contenido de Box en función de los sets
  // eslint-disable-next-line
  var boxes = setGroups.map(function(setsItems) {
    // eslint-disable-next-line
    var box = {}

    // Define los items fijos
    box.provider = confData.boxes.provider
    box.to = confData.boxes.receiver
    box.orderNumber = confData.boxes.purchaseOrde

    // Define los customItems a partir de la primera fila
    box.customItems = getCustomItems(sets[0].rows, confData.boxes.customElements)

    // eslint-disable-next-line
    var rows = [] // arreglo para agrupar prendas
    // eslint-disable-next-line
    var setItems = [] // arreglo para contenido del set de los ítems.
    // eslint-disable-next-line
    setsItems.forEach(function(set) {
      setItems.push(
        {
          groupByValue: set.groupByValue,
          serialNumber: set.serialNumber,
        } // eslint-disable-line comma-dangle
      )
      rows = rows.concat(set.rows)
    })

    // añade arreglo de los sets al objeto boxes
    box.sets = setItems

    // Define arreglo de prendas
    box.clothes = groupClothes(
      rows,
      confData.clothingInfo.colClothing - 1,
      confData.clothingInfo.colSize - 1,
      confData.clothingInfo.colAmount - 1
    )
    return box
  })

  return boxes
}



function processSets(data, confData) {
  // extrae columna groupBy
  // eslint-disable-next-line
  var groupByValuesArray = data.map(function(row, index, self) {
    // -1 debido a que spreadsheet entrega posición columna y no arreglo
    return row[confData.set.groupBy - 1]
  })

  // extrae label de la columna
  // eslint-disable-next-line
  var groupByLabel = groupByValuesArray.shift()

  // Arreglo son valores sin repetición. Será utilizado como index
  // eslint-disable-next-line
  var groupByUniqueArray = groupByValuesArray.filter(function(value, index, self) {
    return self.indexOf(value) === index
  })

  // Crea los set para el listado de elementos únicos
  // eslint-disable-next-line
  var sets = groupByUniqueArray.map(function(groupByValue) {
    // eslint-disable-next-line no-var
    var set = {}
    // eslint-disable-next-line
    var setRows = data.filter(function(row, index, self) {
      return (self[index][confData.set.groupBy - 1] === groupByValue)
    })

    // añade los rows del set para que sean utilizados en la generación de Box
    set.rows = setRows

    // Define los items fijos a partir de la primera fila
    set.groupBy = groupByLabel
    set.groupByValue = setRows[0][confData.set.groupBy - 1]
    set.serialNumber = setRows[0][confData.set.correlativeNumber - 1]

    // Define los customItems a partir de la primera fila
    set.customItems = getCustomItems(setRows, confData.set.customElements)

    // Define arreglo de prendas
    set.clothes = groupClothes(
      setRows,
      confData.clothingInfo.colClothing - 1,
      confData.clothingInfo.colSize - 1,
      confData.clothingInfo.colAmount - 1 // eslint-disable-line comma-dangle
    )

    return set
  })

  return sets
}



// eslint-disable-next-line no-unused-vars
function processInfo() {
  // eslint-disable-next-line no-var
  var confData = {
    sheetColumns: [
      {
        col: 1.0,
        colLabel: 'Nº Correlativo',
      },
      {
        col: 2.0,
        colLabel: 'Usuario',
      },
      {
        col: 3.0,
        colLabel: 'Rut',
      },
      {
        col: 4.0,
        colLabel: 'local',
      },
      {
        col: 5.0,
        colLabel: 'Tipo',
      },
      {
        col: 6.0,
        colLabel: 'Sap Nuevo',
      },
      {
        col: 7.0,
        colLabel: 'Prenda',
      },
      {
        col: 8.0,
        colLabel: 'Talla',
      },
      {
        col: 9.0,
        colLabel: 'Ctd.solicitada',
      },
      {
        col: 10.0,
        colLabel: 'proveedor',
      },
    ],
    clothingInfo: {
      colClothing: 7,
      colSize: 8,
      colAmount: 9,
    },
    set: {
      id: 'set_01',
      groupBy: 2,
      correlativeNumber: 6,
      customElements: [
        {
          label: 'Rut',
          value: 3,
          isRelativeByColumn: true,

        },
        {
          label: 'Departamento',
          value: 'Mantenimiento',
          isRelativeByColumn: false,
        },
      ],
    },
    boxes: {
      id: 'box_01',
      setsAmount: 2,
      provider: 'Antuan',
      receiver: 'Latam',
      purchaseOrder: '1231123',
      customElements: [
        {
          label: 'Local',
          value: 4,
          isRelativeByColumn: true,

        },
        {
          label: 'Departamento',
          value: 'Mantenimiento',
          isRelativeByColumn: false,
        },
      ],
    },
  }


  // eslint-disable-next-line no-var
  var data = getDataFromActiveSheet()
  // eslint-disable-next-line no-var
  var setItems = processSets(data, confData)
  // eslint-disable-next-line no-var
  var boxItems = processBoxes(setItems, confData)
  // eslint-disable-next-line no-var
  var resumeItem = processResume(data, confData)

  // eslint-disable-next-line no-var
  var signsInfo = {
    sets: setItems,
    boxes: boxItems,
    resume: resumeItem,
  }

  // Logger.log(signInfo)
  return signsInfo
}
