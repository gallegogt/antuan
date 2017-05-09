/**
* Copia la fila indicada n veces
* @param {Int} row número de la fila
* @param {Int} n cantidad de copias
**/
// eslint-disable-next-line no-unused-vars
function duplicateRow(row, n) {
  // eslint-disable-next-line no-undef
  const sheet = SpreadsheetApp.getActiveSheet()

  // eslint-disable-next-line prefer-template
  const rangeToCopy = sheet.getRange(row + ':' + row)
  // eslint-disable-next-line
  for (var i = 1; i <= n; i += 1) {
    rangeToCopy.copyTo(sheet.getRange(row + i, 1))
    // Logger.log('copiando fila ' + row + ' a  fila: ' + (row+i))
  }
}

/**
Obtiene la primera columna de una sheet
@return array
**/
// eslint-disable-next-line no-unused-vars
function sheetColumns() {
  // eslint-disable-next-line
  var sheet = SpreadsheetApp.getActiveSheet()
  // eslint-disable-next-line no-var
  var values = sheet.getSheetValues(1, 1, 1, sheet.getLastColumn())
  // eslint-disable-next-line
  var labels = values[0].map(function(value, index) {
    return {
      col: index + 1,
      colLabel: value,
    }
  })
  return labels
}

/**
*  Crea Hojas vacias para los
**/
// eslint-disable-next-line no-unused-vars
function createSignSheets() {
  // eslint-disable-next-line no-undef
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  ss.insertSheet('set')
  ss.insertSheet('caja')
  ss.insertSheet('resumen')
}


/**
*  Copia el contenido de las hojas 'set', 'caja' y 'resumen' en la plantilla de template
**/
// eslint-disable-next-line no-unused-vars
function copyTemplateSheets() {
  // eslint-disable-next-line no-undef
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const sst = SpreadsheetApp.openById('1c3Pu6ROHZBBvXUyOkyJmFDLW6RbSz_KD9hLLCyy_ImA') // eslint-disable-line no-undef

  // copia los sheets del template al spreadsheet actual.
  sst.getSheetByName('set').copyTo(ss).setName('set')
  sst.getSheetByName('caja').copyTo(ss).setName('caja')
  sst.getSheetByName('resumen').copyTo(ss).setName('resumen')
}


/**
*  Elimina las hojas 'set', 'caja' y 'resumen'
**/
// eslint-disable-next-line no-unused-vars
function deleteSignSheets() {
  // eslint-disable-next-line no-undef
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  ss.deleteSheet(ss.getSheetByName('set'))
  ss.deleteSheet(ss.getSheetByName('caja'))
  ss.deleteSheet(ss.getSheetByName('resumen'))
}


// eslint-disable-next-line no-unused-vars
function getDataFromActiveSheet() {
  // eslint-disable-next-line no-undef
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const sheet = ss.getActiveSheet()
  return sheet.getSheetValues(1, 1, sheet.getLastRow(), sheet.getLastColumn())
}


