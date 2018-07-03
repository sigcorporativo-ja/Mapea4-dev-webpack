# Mapea4-dev-webpack
Utilidad para el desarrollo de plugins en [Mapea4](https://github.com/sigcorporativo-ja/Mapea4)

**Requisitos e instalación de dependencias**

* Paquete de desarrollo Mapea4-dev.
* Gestor de paquetes [npm](https://www.npmjs.com/) (incluido en [Nodejs](https://nodejs.org/en/))

Descomprimimos el paquete de desarrollo, e instalamos dependencias  
```shell
$ npm install
```

**1.- Create plugin**  
Tarea que crea la estructura para un nuevo plugin. Solicita nombre del plugin:  
```shell
$ npm run create-plugin -- --name=miplugin
```
> :point_right:  <a> Para la guía de desarrollo, supondremos que hemos proporcionado el nombre de **'miPlugin'** </a>  

Creará la estructura de directorios y los ficheros necesarios para la construcción de un plugin dentro de la carpeta '_plugins/miplugin_'. Este plugin recién creado recibe el nombre de **arquetipo**, e incluye una funcionalidad básica de ejemplo 'Hola mundo'.

En este punto, **deberemos desarrollar la funcionalidad específica de nuestro plugin**. Para ello, la [guía de desarrollo](https://github.com/sigcorporativo-ja/Mapea4-dev/wiki) entra en detalle acerca de los métodos que lo forman y qué debe incluir cada uno.

**Pruebas**  

Aunque en su fase final un plugin se compilará y generará un único fichero js, durante la fase de desarrollo el código fuente del mismo se organiza en varios ficheros. Para poder testear el plugin:
```shell
npm start -- --name=miplugin --port=<numero-de-puerto>
```
> :point_right:
Puede hacerse `npm start -- --name=miplugin` y el puerto por defecto será 6123.

 Este comando levantará un entorno de desarrollo que recargará la compilación de webpack automáticamente por cada vez que actualicemos el código de '_plugins/miplugin_'. El fichero html lo podemos encontrar en '_plugins/miplugin/test/dev.html_' donde escribiremos el código de pruebas para testear nuestro plugin. En el navegador accedemos a:

```html
http://localhost:6123
```  
Y se nos abrirá la página _'dev.html'_.


**2.- Check plugin**  
Tarea para validar código con [ESLint](https://eslint.org/):
```shell
$ npm run check-plugins
```
También se facilita un script de npm para arreglar la mayoría de los erorres de typing que se cometen mientras se desarrolla.

```shell
$ npm run fix-plugins
```

**3.- Build plugin**  
Compila y minimiza los plugins creados. Aunque el plugin está compuesto por varios ficheros javascript y de estilo, para mejorar la eficiencia en su uso, la versión final de los plugins se compila y comprime, generando un único fichero css y un único fichero js:
```shell
$  npm run build -- --names=miplugin
```
En caso de que queramos compilar todos los plugins que hayamos creado podemos hacer:

```
$ npm run build
```

Se generará en la carpeta 'build/miplugin' los ficheros _css_ y _js_ comprimidos finales.

> :point_right: En caso de que tuviéramos plugin1,  plugin2 y plugin3 y solo quisieramos compilar dos de ellos podríamos hacer `npm run build -- --names=plugin1,plugin2`.

En caso de que queramos testear en modo producción solo tendremos que hacer:
```shell
npm run test-build -- --name=miplugin
```
Esto levantará un http-server que tiene como root '_plugins/_' y donde encotraremos el fichero html '_prod.html_' en la carpeta '_src/tests_'.
> :point_right:
Importante haber hecho antes `npm run build` o `npm run build -- --name=miplugin` o no tendremos creada la compilación del plugin, que es donde apunta

> :point_right:
Los comandos son case-insensitive excepto el comando de create-plugin, cuyo párametro name será exactamente el nombre de las clases creadas en el arquetipo. Esto quiere decir que no importa hacer `npm run build -- --names=miPlugin` o `npm run build -- --names=Miplugin`.
