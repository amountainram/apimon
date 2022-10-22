import type {Server, IncomingMessage, ServerResponse} from 'http'
import chai, {expect} from 'chai'
import chaiHttp from 'chai-http'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import {app} from '../src/routes'
import axios from 'axios'

chai.use(chaiHttp)
chai.use(sinonChai)

describe('Books', () => {
  let server: Server<typeof IncomingMessage, typeof ServerResponse>
  before(() => {
    server = app.listen()
  })
  after(() => {
    server.close()
  })

  describe('/GET pokemon', () => {
    it('it should GET a ditto', (done) => {
      chai.request(server)
        .get('/pokemon/ditto')
        .end((_, res) => {
          expect(res).to.have.status(200)

          expect(res.body).to.have.property('name', 'ditto')
          expect(res.body).to.have.property('is_legendary', false)
          expect(res.body).to.have.property('habitat', 'urban')
          
          expect(res.body).to.have.property('description')
          
          done()
        })
    })

    it('it should GET a rare pokemon', (done) => {
      chai.request(server)
        .get('/pokemon/mewtwo')
        .end((_, res) => {
          expect(res).to.have.status(200)

          expect(res.body).to.have.property('is_legendary', true)
          
          done()
        })
    })
  })

  describe('/GET translated pokemon', () => {
    it('it should GET a translated ditto', (done) => {
      const sandbox = sinon.createSandbox()
      const axiosSpy = sandbox.spy(axios, 'get')
      chai.request(server)
        .get('/pokemon/translated/ditto')
        .end((_, res) => {
          expect(res).to.have.status(200)

          expect(res.body).to.have.property('name', 'ditto')
          expect(res.body).to.have.property('is_legendary', false)
          expect(res.body).to.have.property('habitat', 'urban')
          
          expect(res.body).to.have.property('description')
          
          expect(axiosSpy).to.be.calledTwice
          expect(axiosSpy).to.be.calledWith('https://pokeapi.co/api/v2/pokemon-species/ditto')
          expect(axiosSpy).to.be.calledWith(
            'https://api.funtranslations.com/translate/shakespeare.json?text=Capable%2520of%2520copying%250Aan%2520enemy%27s%2520genetic%250Acode%2520to%2520instantly%250Ctransform%2520itself%250Ainto%2520a%2520duplicate%250Aof%2520the%2520enemy.'
          )

          sandbox.restore()
          done()
        })
    })

    it('it should GET a translated mewtwo', (done) => {
      const sandbox = sinon.createSandbox()
      const axiosSpy = sandbox.spy(axios, 'get')
      chai.request(server)
        .get('/pokemon/translated/mewtwo')
        .end((_, res) => {
          expect(res).to.have.status(200)

          expect(res.body).to.have.property('is_legendary', true)
          
          expect(axiosSpy).to.be.calledTwice
          expect(axiosSpy).to.be.calledWith('https://pokeapi.co/api/v2/pokemon-species/mewtwo')
          expect(axiosSpy).to.be.calledWith(
            'https://api.funtranslations.com/translate/yoda.json?text=It%2520was%2520created%2520by%250Aa%2520scientist%2520after%250Ayears%2520of%2520horrific%250Cgene%2520splicing%2520and%250ADNA%2520engineering%250Aexperiments.'
          )

          sandbox.restore()
          done()
        })
    })
  })
})