/**
* reemplaza la data con los valores del set
* param {Array[][]} data datos de un rango
* param {Object} boxData objeto con los datos del set
*
**/
function replaceBoxData(data, boxData, replaceKeys, signCounter) {
  // eslint-disable-next-line no-var
  var setsCounter = 0
  // eslint-disable-next-line no-var
  var customItemsCounter = 0
  // eslint-disable-next-line no-var
  var clothesCounter = 0

  // eslint-disable-next-line
  data.forEach(function(row) {
    // eslint-disable-next-line
    row.forEach(function (cell, index, arr) {
      switch (cell) {
        case replaceKeys.BOX_COUNTER:
          // eslint-disable-next-line no-param-reassign
          arr[index] = signCounter
          break
        case replaceKeys.PROVIDER:
          // eslint-disable-next-line no-param-reassign
          arr[index] = boxData.provider
          break
        case replaceKeys.ORDER_NUMBER:
          // eslint-disable-next-line no-param-reassign
          arr[index] = boxData.orderNumber
          break
        case replaceKeys.TO:
          // eslint-disable-next-line no-param-reassign
          arr[index] = boxData.to
          break
        case replaceKeys.CUSTOM_LABEL:
          // eslint-disable-next-line no-param-reassign
          arr[index] = boxData.customItems[customItemsCounter].label
          break
        case replaceKeys.CUSTOM_FIELD:
          // eslint-disable-next-line no-param-reassign
          arr[index] = boxData.customItems[customItemsCounter].value
          customItemsCounter += 1
          break
        case replaceKeys.GROUP_BY_VALUE:
          // eslint-disable-next-line no-param-reassign
          arr[index] = boxData.sets[setsCounter].groupByValue
          break
        case replaceKeys.SERIAL_NUMBER:
          // eslint-disable-next-line no-param-reassign
          arr[index] = boxData.sets[setsCounter].serialNumber
          setsCounter += 1
          break
        case replaceKeys.CLOTHING:
          // eslint-disable-next-line no-param-reassign
          arr[index] = boxData.clothes[clothesCounter].clothing
          break
        case replaceKeys.SIZE:
          // eslint-disable-next-line no-param-reassign
          arr[index] = boxData.clothes[clothesCounter].size
          break
        case replaceKeys.QUANTITY:
          // eslint-disable-next-line no-param-reassign
          arr[index] = boxData.clothes[clothesCounter].quantity
          clothesCounter += 1
          break
        default:
          break
      }
    })
  })

  return data
}


/**
* Añade tantas filas de custom items y prendas necesarias para
* el ingreso de los datos.
*
**/
function prepareBoxRange(range, customItemsSize, setsSize, clothesSize, replaceKeys) {
  // eslint-disable-next-line no-undef
  const sheet = SpreadsheetApp.getActiveSheet()

  const newRange = range.getSheet().getRange(
    range.getRow(),
    range.getColumn(),
    // el -3 debido a que cada customItem y ClothesSize ya cuentan con una fila
    range.getHeight() + customItemsSize + setsSize + (clothesSize - 3),
    range.getWidth())

  // eslint-disable-next-line no-var
  var cellRange

  // eslint-disable-next-line
  for (var i = 1; i < newRange.getHeight(); i += 1) {
    // eslint-disable-next-line
    for (var j = 1; j < newRange.getWidth(); j += 1) {
      // Logger.log( 'contadores: '+ i +' - '+ j);
      cellRange = newRange.getCell(i, j)
      // Logger.log( 'Celdas: '+ cellRange.getRow() +' - '+ cellRange.getColumn());

      // añade filas a Custom Values
      if (cellRange.getValue() === replaceKeys.CUSTOM_LABEL
         || cellRange.getValue() === replaceKeys.CUSTOM_FIELD) {
        sheet.insertRowsAfter(cellRange.getRow(), customItemsSize - 1)
        duplicateRow(cellRange.getRow(), customItemsSize - 1)
        i += customItemsSize
        break
      }

       // añade filas a sets
      if (cellRange.getValue() === replaceKeys.GROUP_BY_VALUE
         || cellRange.getValue() === replaceKeys.SERIAL_NUMBER) {
        sheet.insertRowsAfter(cellRange.getRow(), setsSize - 1)
        duplicateRow(cellRange.getRow(), setsSize - 1)
        i += setsSize
        break
      }


      // añade filas a clothes
      if (cellRange.getValue() === replaceKeys.CLOTHING
         || cellRange.getValue() === replaceKeys.SIZE
         || cellRange.getValue() === replaceKeys.QUANTITY) {
        sheet.insertRowsAfter(cellRange.getRow(), clothesSize - 1)
        duplicateRow(cellRange.getRow(), clothesSize - 1)
        i += clothesSize
        break
      }
    }
  }

  return newRange
}

