/**
 * Creates a menu entry in the Google Docs UI when the document is opened.
 * This method is only used by the regular add-on, and is never called by
 * the mobile add-on version.
 *
 * @param {object} e The event parameter for a simple onOpen trigger. To
 *     determine which authorization mode (ScriptApp.AuthMode) the trigger is
 *     running in, inspect e.authMode.
 */
function onOpen(e) {
  SpreadsheetApp.getUi()
      .createAddonMenu()
      .addItem('Transponer columnas', 'showNormalizeView')
      .addItem('Generador', 'showWizzard')
      .addToUi();


}

/**
 * Runs when the add-on is installed.
 * This method is only used by the regular add-on, and is never called by
 * the mobile add-on version.
 *
 * @param {object} e The event parameter for a simple onInstall trigger. To
 *     determine which authorization mode (ScriptApp.AuthMode) the trigger is
 *     running in, inspect e.authMode. (In practice, onInstall triggers always
 *     run in AuthMode.FULL, but onOpen triggers may be AuthMode.LIMITED or
 *     AuthMode.NONE.)
 */
function onInstall(e) {
  onOpen(e);
}

/**
 * Muestra la vista de los componentes para la normalización
 */
function showNormalizeView() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var htmlOutput = HtmlService
    .createTemplateFromFile('normalize')
    .evaluate()
    .setWidth(300)
    .setHeight(130);

  SpreadsheetApp
    .getUi()
    .showModelessDialog(htmlOutput, 'Columnas seleccionadas');
}


/**
 * Displays an HTML-service dialog in Google Sheets that contains client-side
 * JavaScript code for the Google Picker API.
 */
function showWizzard() {
  var html = HtmlService.createTemplateFromFile('wizzard_generador')
      .evaluate()
      .setWidth(600)
      .setHeight(425)
      .setSandboxMode(HtmlService.SandboxMode.IFRAME)
  SpreadsheetApp.getUi().showModalDialog(html, 'Generador carteles');
}

/**
 * Function auxiliar para incluir los distintos fragmentos
 * Ejemplo archivos CSS y JS
 * @return {String} Devuelve un HTML en forma de cadena
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}

/**
* Obtiene la primera columna de una sheet
* @return array
**/
function getLabelsActiveSheet(){
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var values = sheet.getSheetValues(1, 1, 1, sheet.getLastColumn());
  return values[0];
}



/**
 * Devuelve Notacion del rango seleccionado
 *
 * @return {String}
 */
function getActiveRange() {
  return SpreadsheetApp
    .getActiveSheet()
    .getActiveRange()
    .getA1Notation();
}

/**
 * Crea la hoja de calculo normalizada, con los datos pasados por
 * parámetros
 *
 * @param {String} jsonData cadena de texto con formato de tipo JSON
 * @return {int} 0
 */
function createSheetNormalized(jsonData) {
  var ss = SpreadsheetApp.getActiveSpreadsheet()
  var normalizedSheet = ss.getSheetByName("Normalizado")

  if(normalizedSheet == null) {
    normalizedSheet = ss.insertSheet('Normalizado');
  }
  var data = JSON.parse(jsonData);
  var range = normalizedSheet.getRange(1,1, data.length, data[0].length);
  range.setValues(JSON.parse(jsonData));
  ss.setActiveSheet(normalizedSheet);
  return 0;
}

/**
 * Extrae los datos a normalizar
 *
 * @param {String} rangeClothingNotation cadena en notación A1, donde
 *                 se encuentran los datos a trasponer
 * @return {Object} Objeto que contiene la información y datos a transponer
 *         {int} Object.firstCol entero que representa la primera columna
 *         {int} Object.lastCol  entero que representa la última columna
 *         {int} Object.data     Datos de la hoja de cálculo
 */
function extractRawData(rangeClothingNotation) {
  var sheet = SpreadsheetApp.getActiveSheet();
  var rangeClothing = sheet.getRange(rangeClothingNotation);
  return {
    firstCol: rangeClothing.getColumn(),
    lastCol: rangeClothing.getLastColumn(),
    data: sheet.getDataRange().getValues(),
  };
}

/**
*  Copia el contenido de las hojas 'set', 'caja' y 'resumen' en la plantilla de template
**/
// eslint-disable-next-line no-unused-vars
function copyTemplateSheets(notContainsSet) {
  // eslint-disable-next-line no-undef
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const sst = SpreadsheetApp.openById('1c3Pu6ROHZBBvXUyOkyJmFDLW6RbSz_KD9hLLCyy_ImA') // eslint-disable-line no-undef

  // copia los sheets del template al spreadsheet actual.
  if(notContainsSet){
    sst.getSheetByName('caja_no_set').copyTo(ss).setName('caja')
  } else {
    sst.getSheetByName('set').copyTo(ss).setName('set')
    sst.getSheetByName('caja').copyTo(ss).setName('caja')
    sst.getSheetByName('resumen').copyTo(ss).setName('resumen')
  }

}

