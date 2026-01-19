# eventhub
Proyecto para el curso de Lenguajes de Programacion

## Guia de instalacion
Esta guia asume que se tiene una instalacion global de php y node.js

### Backend

1. Entrar a la carpeta backend
cd backend

Instalar dependencias de PHP:
composer install

Para que Laravel pueda leer el archivo de base de datos, PHP debe tener habilitado el driver de SQLite.

Localiza el archivo de configuración de PHP ejecutando: php --ini en la terminal.

Abre el archivo php.ini y busca las siguientes líneas. Asegúrate de que no tengan un punto y coma (;) al inicio:

extension=pdo_sqlite
extension=sqlite3

Inicia el serividor con:
php artisan serve

### Frontend

Entrar a la carpeta del frontend:
cd frontend

Instalar las dependencias de Node.js:
npm install

Correr el servidor de desarrollo:
npm run dev