/**
* Crea etiquetas de caja
**/
// eslint-disable-next-line no-unused-vars
function createBoxSigns() {
  // Espacio entre etiquetas
  const rowSpace = 1

  const boxes = [
    {
      provider: 'Antuan',
      orderNumber: '2313131',
      to: 'Latam',
      customItems: [
        {
          label: 'Rut',
          value: '12.324.533-2',
        },
        {
          label: 'Departamento',
          value: 'Mantenimiento',
        },
      ],
      sets: [
        {
          groupByValue: 'Juan Díaz',
          serialNumber: '3213233',
        },
        {
          groupByValue: 'Gustavo Almeda',
          serialNumber: '2222222',
        },
      ],
      clothes: [
        {
          clothing: 'Pantalón',
          size: 'M',
          quantity: '5',
        },
        {
          clothing: 'Camisa',
          size: 'L',
          quantity: '2',
        },
        {
          clothing: 'Abrigo',
          size: 'XL',
          quantity: '3',
        },
      ],
    },
    {
      provider: 'Antuan',
      orderNumber: '2313131',
      to: 'Latam',
      customItems: [
        {
          label: 'Rut',
          value: '12.324.533-2',
        },
        {
          label: 'Departamento',
          value: 'Mantenimiento',
        },
      ],
      sets: [
        {
          groupByValue: 'Juan Díaz',
          serialNumber: '3213233',
        },
        {
          groupByValue: 'Gustavo Almeda',
          serialNumber: '2222222',
        },
      ],
      clothes: [
        {
          clothing: 'Pantalón',
          size: 'M',
          quantity: '5',
        },
        {
          clothing: 'Camisa',
          size: 'L',
          quantity: '2',
        },
        {
          clothing: 'Abrigo',
          size: 'XL',
          quantity: '3',
        },
      ],
    },
  ]


  const replaceKeys = {
    BOX_COUNTER: '{{numero_caja}}',
    PROVIDER: '{{proveedor}}',
    ORDER_NUMBER: '{{orden_compra}}',
    TO: '{{destinatario}}',
    CUSTOM_LABEL: '{{custom_label}}',
    CUSTOM_FIELD: '{{custom_field}}',
    GROUP_BY_VALUE: '{{agrupar_por_valor}}',
    SERIAL_NUMBER: '{{n_correlativo}}',
    CLOTHING: '{{contenido}}',
    SIZE: '{{talla}}',
    QUANTITY: '{{cantidad}}',
  }

  const BOX_SHEET = 'caja'
  // eslint-disable-next-line no-undef
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const sheet = ss.getSheetByName(BOX_SHEET)
  sheet.activate()

  // obtener rangos del template
  const templateRowSize = sheet.getLastRow()
  const templateColumnSize = sheet.getLastColumn()
  const templateRange = sheet.getRange(1, 1, templateRowSize, templateColumnSize)

  // Logger.log('templateRowSize: '+ templateRowSize)
  // Logger.log('templateColumnSize: '+ templateColumnSize)
  // Logger.log('newSignOffset: '+ newSignOffset)

  // eslint-disable-next-line
  var signCounter = 1
  // eslint-disable-next-line
  var offset
  // eslint-disable-next-line
  var signRange
  // eslint-disable-next-line
  var data
  // Comienza la iteración ----
  // eslint-disable-next-line
  boxes.forEach( function(box) {
    // La siguiente fila (por eso más 1)
    offset = sheet.getLastRow() + 1 + rowSpace

    // Define nuevo rango de trabajo
    signRange = sheet.getRange(
            offset,
            1,
            templateRowSize,
            templateColumnSize)

    // copia el template
    templateRange.copyTo(signRange)

    // Añade filas para campos customizados
    signRange = prepareBoxRange(
            signRange,
            box.customItems.length,
            box.sets.length,
            box.clothes.length,
            replaceKeys)


    // reemplaza campos por items del set y aumenta el contador
    data = signRange.getValues()
    data = replaceBoxData(data, box, replaceKeys, signCounter)
    signRange.setValues(data)
    signCounter += 1
  })

  // Elimina etiqueta
  sheet.deleteRows(1, templateRowSize + rowSpace)
}


