<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Ejecutar en desarrollo

1. Clonar el repositorio

```
git clone https://github.com/Moorenow/pokedex.git
```

2. Ejecutar

```
pnpm install
```

3. Tener Nest CLI instalado

```
npm i g @nestjs/cli
```

4. Clonar el archivo __.env.template__ y renombrar la copia a __.env__


5. Llenar las variables de entorno definidas en el __.env__


6. Levantar la base de datos

```
docker-compose up -d
```

7. Ejecutar proyecto de manera local

```
pnpm start:dev
```

8. Reconstruir la base de datos con el seeder

```
http://localhost:3000/api/v2/seed
```

## Stack usado
* Mongo DB
* Nest js