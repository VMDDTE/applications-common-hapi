/* eslint-disable no-unused-expressions */
/* eslint-disable jest/valid-expect */
/* eslint-disable no-new */
/* eslint-disable jest/no-disabled-tests */
/* eslint-disable jest/expect-expect */

import chai from 'chai'
import sinon from 'sinon'
import { FoundationsApiService } from '../../api-services/foundations-api.service'
import { checkForCorrelationIdHeader } from '../helpers'

import nock from 'nock'

const expect = chai.expect

describe('FoundationsApi.Service', function () {
    describe('#get', function () {
        it('should return 200 response with correct data, but correlation id header is added', async function () {
            nock('http://test.foundationsapiservice.com')
                .get('/api/1')
                .reply(200, { 'test': 'pass' })

            const foundationsApiService = new FoundationsApiService({})

            const response = await foundationsApiService.get('http://test.foundationsapiservice.com/api/1', '12345')

            checkForCorrelationIdHeader(response, '12345')

            expect(response).to.have.property('status')
            expect(response.status).to.equal(200)

            expect(response).to.have.property('data')
            expect(response.data).to.have.property('test')
            expect(response.data.test).to.equal('pass')
        })

        it('should return 400 response with correct data and log error', async function () {
            nock('http://test.foundationsapiservice.com')
                .get('/api/1')
                .reply(400, { 'bad': 'request' })

            let mockedLogger = {
                error: sinon.spy()
            }

            const foundationsApiService = new FoundationsApiService(mockedLogger)

            const response = await foundationsApiService.get('http://test.foundationsapiservice.com/api/1')

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
            const response = await foundationsApiService.get('http://test.foundationsapiservice.com/api/1')

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
})