/**
* reemplaza la data con los valores del set
* param {Array[][]} data datos de un rango
* param {Object} setData objeto con los datos del set
*
**/
function replaceSetData(data, setData, replaceKeys, signCounter) {
  // eslint-disable-next-line no-var
  var customItemsCounter = 0
  // eslint-disable-next-line no-var
  var clothesCounter = 0

  // eslint-disable-next-line
  data.forEach(function(row) {
    // eslint-disable-next-line
    row.forEach(function (cell, index, arr) {
      switch (cell) {
        case replaceKeys.SET_COUNTER:
          // eslint-disable-next-line no-param-reassign
          arr[index] = signCounter
          break
        case replaceKeys.GROUP_BY:
          // eslint-disable-next-line no-param-reassign
          arr[index] = setData.groupBy
          break
        case replaceKeys.GROUP_BY_VALUE:
          // eslint-disable-next-line no-param-reassign
          arr[index] = setData.groupByValue
          break
        case replaceKeys.SERIAL_NUMBER:
          // eslint-disable-next-line no-param-reassign
          arr[index] = setData.serialNumber
          break
        case replaceKeys.CUSTOM_LABEL:
          // eslint-disable-next-line no-param-reassign
          arr[index] = setData.customItems[customItemsCounter].label
          break
        case replaceKeys.CUSTOM_FIELD:
          // eslint-disable-next-line no-param-reassign
          arr[index] = setData.customItems[customItemsCounter].value
          customItemsCounter += 1
          break
        case replaceKeys.CLOTHING:
          // eslint-disable-next-line no-param-reassign
          arr[index] = setData.clothes[clothesCounter].clothing
          break
        case replaceKeys.SIZE:
          // eslint-disable-next-line no-param-reassign
          arr[index] = setData.clothes[clothesCounter].size
          break
        case replaceKeys.QUANTITY:
          // eslint-disable-next-line no-param-reassign
          arr[index] = setData.clothes[clothesCounter].quantity
          clothesCounter += 1
          break
        default:
          break
      }
    })
  })

  return data
}


/**
* Añade tantas filas de custom items y prendas necesarias para
* el ingreso de los datos.
*
**/
function prepareSetRange(range, customItemsSize, clothesSize, replaceKeys) {
  // eslint-disable-next-line no-undef
  const sheet = SpreadsheetApp.getActiveSheet()

  const newRange = range.getSheet().getRange(
    range.getRow(),
    range.getColumn(),
    // el -2 debido a que cada customItem y ClothesSize ya cuentan con una fila
    range.getHeight() + customItemsSize + (clothesSize - 2),
    range.getWidth())

  // eslint-disable-next-line no-var
  var cellRange

  // eslint-disable-next-line
  for (var i = 1; i < newRange.getHeight(); i += 1) {
    // eslint-disable-next-line
    for (var j = 1; j < newRange.getWidth(); j += 1) {
      // Logger.log( 'contadores: '+ i +' - '+ j);
      cellRange = newRange.getCell(i, j)
      // Logger.log( 'Celdas: '+ cellRange.getRow() +' - '+ cellRange.getColumn());

      // añade filas a Custom Values
      if (cellRange.getValue() === replaceKeys.CUSTOM_LABEL
         || cellRange.getValue() === replaceKeys.CUSTOM_FIELD) {
        sheet.insertRowsAfter(cellRange.getRow(), customItemsSize - 1)
        duplicateRow(cellRange.getRow(), customItemsSize - 1)
        i += customItemsSize
        break
      }


      // añade filas a clothes
      if (cellRange.getValue() === replaceKeys.CLOTHING
         || cellRange.getValue() === replaceKeys.SIZE
         || cellRange.getValue() === replaceKeys.QUANTITY) {
        sheet.insertRowsAfter(cellRange.getRow(), clothesSize - 1)
        duplicateRow(cellRange.getRow(), clothesSize - 1)
        i += clothesSize
        break
      }
    }
  }

  return newRange
}

