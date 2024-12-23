<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

### 1. Instalar dependencias
```bash
$ npm install
```

### 2. Configurar el entorno
Copia el archivo `.env.example` a `.env`. Esto configuración las variables de entorno necesarias para el funcionamiento de la aplicación:

```bash
$ cp .env.example .env
```

> **Nota**: Asegúrate de editar las variables necesarias en el archivo `.env`, como las URIs de la base de datos y las llaves secretas.

---

## Initialize the application

Una vez configurado el entorno, inicializa la base de datos, aplica migraciones y ejecuta los seeders:

```bash
$ npm run app:init
```

Este comando realiza lo siguiente:
- Aplica migraciones a la base de datos.
- Inserta datos iniciales (seeders), incluyendo usuarios predeterminados.

---

## Usuarios por defecto

Después de ejecutar los seeders, puedes ingresar con las siguientes credenciales:

| Usuario       | Contraseña         |
|---------------|--------------------|
| **john_doe**  | securePassword123  |
| **jane_doe**  | securePassword123  |

---

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

Una vez ejecutado, la consola mostrará la URL de la aplicación (por defecto: `http://localhost:3000`).

---

## Uso de la aplicación

### Documentación de la API

Los endpoints disponibles se encuentran en el archivo api_doc, mismo que se deberá importar en Insomnia
```

---

## Configuración de Insomnia para probar la API

### Variables de entorno en Insomnia

Registra las siguientes variables de entorno en Insomnia para facilitar las peticiones:

| Nombre       | Valor                                  |
|--------------|----------------------------------------|
| **base_url** | `http://localhost:3000/api`           |
| **token**    | *(Token obtenido tras login exitoso)*  |
| **base_ws**  | `ws://localhost:3000`                 |
| **host**     | `http://localhost:3000`               |

**Ejemplo de configuración en Insomnia**:

1. Ve a **Manage Environments**.
2. Añade las variables anteriores con sus respectivos valores.
3. Guarda la configuración y realiza tus pruebas.

---

## Validación del funcionamiento

1. **Login**: Realiza una petición `POST` a `base_url/auth/login` con las credenciales:
   ```json
   {
     "username": "john_doe",
     "password": "securePassword123"
   }
   ```
   Obtendrás un token JWT.

2. **Acceso protegido**: Prueba los endpoints protegidos usando el token obtenido en el encabezado:
   ```
   Authorization: Bearer <token>
   ```

---

## Soporte

Si encuentras algún problema durante la configuración, asegúrate de:
- Verificar las variables de entorno en el archivo `.env`.
- Confirmar que la base de datos está configurada correctamente y accesible.
- Revisar la consola para identificar errores detallados.

---

