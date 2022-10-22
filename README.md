# apimon

Apimon is an API to gather info on Pokemons

## How to install

### From source code

You might need to install `node` on your local machine. We recommend version 16+,
possibly using a version manager like `nvm`

```shell
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.2/install.sh | bash
nvm install lts/gallium
corepack enable
```

then initialize your environment

```shell
yarn install
```

and run your server on port 5000 

```shell
yarn start
```

and test it with a cURL

```shell
curl -X GET http://localhost:5000/pokemon/ditto
```

### As a docker container

apimon is shipped with a tiny `Dockerfile`. Get a version of docker on your local machine by
following the [procedure](https://docs.docker.com/engine/install/ubuntu/#install-using-the-repository)
then build

```shell
docker build --tag apimon:latest .
```

and run

```shell
docker run -d -p 5000:5000 apimon:latest
```

and test it with a cURL

```shell
curl -X GET http://localhost:5000/pokemon/ditto
```

