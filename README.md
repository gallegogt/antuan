# antuan

> Front-end antuan

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

For detailed explanation on how things work, consult the [docs for vue-loader](http://vuejs.github.io/vue-loader).

## TODO:

* Completar los selectores desde una función asincrónica.
* Esconder las opciones cuando "No contiene set este marcada"


# HOw-to

1.- Se debe generar un certificado en el servidor para comunicar por https

    openssl req  -nodes -new -x509  -keyout server.key -out server.cert

2.- levantar servidor con https
http-server -p 9993 -S  -C server.cert -K server.key

3.- Añadir los script desde el servidor

    <!DOCTYPE html>
    <html>
      <head>
        <base target="_top">
        <!-- Styles -->
        <link rel="stylesheet" href="https://ssl.gstatic.com/docs/script/css/add-ons1.css">
        <link rel="stylesheet" href="https://192.168.51.112:9993/static/css/app.5d87985a219200a51702720ec9ebc59c.css">
      </head>
      <body>
        <div id="app"></div>
        <!-- Scripts -->
        <script src="https://192.168.51.112:9993/static/js/app.059b488ce8d44238c62f.js"> </script>
      </body>
    </html>