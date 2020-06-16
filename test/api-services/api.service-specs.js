/* eslint-disable no-unused-expressions */
/* eslint-disable no-new */
import { describe, it } from 'mocha'
import chai from 'chai'
import nock from 'nock'
import sinon from 'sinon'
import { expectThrowsAsync, checkResponseStatusCode, checkResponseData, checkLoggedErrorDetails } from '../helpers'
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
        const getDomain = 'http://test-get.apiservice.com'
        const getUri = '/api/1'

        it('should return 200 with correct data', async function () {
            nock(getDomain)
                .get(getUri)
                .reply(200, { 'test': 'pass' })

            const apiService = new ApiService({})
            const requestConfiguration = apiService.buildApiRequestConfig(`${getDomain}${getUri}`, { 'Content-Type': 'application/test' })
            const response = await apiService.get(requestConfiguration)

            checkResponseStatusCode(response, 200)

            checkResponseData(response, 'test', 'pass')
        })

        it('should return 400 with correct data', async function () {
            nock(getDomain)
                .get(getUri)
                .reply(400, { 'bad': 'request' })

            let mockedLogger = {
                error: sinon.spy()
            }

            const apiService = new ApiService(mockedLogger)
            const requestConfiguration = apiService.buildApiRequestConfig(`${getDomain}${getUri}`, { 'Content-Type': 'application/test' })
            await expectThrowsAsync(() => apiService.get(requestConfiguration))

            expect(mockedLogger.error.calledOnce).to.be.true
            const loggedError = mockedLogger.error.firstCall.args[0]
            checkLoggedErrorDetails(loggedError, 400, `[GET] ${getDomain}${getUri}`, 'Error: Request failed with status code 400')
        })

        it('should log error with correct message and rethrow error', async function () {
            nock(getDomain)
                .get(getUri)
                .reply(500, { 'internal': 'server error' })

            let mockedLogger = {
                error: sinon.spy()
            }

            const apiService = new ApiService(mockedLogger)
            const requestConfiguration = apiService.buildApiRequestConfig(`${getDomain}${getUri}`, { 'Content-Type': 'application/test' })
            await expectThrowsAsync(() => apiService.get(requestConfiguration))

            expect(mockedLogger.error.calledOnce).to.be.true
            const loggedError = mockedLogger.error.firstCall.args[0]
            checkLoggedErrorDetails(loggedError, 500, `[GET] ${getDomain}${getUri}`, 'Error: Request failed with status code 500')
        })

        it('should throw error when no content-type provided', async function () {
            nock(getDomain)
                .get(getUri)
                .reply(500, { 'internal': 'server error' })

            let mockedLogger = {
                error: sinon.spy()
            }

            const apiService = new ApiService(mockedLogger)
            const requestConfiguration = apiService.buildApiRequestConfig(`${getDomain}${getUri}`)
            await expectThrowsAsync(() => apiService.get(requestConfiguration), 'Request Config requires a content-type header')
        })
    })

    describe('#post', function () {
        const postDomain = 'http://test-post.apiservice.com'
        const postUri = '/api/1'

        it('should return 200 with correct data', async function () {
            nock(postDomain)
                .post(postUri)
                .reply(200, { 'test': 'pass' })

            const apiService = new ApiService({})
            const requestConfiguration = apiService.buildApiRequestConfig(`${postDomain}${postUri}`, { 'Content-Type': 'application/test' })
            const response = await apiService.post(requestConfiguration)

            checkResponseStatusCode(response, 200)

            checkResponseData(response, 'test', 'pass')
        })

        it('should return 400 with correct data', async function () {
            nock(postDomain)
                .post(postUri)
                .reply(400, { 'bad': 'request' })

            let mockedLogger = {
                error: sinon.spy()
            }

            const apiService = new ApiService(mockedLogger)
            const requestConfiguration = apiService.buildApiRequestConfig(`${postDomain}${postUri}`, { 'Content-Type': 'application/test' })
            await expectThrowsAsync(() => apiService.post(requestConfiguration))

            expect(mockedLogger.error.calledOnce).to.be.true
            const loggedError = mockedLogger.error.firstCall.args[0]
            checkLoggedErrorDetails(loggedError, 400, `[POST] ${postDomain}${postUri}`, 'Error: Request failed with status code 400')
        })

        it('should log error with correct message and rethrow error', async function () {
            nock(postDomain)
                .post(postUri)
                .reply(500, { 'internal': 'server error' })

            let mockedLogger = {
                error: sinon.spy()
            }

            const apiService = new ApiService(mockedLogger)
            const requestConfiguration = apiService.buildApiRequestConfig(`${postDomain}${postUri}`, { 'Content-Type': 'application/test' })
            await expectThrowsAsync(() => apiService.post(requestConfiguration))

            expect(mockedLogger.error.calledOnce).to.be.true
            const loggedError = mockedLogger.error.firstCall.args[0]
            checkLoggedErrorDetails(loggedError, 500, `[POST] ${postDomain}${postUri}`, 'Error: Request failed with status code 500')
        })

        it('should throw error when no content-type provided', async function () {
            nock(postDomain)
                .post(postUri)
                .reply(500, { 'internal': 'server error' })

            let mockedLogger = {
                error: sinon.spy()
            }

            const apiService = new ApiService(mockedLogger)
            const requestConfiguration = apiService.buildApiRequestConfig(`${postDomain}${postUri}`)
            await expectThrowsAsync(() => apiService.post(requestConfiguration), 'Request Config requires a content-type header')
        })
    })

    describe('#put', function () {
        const putDomain = 'http://test-put.apiservice.com'
        const putUri = '/api/1'

        it('should return 200 with correct data', async function () {
            nock(putDomain)
                .put(putUri)
                .reply(200, { 'test': 'pass' })

            const apiService = new ApiService({})
            const requestConfiguration = apiService.buildApiRequestConfig(`${putDomain}${putUri}`, { 'Content-Type': 'application/test' })
            const response = await apiService.put(requestConfiguration)

            checkResponseStatusCode(response, 200)

            checkResponseData(response, 'test', 'pass')
        })

        it('should return 400 with correct data', async function () {
            nock(putDomain)
                .put(putUri)
                .reply(400, { 'bad': 'request' })

            let mockedLogger = {
                error: sinon.spy()
            }

            const apiService = new ApiService(mockedLogger)
            const requestConfiguration = apiService.buildApiRequestConfig(`${putDomain}${putUri}`, { 'Content-Type': 'application/test' })
            await expectThrowsAsync(() => apiService.put(requestConfiguration))

            expect(mockedLogger.error.calledOnce).to.be.true
            const loggedError = mockedLogger.error.firstCall.args[0]
            checkLoggedErrorDetails(loggedError, 400, `[PUT] ${putDomain}${putUri}`, 'Error: Request failed with status code 400')
        })

        it('should log error with correct message and rethrow error', async function () {
            nock(putDomain)
                .put(putUri)
                .reply(500, { 'internal': 'server error' })

            let mockedLogger = {
                error: sinon.spy()
            }

            const apiService = new ApiService(mockedLogger)
            const requestConfiguration = apiService.buildApiRequestConfig(`${putDomain}${putUri}`, { 'Content-Type': 'application/test' })
            await expectThrowsAsync(() => apiService.put(requestConfiguration))

            expect(mockedLogger.error.calledOnce).to.be.true
            const loggedError = mockedLogger.error.firstCall.args[0]
            checkLoggedErrorDetails(loggedError, 500, `[PUT] ${putDomain}${putUri}`, 'Error: Request failed with status code 500')
        })

        it('should throw error when no content-type provided', async function () {
            nock(putDomain)
                .put(putUri)
                .reply(500, { 'internal': 'server error' })

            let mockedLogger = {
                error: sinon.spy()
            }

            const apiService = new ApiService(mockedLogger)
            const requestConfiguration = apiService.buildApiRequestConfig(`${putDomain}${putUri}`)
            await expectThrowsAsync(() => apiService.put(requestConfiguration), 'Request Config requires a content-type header')
        })
    })

    describe('#patch', function () {
        const patchDomain = 'http://test-patch.apiservice.com'
        const patchUri = '/api/1'

        it('should return 200 with correct data', async function () {
            nock(patchDomain)
                .patch(patchUri)
                .reply(200, { 'test': 'pass' })

            const apiService = new ApiService({})
            const requestConfiguration = apiService.buildApiRequestConfig(`${patchDomain}${patchUri}`, { 'Content-Type': 'application/test' })
            const response = await apiService.patch(requestConfiguration)

            checkResponseStatusCode(response, 200)

            checkResponseData(response, 'test', 'pass')
        })

        it('should return 400 with correct data', async function () {
            nock(patchDomain)
                .patch(patchUri)
                .reply(400, { 'bad': 'request' })

            let mockedLogger = {
                error: sinon.spy()
            }

            const apiService = new ApiService(mockedLogger)
            const requestConfiguration = apiService.buildApiRequestConfig(`${patchDomain}${patchUri}`, { 'Content-Type': 'application/test' })
            await expectThrowsAsync(() => apiService.patch(requestConfiguration))

            expect(mockedLogger.error.calledOnce).to.be.true
            const loggedError = mockedLogger.error.firstCall.args[0]
            checkLoggedErrorDetails(loggedError, 400, `[PATCH] ${patchDomain}${patchUri}`, 'Error: Request failed with status code 400')
        })

        it('should log error with correct message and rethrow error', async function () {
            nock(patchDomain)
                .patch(patchUri)
                .reply(500, { 'internal': 'server error' })

            let mockedLogger = {
                error: sinon.spy()
            }

            const apiService = new ApiService(mockedLogger)
            const requestConfiguration = apiService.buildApiRequestConfig(`${patchDomain}${patchUri}`, { 'Content-Type': 'application/test' })
            await expectThrowsAsync(() => apiService.patch(requestConfiguration))

            expect(mockedLogger.error.calledOnce).to.be.true
            const loggedError = mockedLogger.error.firstCall.args[0]
            checkLoggedErrorDetails(loggedError, 500, `[PATCH] ${patchDomain}${patchUri}`, 'Error: Request failed with status code 500')
        })

        it('should throw error when no content-type provided', async function () {
            nock(patchDomain)
                .patch(patchUri)
                .reply(500, { 'internal': 'server error' })

            let mockedLogger = {
                error: sinon.spy()
            }

            const apiService = new ApiService(mockedLogger)
            const requestConfiguration = apiService.buildApiRequestConfig(`${patchDomain}${patchUri}`)
            await expectThrowsAsync(() => apiService.patch(requestConfiguration), 'Request Config requires a content-type header')
        })
    })
})
