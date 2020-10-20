/* eslint-disable no-unused-expressions */
/* eslint-disable no-new */
import { describe, it } from 'mocha'
import chai from 'chai'
import nock from 'nock'
import {
    expectThrowsAsync,
    checkRequestData, checkResponseStatusCode, checkResponseData,
    checkLoggedErrorDetails,
    buildMockLogger } from '../helpers'
import { ApiService } from '../../api-services/api.service'
import { addMaxContentLengthToRequestConfiguration, addMaxBodyLengthToRequestConfiguration, buildApiRequestConfig } from '../../api-services/helpers'

const expect = chai.expect

describe('Api.Service', function () {
    describe('#ctor', function () {
        it('should construct correctly', function () {
            expect(() => { new ApiService(buildMockLogger()) }).not.throw()
        })

        it('should error with no logger passed', function () {
            expect(() => { new ApiService() }).to.throw('ApiService requires a VmdLogger')
        })

        it('should error with logger passed that does not conform', function () {
            expect(() => { new ApiService({}) }).to.throw('VmdLogger does not provide required methods')
        })
    })

    describe('#requestConfigValidation', function () {
        const testDomain = 'http://test-requestConfigValidation.apiservice.com'
        const testUri = '/api/1'

        it('should throw error when no request config provided', async function () {
            const apiService = new ApiService(buildMockLogger())
            // Can only test by calling actionRequest directly as actual methods set http method thus need an object
            await expectThrowsAsync(() => apiService.actionRequest(), 'Request Config required')
        })

        it('should throw error when no request config method provided', async function () {
            const apiService = new ApiService(buildMockLogger())
            // Can only test by calling actionRequest directly as actual methods set http method thus need an object
            await expectThrowsAsync(() => apiService.actionRequest({}), 'Request Config requires a http method')
        })

        it('should throw error when no request config content-type provided', async function () {
            nock(testDomain)
                .get(testUri)
                .reply(500, { 'internal': 'server error' })

            const mockedLogger = buildMockLogger()
            const apiService = new ApiService(mockedLogger)
            const requestConfiguration = buildApiRequestConfig(`${testDomain}${testUri}`)
            await expectThrowsAsync(() => apiService.get(requestConfiguration), 'Request Config requires a content-type header')
        })
    })

    describe('#ENOTFOUND', function () {
        const getDomain = 'http://test-get.apiservice.com:0123'
        const getUri = '/api/1'

        it('ENOTFOUND should log error with correct data', async function () {
            const mockedLogger = buildMockLogger()
            const apiService = new ApiService(mockedLogger)
            const requestConfiguration = buildApiRequestConfig(`${getDomain}${getUri}`, { 'Content-Type': 'application/test' })
            await expectThrowsAsync(() => apiService.get(requestConfiguration))

            expect(mockedLogger.logRequestError.calledOnce).to.be.true
            const loggedStandardErrorArguments = mockedLogger.logRequestError.firstCall.args
            checkLoggedErrorDetails(loggedStandardErrorArguments, 'GET', `${getDomain}${getUri}`, 'No Response', 'Error: getaddrinfo ENOTFOUND test-get.apiservice.com')
        })
    })

    describe('#ECONNREFUSED', function () {
        const getDomain = 'http://localhost:0123'
        const getUri = '/api/1'

        it('ECONNREFUSED should log error with correct data', async function () {
            const mockedLogger = buildMockLogger()
            const apiService = new ApiService(mockedLogger)
            const requestConfiguration = buildApiRequestConfig(`${getDomain}${getUri}`, { 'Content-Type': 'application/test' })
            await expectThrowsAsync(() => apiService.get(requestConfiguration))

            expect(mockedLogger.logRequestError.calledOnce).to.be.true
            const loggedStandardErrorArguments = mockedLogger.logRequestError.firstCall.args
            checkLoggedErrorDetails(loggedStandardErrorArguments, 'GET', `${getDomain}${getUri}`, 'No Response', 'Error: connect ECONNREFUSED 127.0.0.1:123')
        })
    })

    describe('#get', function () {
        const getDomain = 'http://test-get.apiservice.com'
        const getUri = '/api/1'

        it('should return 200 with correct data', async function () {
            nock(getDomain)
                .get(getUri)
                .reply(200, { 'test': 'pass' })

            const mockedLogger = buildMockLogger()
            const apiService = new ApiService(mockedLogger)
            const requestConfiguration = buildApiRequestConfig(`${getDomain}${getUri}`, { 'Content-Type': 'application/test' })
            const response = await apiService.get(requestConfiguration)

            checkResponseStatusCode(response, 200)

            checkResponseData(response, 'test', 'pass')
        })

        it('should return 400 with correct data', async function () {
            nock(getDomain)
                .get(getUri)
                .reply(400, { 'bad': 'request' })

            const mockedLogger = buildMockLogger()
            const apiService = new ApiService(mockedLogger)
            const requestConfiguration = buildApiRequestConfig(`${getDomain}${getUri}`, { 'Content-Type': 'application/test' })
            await expectThrowsAsync(() => apiService.get(requestConfiguration))

            expect(mockedLogger.logRequestError.calledOnce).to.be.true
            const loggedStandardErrorArguments = mockedLogger.logRequestError.firstCall.args
            checkLoggedErrorDetails(loggedStandardErrorArguments, 'GET', `${getDomain}${getUri}`, 400, 'Error: Request failed with status code 400')
        })

        it('should log error with correct message and rethrow error', async function () {
            nock(getDomain)
                .get(getUri)
                .reply(500, { 'internal': 'server error' })

            const mockedLogger = buildMockLogger()
            const apiService = new ApiService(mockedLogger)
            const requestConfiguration = buildApiRequestConfig(`${getDomain}${getUri}`, { 'Content-Type': 'application/test' })
            await expectThrowsAsync(() => apiService.get(requestConfiguration))

            expect(mockedLogger.logRequestInfo.calledTwice).to.be.true

            expect(mockedLogger.logRequestError.calledOnce).to.be.true
            const loggedStandardErrorArguments = mockedLogger.logRequestError.firstCall.args
            checkLoggedErrorDetails(loggedStandardErrorArguments, 'GET', `${getDomain}${getUri}`, 500, 'Error: Request failed with status code 500')
        })
    })

    describe('#post', function () {
        const postDomain = 'http://test-post.apiservice.com'
        const postUri = '/api/1'

        it('should return 200 with correct data', async function () {
            nock(postDomain)
                .post(postUri)
                .reply(200, { 'test': 'pass' })

            const mockedLogger = buildMockLogger()
            const apiService = new ApiService(mockedLogger)
            const requestConfiguration = buildApiRequestConfig(
                `${postDomain}${postUri}`,
                { 'Content-Type': 'application/test' },
                { 'postData': 'test post data' })
            const response = await apiService.post(requestConfiguration)

            checkRequestData(response, 'postData', 'test post data')

            checkResponseStatusCode(response, 200)

            checkResponseData(response, 'test', 'pass')
        })

        it('should return 200 with correct data, request has maxContentLength and maxBodyLength', async function () {
            nock(postDomain)
                .post(postUri)
                .reply(200, { 'test': 'pass' })

            const mockedLogger = buildMockLogger()
            const apiService = new ApiService(mockedLogger)
            const requestConfiguration = buildApiRequestConfig(
                `${postDomain}${postUri}`,
                { 'Content-Type': 'application/test' },
                { 'postData': 'test post data' })

            const maxContentLength = 12345
            let updatedRequestConfiguration = addMaxContentLengthToRequestConfiguration(requestConfiguration, maxContentLength)
            const maxBodyLength = 54321
            updatedRequestConfiguration = addMaxBodyLengthToRequestConfiguration(requestConfiguration, maxBodyLength)

            const response = await apiService.post(updatedRequestConfiguration)

            expect(response).to.have.nested.property('config.maxContentLength')
            expect(response.config.maxContentLength).to.equal(maxContentLength)

            expect(response).to.have.nested.property('config.maxBodyLength')
            expect(response.config.maxBodyLength).to.equal(maxBodyLength)

            checkRequestData(response, 'postData', 'test post data')

            checkResponseStatusCode(response, 200)

            checkResponseData(response, 'test', 'pass')
        })

        it('should return 400 with correct data', async function () {
            nock(postDomain)
                .post(postUri)
                .reply(400, { 'bad': 'request' })

            const mockedLogger = buildMockLogger()
            const apiService = new ApiService(mockedLogger)
            const requestConfiguration = buildApiRequestConfig(`${postDomain}${postUri}`, { 'Content-Type': 'application/test' })
            await expectThrowsAsync(() => apiService.post(requestConfiguration))

            expect(mockedLogger.logRequestError.calledOnce).to.be.true
            const loggedStandardErrorArguments = mockedLogger.logRequestError.firstCall.args
            checkLoggedErrorDetails(loggedStandardErrorArguments, 'POST', `${postDomain}${postUri}`, 400, 'Error: Request failed with status code 400')
        })

        it('should log error with correct message and rethrow error', async function () {
            nock(postDomain)
                .post(postUri)
                .reply(500, { 'internal': 'server error' })

            const mockedLogger = buildMockLogger()
            const apiService = new ApiService(mockedLogger)
            const requestConfiguration = buildApiRequestConfig(`${postDomain}${postUri}`, { 'Content-Type': 'application/test' })
            await expectThrowsAsync(() => apiService.post(requestConfiguration))

            expect(mockedLogger.logRequestError.calledOnce).to.be.true
            const loggedStandardErrorArguments = mockedLogger.logRequestError.firstCall.args
            checkLoggedErrorDetails(loggedStandardErrorArguments, 'POST', `${postDomain}${postUri}`, 500, 'Error: Request failed with status code 500')
        })

        it('should throw error when no content-type provided', async function () {
            nock(postDomain)
                .post(postUri)
                .reply(500, { 'internal': 'server error' })

            const mockedLogger = buildMockLogger()
            const apiService = new ApiService(mockedLogger)
            const requestConfiguration = buildApiRequestConfig(`${postDomain}${postUri}`)
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

            const mockedLogger = buildMockLogger()
            const apiService = new ApiService(mockedLogger)
            const requestConfiguration = buildApiRequestConfig(`${putDomain}${putUri}`, { 'Content-Type': 'application/test' })
            const response = await apiService.put(requestConfiguration)

            checkResponseStatusCode(response, 200)

            checkResponseData(response, 'test', 'pass')
        })

        it('should return 400 with correct data', async function () {
            nock(putDomain)
                .put(putUri)
                .reply(400, { 'bad': 'request' })

            const mockedLogger = buildMockLogger()
            const apiService = new ApiService(mockedLogger)
            const requestConfiguration = buildApiRequestConfig(`${putDomain}${putUri}`, { 'Content-Type': 'application/test' })
            await expectThrowsAsync(() => apiService.put(requestConfiguration))

            expect(mockedLogger.logRequestError.calledOnce).to.be.true
            const loggedStandardErrorArguments = mockedLogger.logRequestError.firstCall.args
            checkLoggedErrorDetails(loggedStandardErrorArguments, 'PUT', `${putDomain}${putUri}`, 400, 'Error: Request failed with status code 400')
        })

        it('should log error with correct message and rethrow error', async function () {
            nock(putDomain)
                .put(putUri)
                .reply(500, { 'internal': 'server error' })

            const mockedLogger = buildMockLogger()
            const apiService = new ApiService(mockedLogger)
            const requestConfiguration = buildApiRequestConfig(`${putDomain}${putUri}`, { 'Content-Type': 'application/test' })
            await expectThrowsAsync(() => apiService.put(requestConfiguration))

            expect(mockedLogger.logRequestError.calledOnce).to.be.true
            const loggedStandardErrorArguments = mockedLogger.logRequestError.firstCall.args
            checkLoggedErrorDetails(loggedStandardErrorArguments, 'PUT', `${putDomain}${putUri}`, 500, 'Error: Request failed with status code 500')
        })

        it('should throw error when no content-type provided', async function () {
            nock(putDomain)
                .put(putUri)
                .reply(500, { 'internal': 'server error' })

            const mockedLogger = buildMockLogger()
            const apiService = new ApiService(mockedLogger)
            const requestConfiguration = buildApiRequestConfig(`${putDomain}${putUri}`)
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

            const mockedLogger = buildMockLogger()
            const apiService = new ApiService(mockedLogger)
            const requestConfiguration = buildApiRequestConfig(`${patchDomain}${patchUri}`, { 'Content-Type': 'application/test' })
            const response = await apiService.patch(requestConfiguration)

            checkResponseStatusCode(response, 200)

            checkResponseData(response, 'test', 'pass')
        })

        it('should return 400 with correct data', async function () {
            nock(patchDomain)
                .patch(patchUri)
                .reply(400, { 'bad': 'request' })

            const mockedLogger = buildMockLogger()
            const apiService = new ApiService(mockedLogger)
            const requestConfiguration = buildApiRequestConfig(`${patchDomain}${patchUri}`, { 'Content-Type': 'application/test' })
            await expectThrowsAsync(() => apiService.patch(requestConfiguration))

            expect(mockedLogger.logRequestError.calledOnce).to.be.true
            const loggedStandardErrorArguments = mockedLogger.logRequestError.firstCall.args
            checkLoggedErrorDetails(loggedStandardErrorArguments, 'PATCH', `${patchDomain}${patchUri}`, 400, 'Error: Request failed with status code 400')
        })

        it('should log error with correct message and rethrow error', async function () {
            nock(patchDomain)
                .patch(patchUri)
                .reply(500, { 'internal': 'server error' })

            const mockedLogger = buildMockLogger()
            const apiService = new ApiService(mockedLogger)
            const requestConfiguration = buildApiRequestConfig(`${patchDomain}${patchUri}`, { 'Content-Type': 'application/test' })
            await expectThrowsAsync(() => apiService.patch(requestConfiguration))

            expect(mockedLogger.logRequestError.calledOnce).to.be.true
            const loggedStandardErrorArguments = mockedLogger.logRequestError.firstCall.args
            checkLoggedErrorDetails(loggedStandardErrorArguments, 'PATCH', `${patchDomain}${patchUri}`, 500, 'Error: Request failed with status code 500')
        })

        it('should throw error when no content-type provided', async function () {
            nock(patchDomain)
                .patch(patchUri)
                .reply(500, { 'internal': 'server error' })

            const mockedLogger = buildMockLogger()
            const apiService = new ApiService(mockedLogger)
            const requestConfiguration = buildApiRequestConfig(`${patchDomain}${patchUri}`)
            await expectThrowsAsync(() => apiService.patch(requestConfiguration), 'Request Config requires a content-type header')
        })
    })
})
