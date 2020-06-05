/* eslint-disable no-unused-expressions */
/* eslint-disable jest/valid-expect */
/* eslint-disable no-new */
/* eslint-disable jest/no-disabled-tests */
/* eslint-disable jest/expect-expect */

import chai from 'chai'
import mockHttp from 'mock-http-client'
import sinon from 'sinon'
import { FoundationsApiService } from '../../api-services/foundations-api.service'

const expect = chai.expect

describe('FoundationsApi.Service', function () {
    describe('#get', function () {
        it('should return 200 with correct data', async function () {
            const mockedHttp = mockHttp()
            mockedHttp.when('get', '/api/1').return({
                status: 200,
                data: { 'test': 'pass' }
            })
            const foundationsApiService = new FoundationsApiService(mockedHttp, {})

            const response = await foundationsApiService.get('/api/1')

            expect(response).to.have.property('status')
            expect(response.status).to.equal(200)

            expect(response).to.have.property('data')
            expect(response.data).to.have.property('test')
            expect(response.data.test).to.equal('pass')
        })

        it('should return 400 with correct data', async function () {
            const mockedHttp = mockHttp()
            mockedHttp.when('get', '/api/1').return({
                status: 400,
                data: { 'test': 'pass' }
            })
            const foundationsApiService = new FoundationsApiService(mockedHttp, {})

            const response = await foundationsApiService.get('/api/1')

            expect(response).to.have.property('status')
            expect(response.status).to.equal(400)

            expect(response).to.have.property('data')
            expect(response.data).to.have.property('test')
            expect(response.data.test).to.equal('pass')
        })

        it('should log error with correct message and not rethrow error', async function () {
            const mockedHttp = mockHttp()
            mockedHttp.when('get', '/api/1').reject(new Error('Test error'))

            let mockedLogger = {
                error: sinon.spy()
            }

            const foundationsApiService = new FoundationsApiService(mockedHttp, mockedLogger)

            // Should log error, but not rethrow as the base does
            await foundationsApiService.get('/api/1')

            expect(mockedLogger.error.calledOnce).to.be.true
            const loggedError = mockedLogger.error.firstCall.args[0]

            expect(loggedError).to.have.property('ApiServiceUrl')
            expect(loggedError.ApiServiceUrl).to.equal('[GET] /api/1')

            expect(loggedError).to.have.property('Exception')
            expect(loggedError.Exception).to.match(/^Error: Test error/)
        })
    })
})
