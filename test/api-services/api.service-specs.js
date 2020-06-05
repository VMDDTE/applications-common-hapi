/* eslint-disable no-unused-expressions */
/* eslint-disable jest/valid-expect */
/* eslint-disable no-new */
/* eslint-disable jest/no-disabled-tests */
/* eslint-disable jest/expect-expect */

import chai from 'chai'
import mockHttp from 'mock-http-client'
import sinon from 'sinon'
import { ApiService } from '../../api-services/api.service'

const expect = chai.expect

describe('Api.Service', function () {
    describe('#ctor', function () {
        it('should construct correctly', function () {
            const mockedHttp = mockHttp()
            expect(() => { new ApiService(mockedHttp, {}) }).not.throw()
        })

        it('should error when no http client is passed', function () {
            expect(() => { new ApiService() }).to.throw('ApiService requires a http client')
        })

        it('should error with no logger passed', function () {
            expect(() => { new ApiService({}) }).to.throw('ApiService required a logger')
        })
    })

    describe('#get', function () {
        it('should return 200 with correct data', async function () {
            const mockedHttp = mockHttp()
            mockedHttp.when('get', '/api/1').return({
                status: 200,
                data: { 'test': 'pass' }
            })
            const apiService = new ApiService(mockedHttp, {})

            const response = await apiService.get('/api/1')

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
            const apiService = new ApiService(mockedHttp, {})

            const response = await apiService.get('/api/1')

            expect(response).to.have.property('status')
            expect(response.status).to.equal(400)

            expect(response).to.have.property('data')
            expect(response.data).to.have.property('test')
            expect(response.data.test).to.equal('pass')
        })

        it('should log error with correct message and rethrow error', async function () {
            const mockedHttp = mockHttp()
            mockedHttp.when('get', '/api/1').reject(new Error('Test error'))

            let mockedLogger = {
                error: sinon.spy()
            }

            const apiService = new ApiService(mockedHttp, mockedLogger)

            await expectThrowsAsync(() => apiService.get('/api/1'))

            expect(mockedLogger.error.calledOnce).to.be.true
            const loggedError = mockedLogger.error.firstCall.args[0]

            expect(loggedError).to.have.property('ApiServiceUrl')
            expect(loggedError.ApiServiceUrl).to.equal('[GET] /api/1')

            expect(loggedError).to.have.property('Exception')
            expect(loggedError.Exception).to.match(/^Error: Test error/)
        })
    })
})

const expectThrowsAsync = async (method, errorMessage) => {
    let error = null
    try {
        await method()
    } catch (err) {
        error = err
    }
    expect(error).to.be.an('Error')
    if (errorMessage) {
        expect(error.message).to.equal(errorMessage)
    }
}
