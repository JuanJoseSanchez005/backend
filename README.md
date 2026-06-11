# Final Backend - API REST (Express & MongoDB)

Esta es una API RESTful desarrollada con **Node.js**, **Express** y **MongoDB/Mongoose** para gestionar usuarios, productos y órdenes. Incluye lógica avanzada para el control de inventario (stock) y cálculo automático de totales de compra.

---

## 🛠️ Tecnologías Utilizadas

* **Node.js**: Entorno de ejecución para JavaScript.
* **Express.js**: Framework web rápido y minimalista para el backend.
* **MongoDB**: Base de datos NoSQL documental.
* **Mongoose**: Modelado de objetos (ODM) para MongoDB.
* **Nodemon**: Herramienta de desarrollo que reinicia automáticamente la aplicación ante cambios.
* **Dotenv**: Gestión de variables de entorno.

---

## 📂 Estructura del Proyecto

```text
Final_backend/
├── config/
│   └── db.js                 # Conexión a la base de datos MongoDB
├── controllers/
│   ├── userController.js     # Controlador para Users
│   ├── productController.js  # Controlador para Products
│   └── orderController.js    # Controlador para Orders (Validaciones, Stock, Total)
├── middleware/
│   └── errorHandler.js       # Middleware de manejo de errores (placeholder)
├── models/
│   ├── User.js               # Modelo de Usuario
│   ├── Product.js            # Modelo de Producto
│   └── Order.js              # Modelo de Orden
├── routes/
│   ├── userRoutes.js         # Rutas de usuarios (/api/users)
│   ├── productRoutes.js      # Rutas de productos (/api/products)
│   └── orderRoutes.js        # Rutas de órdenes (/api/orders)
├── .env                      # Variables de entorno (puerto, base de datos)
├── .gitignore                # Archivos ignorados por Git
├── app.js                    # Configuración e inicialización de Express
├── server.js                 # Punto de entrada principal (inicio del servidor)
├── package.json              # Configuración y dependencias del proyecto
└── README.md                 # Documentación del proyecto
```

---

## 🚀 Instalación y Configuración

### 1. Clonar o descargar el repositorio
Descarga los archivos del proyecto a tu máquina local.

### 2. Instalar dependencias
Abre una terminal en la raíz del proyecto y ejecuta:
```bash
npm install
```

### 3. Configurar variables de entorno
Crea un archivo `.env` en la raíz del proyecto (o edita el existente) con los siguientes campos:
```env
MONGODB_URI=mongodb://localhost:27017/red_social
PORT=3000
NODE_ENV=development
```

### 4. Ejecutar el servidor
* **Modo de desarrollo** (reinicios automáticos con Nodemon):
  ```bash
  npm run dev
  ```
* **Modo de producción**:
  ```bash
  npm start
  ```
El servidor se levantará en `http://localhost:3000` (o el puerto configurado en el archivo `.env`).

---

## 📡 Endpoints de la API

Todas las respuestas exitosas y de error mantienen una estructura homogénea:
* **Éxito**: `{ "exitoso": true, "datos": ... }`
* **Error**: `{ "exitoso": false, "mensaje": "...", "error": "..." }`

### 👤 Usuarios (`/api/users`)

| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| **GET** | `/api/users` | Obtiene la lista de todos los usuarios registrados. |
| **GET** | `/api/users/:id` | Obtiene un usuario específico por su ID. |
| **POST** | `/api/users` | Registra un nuevo usuario en el sistema. |
| **PUT** | `/api/users/:id` | Actualiza la información de un usuario específico. |
| **DELETE** | `/api/users/:id` | Elimina un usuario por su ID. |

**Ejemplo de cuerpo para crear/actualizar un usuario (POST/PUT):**
```json
{
  "nombre": "Carlos Gómez",
  "email": "carlos@example.com",
  "edad": 28,
  "ciudad": "Bogotá",
  "rol": "usuario"
}
```

---

### 📦 Productos (`/api/products`)

| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| **GET** | `/api/products` | Obtiene la lista de todos los productos. |
| **GET** | `/api/products/:id` | Obtiene un producto por su ID. |
| **GET** | `/api/products/categoria/:categoria` | Obtiene todos los productos de una categoría (`Electrónica`, `Ropa`, `Alimentos`, `Otros`). |
| **POST** | `/api/products` | Registra un nuevo producto. |
| **PUT** | `/api/products/:id` | Actualiza los datos de un producto. |
| **DELETE** | `/api/products/:id` | Elimina un producto. |

**Ejemplo de cuerpo para crear/actualizar un producto (POST/PUT):**
```json
{
  "nombre": "Auriculares Inalámbricos",
  "descripcion": "Auriculares bluetooth con cancelación de ruido",
  "precio": 89.99,
  "cantidad": 50,
  "categoria": "Electrónica",
  "sku": "AUD-BLU-001"
}
```

---

### 🛒 Órdenes (`/api/orders`)

| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| **GET** | `/api/orders` | Obtiene todas las órdenes (con usuarios y productos detallados). |
| **GET** | `/api/orders/:id` | Obtiene una orden específica por ID. |
| **POST** | `/api/orders` | Crea una orden, valida stock, calcula el total y actualiza inventario. |
| **PUT** | `/api/orders/:id` | Actualiza la orden (devuelve el stock si cambia a estado `cancelado`). |
| **DELETE** | `/api/orders/:id` | Elimina la orden y devuelve su stock al inventario. |

**Ejemplo de cuerpo para crear una orden (POST):**
```json
{
  "usuario": "64761a29f8f26a111a3bcd01", 
  "productos": [
    {
      "producto": "64761a3af8f26a111a3bcd05",
      "cantidad": 2
    },
    {
      "producto": "64761a41f8f26a111a3bcd09",
      "cantidad": 1
    }
  ],
  "estado": "pendiente"
}
```

#### 🛡️ Lógica de Negocio Incluida:
1. **Cálculo de Precios Seguro**: La API no requiere un campo `"total"` en el body. Éste se calcula dinámicamente multiplicando la cantidad solicitada por el precio real del producto almacenado en la base de datos.
2. **Protección de Inventario**: Al crear una orden, el sistema descuenta automáticamente la cantidad de artículos del stock disponible de cada producto. Si no hay suficiente stock, rechaza la transacción con un error `400 Bad Request` y no modifica nada.
3. **Liberación de Stock**: Si cambias el estado de una orden a `"cancelado"` o decides **eliminar** la orden (`DELETE`), el backend reintegrará la cantidad comprada de vuelta al inventario del producto de forma automática.
