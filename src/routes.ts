import express, {Response} from 'express'
import { applyTranslation, fetchPokemon, translatePokemon } from './pokemon'

export const app = express()

const errorHandler = (res: Response, status = 500, message = 'Oops! Something went wrong while fetching your pokemon data') => {
  return res.status(status).send({
    status,
    message
  })
}

app.get('/pokemon/:name', (req, res) => {
  const {params: {name}} = req
  fetchPokemon(name).then((pokemon) => {
    if(pokemon === undefined) {
      return errorHandler(res)
    }

    return res.send(pokemon)
  }).catch((err: TypeError | number) => {
    return typeof err === 'number'
      ? errorHandler(res, err)
      : errorHandler(res, 500, err.message)
  })
})

app.get('/pokemon/translated/:name', (req, res) => {
  const {params: {name}} = req
  fetchPokemon(name)
    .then((pokemonOrVoid) => pokemonOrVoid === undefined ? Promise.reject(500) : pokemonOrVoid)
    .then(applyTranslation)
    .then(translatePokemon)
    .then((pokemon) => res.send(pokemon))
    .catch((err: TypeError) => {
      return typeof err.message === 'number'
        ? errorHandler(res, err.message)
        : errorHandler(res, 500, err.message)
    })
})
