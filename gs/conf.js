{
    sheetColumns: [
        {
            col: 1.0,
            colLabel: "Nº Correlativo"
        },
        {
            col: 2.0,
            colLabel: "Usuario"
        },
        {
            col: 3.0,
            colLabel: "Rut"
        },
        {
            col: 4.0,
            colLabel: "local"
        },
        {
            col: 5.0,
            colLabel: "Tipo"
        },
        {
            col: 6.0,
            colLabel: "Sap Nuevo"
        },
        {
            col: 7.0,
            colLabel: "Prenda"
        },
        {
            col: 8.0,
            colLabel: "Talla"
        },
        {
            col: 9.0,
            colLabel: "Ctd.solicitada"
        },
        {
            col: 10.0,
            colLabel: "proveedor"
        }
    ],
    clothingInfo: {
      colClothing: 7,
      colSize: 8,
      colAmount: 9
    },
    set: {
      id: "set_01",
      groupBy: 2,
      correlativeNumber: 6,
      customElements:[
        {
          label: "Rut",
          value: 3,
          isRelativeByColumn: true

        },
        {
          label: "Departamento",
          value: "Mantenimiento",
          isRelativeByColumn: false
        }
      ]
    },
    boxes:{
      id: "box_01",
      setsAmount: 2,
      provider: "Antuan",
      receiver: "Latam",
      purchase_order: "1231123",
      customElements:[
        {
          label: "Local",
          value: 4,
          isRelativeByColumn: true

        },
        {
          label: "Departamento",
          value: "Mantenimiento",
          isRelativeByColumn: false
        }
      ]
    }
}