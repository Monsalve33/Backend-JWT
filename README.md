# Gestion Monetaria Backend

API REST construida con Express y MongoDB para autenticacion con JWT y gestion de pedidos protegidos. Este servicio expone endpoints para registro, inicio de sesion y operaciones CRUD sobre pedidos.

## Vista General

El backend resuelve tres piezas principales:

- Registro e inicio de sesion de usuarios.
- Proteccion de rutas mediante `Bearer Token`.
- CRUD de pedidos almacenados en MongoDB.

Ademas incluye validaciones con `express-validator`, control de CORS y endpoint de salud para monitoreo rapido.

## Stack Tecnologico

- Node.js
- Express 5
- MongoDB con Mongoose
- JSON Web Token
- bcryptjs
- express-validator
- cors
- morgan
- nodemon

## Estructura Principal

```text
src/
|- controllers/
|  |- auth.controller.js
|  \- publicacion.controller.js
|- middleware/
|  \- auth.middleware.js
|- models/
|  |- Publicacion.js
|  \- User.js
|- routes/
|  |- auth.routes.js
|  \- Publicacion.routes.js
|- validators/
|  \- publicacion.validator.js
|- app.js
|- server.js
\- seed.auth.js
```

## Requisitos

- Node.js 18 o superior
- npm 9 o superior
- Base de datos MongoDB accesible

## Instalacion

```bash
npm install
```

## Variables De Entorno

Crea un archivo `.env` en la carpeta `Backend` con una configuracion similar a esta:

```env
PORT=3000
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/nombre-db
JWT_SECRET=tu_clave_secreta
JWT_EXPIRES_IN=1d
CORS_ORIGIN=http://localhost:5173,http://localhost:5174
NODE_ENV=development
```

Notas:

- `CORS_ORIGIN` acepta varios origenes separados por coma.
- El proyecto ya permite `localhost` dinamico y el dominio `https://gestion-monetaria.vercel.app`.
- Todas las rutas de pedidos requieren un JWT valido.

## Scripts Disponibles

```bash
npm run dev
npm start
```

## Puesta En Marcha

```bash
npm run dev
```

Si la conexion a MongoDB es correcta, el servidor queda disponible en:

```text
http://localhost:3000
```

o en el puerto definido por `PORT`.

## Endpoints

### Salud

- `GET /health`

Respuesta esperada:

```json
{
  "ok": true,
  "service": "pedidos-api"
}
```

### Autenticacion

- `GET /api/auth`
- `POST /api/auth/register`
- `POST /api/auth/login`

Ejemplo de registro o login:

```json
{
  "email": "usuario@correo.com",
  "password": "123456"
}
```

Respuesta exitosa:

```json
{
  "token": "jwt_aqui",
  "user": {
    "id": "mongo_id",
    "email": "usuario@correo.com",
    "role": "user"
  }
}
```

### Pedidos Protegidos

Estas rutas requieren encabezado:

```http
Authorization: Bearer <token>
```

Endpoints:

- `GET /api/pedidos`
- `POST /api/pedidos`
- `GET /api/pedidos/:id`
- `PUT /api/pedidos/:id`
- `DELETE /api/pedidos/:id`

Ejemplo de creacion:

```json
{
  "cliente_id": 1001,
  "estado": "Pendiente",
  "items": [
    {
      "producto_id": 501,
      "cantidad": 2,
      "precio_unitario": 15000
    }
  ]
}
```

Comportamiento importante:

- El backend calcula `total` automaticamente a partir de `cantidad * precio_unitario`.
- El campo `estado` debe ser uno de estos valores:
  `Pendiente`, `Procesando`, `Enviado`, `Entregado`, `Cancelado`.
- La lista de pedidos soporta `q`, `page` y `limit` como parametros de consulta.

Ejemplo:

```text
GET /api/pedidos?q=pendiente&page=1&limit=10
```

## Validaciones

El backend valida:

- `cliente_id` entero mayor a `0`
- `items` como arreglo con minimo un elemento
- `producto_id` entero mayor a `0`
- `cantidad` entera mayor a `0`
- `precio_unitario` numerico mayor o igual a `0`
- `id` con formato MongoDB valido

## Seguridad

- Passwords cifrados con `bcryptjs`
- JWT firmado con `JWT_SECRET`
- Middleware `protect` para rutas privadas
- Limpieza basica de acceso por CORS

## Integracion Recomendada Con El Frontend

El frontend espera esta base de URL mediante `VITE_API_URL`:

```text
http://localhost:3000
```

Si frontend y backend corren en local, una configuracion comun es:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`

## Estado Actual

- No hay suite de pruebas automatizadas incluida por ahora.
- No existe archivo `.env.example` en el proyecto.
- El README documenta la estructura y comportamiento observados en el codigo actual.
