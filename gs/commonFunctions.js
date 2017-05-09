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