/**
* Ejmeplo de Copia de un rango, cambia el formato y luego lo escribe
**/
// eslint-disable-next-line no-unused-vars
function createSetSigns() {
  // Espacio entre etiquetas
  const rowSpace = 1

  const sets = [
    {
      groupBy: 'Usuario',
      groupByValue: 'Juan Diaz',
      serialNumber: '123213123',
      customItems: [
        {
          label: 'Rut',
          value: '12.324.533-2',
        },
        {
          label: 'Departamento',
          value: 'Mantenimiento',
        },
      ],
      clothes: [
        {
          clothing: 'Pantalón',
          size: 'M',
          quantity: '5',
        },
        {
          clothing: 'Camisa',
          size: 'L',
          quantity: '2',
        },
        {
          clothing: 'Abrigo',
          size: 'XL',
          quantity: '3',
        },
      ],
    },
    {
      groupBy: 'Usuario',
      groupByValue: 'Gustavo Almeda',
      serialNumber: '2222222',
      customItems: [
        {
          label: 'Rut',
          value: '15.232.423-3',
        },
        {
          label: 'Departamento',
          value: 'Mantenimiento',
        },
      ],
      clothes: [
        {
          clothing: 'Pantalón',
          size: 'S',
          quantity: '2',
        },
        {
          clothing: 'Camisa',
          size: 'S',
          quantity: '2',
        },
        {
          clothing: 'Abrigo',
          size: 'S',
          quantity: '2',
        },
      ],
    },
  ]


  const replaceKeys = {
    SET_COUNTER: '{{numero_set}}',
    GROUP_BY: '{{agrupar_por}}',
    GROUP_BY_VALUE: '{{agrupar_por_valor}}',
    SERIAL_NUMBER: '{{n_correlativo}}',
    CUSTOM_LABEL: '{{custom_label}}',
    CUSTOM_FIELD: '{{custom_field}}',
    CLOTHING: '{{contenido}}',
    SIZE: '{{talla}}',
    QUANTITY: '{{cantidad}}',
  }

  const SET_SHEET = 'set'
  // eslint-disable-next-line no-undef
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const sheet = ss.getSheetByName(SET_SHEET)
  sheet.activate()

  // obtener rangos del template
  const templateRowSize = sheet.getLastRow()
  const templateColumnSize = sheet.getLastColumn()
  const templateRange = sheet.getRange(1, 1, templateRowSize, templateColumnSize)

  // Logger.log('templateRowSize: '+ templateRowSize)
  // Logger.log('templateColumnSize: '+ templateColumnSize)
  // Logger.log('newSignOffset: '+ newSignOffset)

  // eslint-disable-next-line
  var signCounter = 1
  // eslint-disable-next-line
  var offset
  // eslint-disable-next-line
  var signRange
  // eslint-disable-next-line
  var data
  // Comienza la iteración ----
  // eslint-disable-next-line
  sets.forEach( function(set) {
    // La siguiente fila (por eso más 1)
    offset = sheet.getLastRow() + 1 + rowSpace

    // Define nuevo rango de trabajo
    signRange = sheet.getRange(offset, 1, templateRowSize, templateColumnSize)

    // copia el template
    templateRange.copyTo(signRange)

    // Añade filas para campos customizados
    signRange = prepareSetRange(signRange, set.customItems.length, set.clothes.length, replaceKeys)


    // reemplaza campos por items del set y aumenta el contador
    data = signRange.getValues()
    data = replaceSetData(data, set, replaceKeys, signCounter)
    signRange.setValues(data)
    signCounter += 1
  })

  // Elimina etiqueta
  sheet.deleteRows(1, templateRowSize + rowSpace)
}

/**
* reemplaza la data con los valores del set
* param {Array[][]} data datos de un rango
* param {Object} resumeData objeto con los datos del set
*
**/
function replaceResumeData(data, resumeData, replaceKeys) {
  // eslint-disable-next-line no-var
  var clothesCounter = 0

  // eslint-disable-next-line
  data.forEach(function(row) {
    // eslint-disable-next-line
    row.forEach(function (cell, index, arr) {
      switch (cell) {
        case replaceKeys.PROVIDER:
          // eslint-disable-next-line no-param-reassign
          arr[index] = resumeData.provider
          break
        case replaceKeys.ORDER_NUMBER:
          // eslint-disable-next-line no-param-reassign
          arr[index] = resumeData.orderNumber
          break
        case replaceKeys.TO:
          // eslint-disable-next-line no-param-reassign
          arr[index] = resumeData.to
          break
        case replaceKeys.CLOTHING:
          // eslint-disable-next-line no-param-reassign
          arr[index] = resumeData.clothes[clothesCounter].clothing
          break
        case replaceKeys.SIZE:
          // eslint-disable-next-line no-param-reassign
          arr[index] = resumeData.clothes[clothesCounter].size
          break
        case replaceKeys.QUANTITY:
          // eslint-disable-next-line no-param-reassign
          arr[index] = resumeData.clothes[clothesCounter].quantity
          clothesCounter += 1
          break
        default:
          break
      }
    })
  })

  return data
}


