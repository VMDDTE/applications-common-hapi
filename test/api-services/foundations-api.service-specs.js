/* eslint-disable no-unused-expressions */
/* eslint-disable no-new */

import { describe, it } from 'mocha'
import chai from 'chai'
import sinon from 'sinon'
import { FoundationsApiService } from '../../api-services/foundations-api.service'
import { checkForCorrelationIdHeader } from '../helpers'
import nock from 'nock'

const expect = chai.expect

describe('FoundationsApi.Service', function () {
    describe('#get', function () {
        it('should return 200 response with correct data and correlation id header was added to request', async function () {
            nock('http://test.foundationsapiservice.com')
                .get('/api/1')
                .reply(200, { 'test': 'pass' })

            const foundationsApiService = new FoundationsApiService({})

            const requestConfiguration = foundationsApiService.buildFoundationsApiRequestConfig('http://test.foundationsapiservice.com/api/1', null, null, '12345')
            const response = await foundationsApiService.get(requestConfiguration)

            checkForCorrelationIdHeader(response, '12345')

            expect(response).to.have.property('status')
            expect(response.status).to.equal(200)

            expect(response).to.have.property('data')
            expect(response.data).to.have.property('test')
            expect(response.data.test).to.equal('pass')
        })

        it('should return 400 response with correct data and error was logged', async function () {
            nock('http://test.foundationsapiservice.com')
                .get('/api/1')
                .reply(400, { 'bad': 'request' })

            let mockedLogger = {
                error: sinon.spy()
            }

            const foundationsApiService = new FoundationsApiService(mockedLogger)

            const requestConfiguration = foundationsApiService.buildFoundationsApiRequestConfig('http://test.foundationsapiservice.com/api/1')
            const response = await foundationsApiService.get(requestConfiguration)

            expect(response).to.have.property('status')
            expect(response.status).to.equal(400)

            expect(response).to.have.property('data')
            expect(response.data).to.have.property('bad')
            expect(response.data.bad).to.equal('request')

            expect(mockedLogger.error.calledOnce).to.be.true
            const loggedError = mockedLogger.error.firstCall.args[0]

            expect(loggedError).to.have.property('ApiServiceUrl')
            expect(loggedError.ApiServiceUrl).to.equal('[GET] http://test.foundationsapiservice.com/api/1')

            expect(loggedError).to.have.property('Exception')
            expect(loggedError.Exception).to.match(/^Error: Request failed with status code 400/)
        })

        it('should return 500 response with correct data and log error', async function () {
            nock('http://test.foundationsapiservice.com')
                .get('/api/1')
                .reply(500, { 'internal': 'server error' })

            let mockedLogger = {
                error: sinon.spy()
            }

            const foundationsApiService = new FoundationsApiService(mockedLogger)

            // Should log error, but not rethrow as the base does
            const requestConfiguration = foundationsApiService.buildFoundationsApiRequestConfig('http://test.foundationsapiservice.com/api/1')
            const response = await foundationsApiService.get(requestConfiguration)

            expect(response).to.have.property('status')
            expect(response.status).to.equal(500)

            expect(response).to.have.property('data')
            expect(response.data).to.have.property('internal')
            expect(response.data.internal).to.equal('server error')

            expect(mockedLogger.error.calledOnce).to.be.true
            const loggedError = mockedLogger.error.firstCall.args[0]

            expect(loggedError).to.have.property('ApiServiceUrl')
            expect(loggedError.ApiServiceUrl).to.equal('[GET] http://test.foundationsapiservice.com/api/1')

            expect(loggedError).to.have.property('Exception')
            expect(loggedError.Exception).to.match(/^Error: Request failed with status code 500/)
        })
    })

    describe('#get returnDataOnly set to true', function () {
        it('should return correct data, no response information', async function () {
            nock('http://test.foundationsapiservice.com')
                .get('/api/1')
                .reply(200, { 'test': 'pass' })

            const foundationsApiService = new FoundationsApiService({})

            const requestConfiguration = foundationsApiService.buildFoundationsApiRequestConfig('http://test.foundationsapiservice.com/api/1', null, null, '12345')
            const responseOptions = foundationsApiService.buildFoundationsApiResponseOptions(true)
            const data = await foundationsApiService.get(requestConfiguration, responseOptions)

            expect(data).not.to.have.property('status')

            expect(data).not.to.have.property('data')
            // The data should just be the expected response data, nothing else
            expect(data).to.have.property('test')
            expect(data.test).to.equal('pass')
        })

        it('should return 400 response with correct data and error was logged', async function () {
            nock('http://test.foundationsapiservice.com')
                .get('/api/1')
                .reply(400, { 'bad': 'request' })

            let mockedLogger = {
                error: sinon.spy()
            }

            const foundationsApiService = new FoundationsApiService(mockedLogger)
            const requestConfiguration = foundationsApiService.buildFoundationsApiRequestConfig('http://test.foundationsapiservice.com/api/1', null, null, true)
            const response = await foundationsApiService.get(requestConfiguration)

            expect(response).to.have.property('status')
            expect(response.status).to.equal(400)

            expect(response).to.have.property('data')
            expect(response.data).to.have.property('bad')
            expect(response.data.bad).to.equal('request')

            expect(mockedLogger.error.calledOnce).to.be.true
            const loggedError = mockedLogger.error.firstCall.args[0]

            expect(loggedError).to.have.property('ApiServiceUrl')
            expect(loggedError.ApiServiceUrl).to.equal('[GET] http://test.foundationsapiservice.com/api/1')

            expect(loggedError).to.have.property('Exception')
            expect(loggedError.Exception).to.match(/^Error: Request failed with status code 400/)
        })
    })

    describe('#health ping', function () {
        it('should return 200 response with correct data and correlation id header was added to request', async function () {
            nock('http://test.foundationsapiservice.com')
                .get('/health/ping')
                .reply(200, { 'test': 'pass' })

            const foundationsApiService = new FoundationsApiService({})

            const response = await foundationsApiService.healthPing('http://test.foundationsapiservice.com', '12345')

            checkForCorrelationIdHeader(response, '12345')

            expect(response).to.have.property('status')
            expect(response.status).to.equal(200)

            expect(response).to.have.property('data')
            expect(response.data).to.have.property('test')
            expect(response.data.test).to.equal('pass')
        })

        it('should return 400 response with correct data and error was logged', async function () {
            nock('http://test.foundationsapiservice.com')
                .get('/health/ping')
                .reply(400, { 'bad': 'request' })

            let mockedLogger = {
                error: sinon.spy()
            }

            const foundationsApiService = new FoundationsApiService(mockedLogger)

            const response = await foundationsApiService.healthPing('http://test.foundationsapiservice.com')

            expect(response).to.have.property('status')
            expect(response.status).to.equal(400)

            expect(response).to.have.property('data')
            expect(response.data).to.have.property('bad')
            expect(response.data.bad).to.equal('request')

            expect(mockedLogger.error.calledOnce).to.be.true
            const loggedError = mockedLogger.error.firstCall.args[0]

            expect(loggedError).to.have.property('ApiServiceUrl')
            expect(loggedError.ApiServiceUrl).to.equal('[GET] http://test.foundationsapiservice.com/health/ping')

            expect(loggedError).to.have.property('Exception')
            expect(loggedError.Exception).to.match(/^Error: Request failed with status code 400/)
        })

        it('should return 500 response with correct data and log error', async function () {
            nock('http://test.foundationsapiservice.com')
                .get('/health/ping')
                .reply(500, { 'internal': 'server error' })

            let mockedLogger = {
                error: sinon.spy()
            }

            const foundationsApiService = new FoundationsApiService(mockedLogger)

            // Should log error, but not rethrow as the base does
            const response = await foundationsApiService.healthPing('http://test.foundationsapiservice.com')

            expect(response).to.have.property('status')
            expect(response.status).to.equal(500)

            expect(response).to.have.property('data')
            expect(response.data).to.have.property('internal')
            expect(response.data.internal).to.equal('server error')

            expect(mockedLogger.error.calledOnce).to.be.true
            const loggedError = mockedLogger.error.firstCall.args[0]

            expect(loggedError).to.have.property('ApiServiceUrl')
            expect(loggedError.ApiServiceUrl).to.equal('[GET] http://test.foundationsapiservice.com/health/ping')

            expect(loggedError).to.have.property('Exception')
            expect(loggedError.Exception).to.match(/^Error: Request failed with status code 500/)
        })
    })
})
