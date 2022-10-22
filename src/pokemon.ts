import axios, { AxiosResponse } from "axios"

interface IncomingPokemon {
  name: string,
  flavor_text_entries: [{flavor_text: string}],
  habitat: {name: string},
  is_legendary: boolean
}

export interface Pokemon {
  name: string,
  description: string,
  habitat: string,
  is_legendary: boolean
}

function isIncomingPokemon<T extends IncomingPokemon> (input: unknown): input is T {
  let inputObject = input as Record<string, unknown>
  if(typeof input !== 'object' || input === null) {
    return false
  }

  if(inputObject.name === undefined || typeof inputObject.name !== 'string') {
    return false
  }

  if(!Array.isArray(inputObject.flavor_text_entries) || typeof inputObject.flavor_text_entries[0]?.flavor_text !== 'string') {
    return false
  }

  if(
    inputObject.habitat === undefined
      || typeof inputObject.habitat !== 'object'
      || typeof (inputObject.habitat as Record<string, unknown>).name !== 'string'
  ) {
    return false
  }

  if(inputObject.is_legendary === undefined || typeof inputObject.is_legendary !== 'boolean') {
  console.log('here')
    return false
  }

  return true
}

const pokemonApiUrl = 'https://pokeapi.co/api/v2/pokemon-species/'

export const fetchPokemon = (name: string): Promise<Pokemon | void> => axios.get(`${pokemonApiUrl}${name}`)
  .then(({data}) => data)
  .then((pokemon) => {
    if(isIncomingPokemon<Record<string, unknown> & IncomingPokemon>(pokemon)) {
      return {
        name: pokemon.name,
        description: pokemon.flavor_text_entries[0].flavor_text,
        habitat: pokemon.habitat.name,
        is_legendary: pokemon.is_legendary
      }
    }
  }
)

const yodaApiUrl = 'https://api.funtranslations.com/translate/yoda.json'
const shakespeareApiUrl = 'https://api.funtranslations.com/translate/shakespeare.json'

export const applyTranslation = async (pokemon: Pokemon): Promise<[AxiosResponse<any, any>, Pokemon]> => {
  const applyYoda = pokemon.habitat === 'cave' || pokemon.is_legendary
  const url = applyYoda ? new URL(yodaApiUrl) : new URL(shakespeareApiUrl)
  url.searchParams.set('text', encodeURIComponent(pokemon.description))

  return Promise.all([axios.get(url.href).then(({data}) => data).catch(() => pokemon), pokemon])
}

export const translatePokemon = async ([translation, pokemon]: [unknown, Pokemon]): Promise<Pokemon> => {
  let inputObject = translation as Record<string, unknown> | undefined
  let contents = inputObject?.contents as Record<string, unknown> | undefined
  if(
    typeof translation !== 'object'
      || translation === null
      || typeof inputObject?.contents !== 'object'
      || inputObject.contents === null
  ) {
    return pokemon
  }

  return typeof contents?.translated === 'string' ? {...pokemon, description: contents.translated} : pokemon
}


