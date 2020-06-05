/* eslint-disable no-unused-expressions */
/* eslint-disable jest/valid-expect */
/* eslint-disable no-new */
/* eslint-disable jest/no-disabled-tests */
/* eslint-disable jest/expect-expect */

import chai from 'chai'
import nock from 'nock'
import sinon from 'sinon'
import { expectThrowsAsync } from '../helpers'
import { ApiService } from '../../api-services/api.service'

const expect = chai.expect

describe('Api.Service', function () {
    describe('#ctor', function () {
        it('should construct correctly', function () {
            expect(() => { new ApiService({}) }).not.throw()
        })

        it('should error with no logger passed', function () {
            expect(() => { new ApiService() }).to.throw('ApiService required a logger')
        })
    })

    describe('#get', function () {
        it('should return 200 with correct data', async function () {
            nock('http://test.apiservice.com')
                .get('/api/1')
                .reply(200, { 'test': 'pass' })

            const apiService = new ApiService({})

            const response = await apiService.get('http://test.apiservice.com/api/1')

            expect(response).to.have.property('status')
            expect(response.status).to.equal(200)

            expect(response).to.have.property('data')
            expect(response.data).to.have.property('test')
            expect(response.data.test).to.equal('pass')
        })

        it('should return 400 with correct data', async function () {
            nock('http://test.apiservice.com')
                .get('/api/1')
                .reply(400, { 'bad': 'request' })

            let mockedLogger = {
                error: sinon.spy()
            }

            const apiService = new ApiService(mockedLogger)

            await expectThrowsAsync(() => apiService.get('http://test.apiservice.com/api/1'))

            expect(mockedLogger.error.calledOnce).to.be.true
            const loggedError = mockedLogger.error.firstCall.args[0]

            expect(loggedError).to.have.property('ErrorStatus')
            expect(loggedError.ErrorStatus).to.equal(400)

            expect(loggedError).to.have.property('ApiServiceUrl')
            expect(loggedError.ApiServiceUrl).to.equal('[GET] http://test.apiservice.com/api/1')

            expect(loggedError).to.have.property('Exception')
            expect(loggedError.Exception).to.match(/^Error: Request failed with status code 400/)
        })

        it('should log error with correct message and rethrow error', async function () {
            nock('http://test.apiservice.com')
                .get('/api/1')
                .reply(500, { 'internal': 'server error' })

            let mockedLogger = {
                error: sinon.spy()
            }

            const apiService = new ApiService(mockedLogger)

            await expectThrowsAsync(() => apiService.get('http://test.apiservice.com/api/1'))

            expect(mockedLogger.error.calledOnce).to.be.true
            const loggedError = mockedLogger.error.firstCall.args[0]

            expect(loggedError).to.have.property('ErrorStatus')
            expect(loggedError.ErrorStatus).to.equal(500)

            expect(loggedError).to.have.property('ApiServiceUrl')
            expect(loggedError.ApiServiceUrl).to.equal('[GET] http://test.apiservice.com/api/1')

            expect(loggedError).to.have.property('Exception')
            expect(loggedError.Exception).to.match(/^Error: Request failed with status code 500/)
        })
    })
})

// const expectThrowsAsync = async (method, errorMessage) => {
//     let error = null
//     try {
//         await method()
//     } catch (err) {
//         error = err
//     }
//     expect(error).to.be.an('Error')
//     if (errorMessage) {
//         expect(error.message).to.equal(errorMessage)
//     }
// }