/**
*  Elimina las hojas 'set', 'caja' y 'resumen'
**/
// eslint-disable-next-line no-unused-vars
function deleteSignSheets() {
  // eslint-disable-next-line no-undef
  const ss = SpreadsheetApp.getActiveSpreadsheet()

  if(ss.getSheetByName('set') !== null) {
    ss.deleteSheet(ss.getSheetByName('set'))
  }

  if(ss.getSheetByName('caja') !== null){
    ss.deleteSheet(ss.getSheetByName('caja'))
  }

  if(ss.getSheetByName('resumen') !== null){
    ss.deleteSheet(ss.getSheetByName('resumen'))
  }


}


/**
Obtiene la primera columna de una sheet
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
      index: index + 1,
      label: value,
    }
  }).filter(function(data){
    return data.label.trim().length > 0
  })

  return labels
}

/**
 * Extrae todos los datos de la plantilla activa
 *
 * @return {Array[]} Array con arreglo de filas del sheet activo.
 */
function getDataFromActiveSheet() {
  // eslint-disable-next-line no-undef
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const sheet = ss.getActiveSheet()
  return sheet.getSheetValues(1, 1, sheet.getLastRow(), sheet.getLastColumn())
}


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
      cellRange = newRange.getCell(i, j)

      // añade filas a Custom Values
      if (cellRange.getValue() === replaceKeys.CUSTOM_LABEL
         || cellRange.getValue() === replaceKeys.CUSTOM_FIELD) {
        if(customItemsSize > 1){
          sheet.insertRowsAfter(cellRange.getRow(), customItemsSize - 1)
          duplicateRow(cellRange.getRow(), customItemsSize - 1)
          i += customItemsSize
          break
        } else if (customItemsSize < 1) {
          sheet.deleteRow(cellRange.getRow())
          i -= 1
          break
        }else{
          break
        }

      }


      // añade filas a clothes
      if (cellRange.getValue() === replaceKeys.CLOTHING
         || cellRange.getValue() === replaceKeys.SIZE
         || cellRange.getValue() === replaceKeys.QUANTITY) {
        if(clothesSize >1){
          sheet.insertRowsAfter(cellRange.getRow(), clothesSize - 1)
          duplicateRow(cellRange.getRow(), clothesSize - 1)
          i += clothesSize
          break
        } else if (clothesSize < 1) {
          sheet.deleteRow(cellRange.getRow())
          i -= 1
          break
        }else{
          break
        }
      }
    }
  }

  return newRange
}

/**
* Ejmeplo de Copia de un rango, cambia el formato y luego lo escribe
**/
// eslint-disable-next-line no-unused-vars
function createSetSigns(sets) {
  // Logger.log('sets:' + sets)
  // Espacio entre etiquetas
  const rowSpace = 1

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
        if(customItemsSize > 1){
          sheet.insertRowsAfter(cellRange.getRow(), customItemsSize - 1)
          duplicateRow(cellRange.getRow(), customItemsSize - 1)
          i += customItemsSize
          break
        } else if (customItemsSize < 1) {
          sheet.deleteRow(cellRange.getRow())
          i -= 1
          break
        }else{
          break
        }
      }

       // añade filas a sets
      if (cellRange.getValue() === replaceKeys.GROUP_BY_VALUE
         || cellRange.getValue() === replaceKeys.SERIAL_NUMBER) {
        // Logger.log('cellRange.getRow() ' + cellRange.getRow())
        // Logger.log('setsSize ' + setsSize )
        if(setsSize > 1){
          sheet.insertRowsAfter(cellRange.getRow(), setsSize - 1)
          duplicateRow(cellRange.getRow(), setsSize - 1)
          i += setsSize
          break
        } else if (setsSize < 1) {
          sheet.deleteRow(cellRange.getRow())
          i -= 1
          break
        }else{
          break
        }

      }


      // añade filas a clothes
      if (cellRange.getValue() === replaceKeys.CLOTHING
         || cellRange.getValue() === replaceKeys.SIZE
         || cellRange.getValue() === replaceKeys.QUANTITY) {
        if(clothesSize > 1){
          sheet.insertRowsAfter(cellRange.getRow(), clothesSize - 1)
          duplicateRow(cellRange.getRow(), clothesSize - 1)
          i += clothesSize
          break
         } else if (clothesSize < 1) {
          sheet.deleteRow(cellRange.getRow())
          i -= 1
          break
        }else{
          break
        }

      }
    }
  }

  return newRange
}

/**
* Crea etiquetas de caja
**/
// eslint-disable-next-line no-unused-vars
function createBoxSigns(boxes) {

  // Logger.log('--> boxes:')
  // Logger.log(boxes)

  // Espacio entre etiquetas
  const rowSpace = 1

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

    // Logger.log('--> box:')
    // Logger.log(box)

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
function createResumeSign(resume) {
  // Espacio entre etiquetas
  const rowSpace = 1

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