/**
* Añade tantas filas de custom items y prendas necesarias para
* el ingreso de los datos.
*
**/
function prepareResumeRange(range, clothesSize, replaceKeys) {
  // eslint-disable-next-line no-undef
  const sheet = SpreadsheetApp.getActiveSheet()

  const newRange = range.getSheet().getRange(
    range.getRow(),
    range.getColumn(),
    // el -1 debido a que cada ClothesSize ya cuenta con una fila
    range.getHeight() + (clothesSize - 1),
    range.getWidth())

  // eslint-disable-next-line no-var
  var cellRange

  // eslint-disable-next-line
  for (var i = 1; i < newRange.getHeight(); i += 1) {
    // eslint-disable-next-line
    for (var j = 1; j < newRange.getWidth(); j += 1) {
      // Logger.log( 'contadores: '+ i +' - '+ j);
      cellRange = newRange.getCell(i, j)
      // Logger.log( 'Celdas: '+ cellRange.getRow() +' - '+ cellRange.getColumn());

      // añade filas a clothes
      if (cellRange.getValue() === replaceKeys.CLOTHING
         || cellRange.getValue() === replaceKeys.SIZE
         || cellRange.getValue() === replaceKeys.QUANTITY) {
        sheet.insertRowsAfter(cellRange.getRow(), clothesSize - 1)
        duplicateRow(cellRange.getRow(), clothesSize - 1)
        i += clothesSize
        break
      }
    }
  }

  return newRange
}

/**
* Crea etiquetas de caja
**/
// eslint-disable-next-line no-unused-vars
function createResumeSign() {
  // Espacio entre etiquetas
  const rowSpace = 1

  const resume = {
    provider: 'Antuan',
    orderNumber: '2313131',
    to: 'Latam',
    clothes: [
      {
        clothing: 'Pantalón',
        size: 'M',
        quantity: '5',
      },
      {
        clothing: 'Camisa',
        size: 'L',
        quantity: '2',
      },
      {
        clothing: 'Abrigo',
        size: 'XL',
        quantity: '3',
      },
    ],
  }

  const replaceKeys = {
    PROVIDER: '{{proveedor}}',
    ORDER_NUMBER: '{{orden_compra}}',
    TO: '{{destinatario}}',
    CLOTHING: '{{contenido}}',
    SIZE: '{{talla}}',
    QUANTITY: '{{cantidad}}',
  }

  const RESUME_SHEET = 'resumen'
  // eslint-disable-next-line no-undef
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const sheet = ss.getSheetByName(RESUME_SHEET)
  sheet.activate()

  // obtener rangos del template
  const templateRowSize = sheet.getLastRow()
  const templateColumnSize = sheet.getLastColumn()
  const templateRange = sheet.getRange(1, 1, templateRowSize, templateColumnSize)

  // Logger.log('templateRowSize: '+ templateRowSize)
  // Logger.log('templateColumnSize: '+ templateColumnSize)
  // Logger.log('newSignOffset: '+ newSignOffset)

  // eslint-disable-next-line
  var offset
  // eslint-disable-next-line
  var signRange
  // eslint-disable-next-line
  var data
  // Comienza la iteración ----
  // eslint-disable-next-line

  // La siguiente fila (por eso más 1)
  offset = sheet.getLastRow() + 1 + rowSpace

  // Define nuevo rango de trabajo
  signRange = sheet.getRange(
  offset,
  1,
  templateRowSize,
  templateColumnSize)

  // copia el template
  templateRange.copyTo(signRange)

  // Añade filas para campos customizados
  signRange = prepareResumeRange(
  signRange,
  resume.clothes.length,
  replaceKeys)


  // reemplaza campos por items del set y aumenta el contador
  data = signRange.getValues()
  data = replaceResumeData(data, resume, replaceKeys)
  signRange.setValues(data)


  // Elimina etiqueta
  sheet.deleteRows(1, templateRowSize + rowSpace)
}
