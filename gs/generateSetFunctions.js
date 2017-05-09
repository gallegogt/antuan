

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
