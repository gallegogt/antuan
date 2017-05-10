

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
