function processBoxes(data, sets, confData){

  var provider = confData.boxes.provider
  var receiver = confData.boxes.receiver
  var setsAmount = confData.boxes.setsAmount
  var purchaseOrder = confData.boxes.purchaseOrder
  var boxCounter = 0

  var setGroups = []
  var setGroup = []

  // Divide el arreglo de sets en sub arreglos
  sets.forEach(function(set){
    //Logger.log('boxCounter: ' + boxCounter)
    //Logger.log('setsAmount: ' + setsAmount)
    if(boxCounter % setsAmount === 0){
      setGroup = []
      setGroups.push(setGroup)
    }
    setGroup.push(set)
    //Logger.log('setGroup.length: ' + setGroup.length)
    boxCounter += 1
  })

  //Logger.log('setGroups.length:' + setGroups.length)

  // Genera el contenido de Box en función de los sets
  var boxes = setGroups.map(function(sets){
    var box = {}

    //Define los items fijos
    box.provider = provider
    box.to = receiver
    box.orderNumber = purchaseOrder

    //define los customItems a partir de la primera fila
    box.customItems = getCustomItems(sets[0].rows, confData.boxes.customElements)


    // Utiliza los sets arreglos requeridos
    var rows = [] //arreglo para agrupar prendas
    var setItems = [] //arreglo para contenido del set de los ítems.
    sets.forEach(function(set){
      setItems.push(
        {
          groupByValue: set.groupByValue,
          serialNumber: set.serialNumber
        }
      )
      rows = rows.concat(set.rows)
    })

    //añade arreglo de los sets al objeto boxes
    box.sets = setItems;

    //Define arreglo de prendas
    box.clothes = groupClothes(
      rows,
      confData.clothingInfo.colClothing - 1,
      confData.clothingInfo.colSize - 1,
      confData.clothingInfo.colAmount - 1
    )


    return box
  })

  Logger.log(boxes)

}