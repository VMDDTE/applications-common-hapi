/* eslint-disable no-unused-expressions */
/* eslint-disable no-new */
import { describe, it } from 'mocha'
import chai from 'chai'
import sinon from 'sinon'
import { FoundationsApiService } from '../../api-services/foundations-api.service'
import { ProtectiveMonitoringService } from '../../services/protective-monitoring.service'
import { checkForCorrelationIdHeader, checkResponseStatusCode, checkResponseData, checkLoggedErrorDetails, checkLoggedProtectiveMonitoringDetails } from '../helpers'
import nock from 'nock'

const expect = chai.expect

describe('FoundationsApi.Service', function () {
    describe('#get', function () {
        const getDomain = 'http://test-get.foundationsapiservice.com'
        const getUri = '/api/1'

        describe('no responseOptions', function () {
            it('should return 200 response, correct data, correlation id header', async function () {
                nock(getDomain)
                    .get(getUri)
                    .reply(200, { 'test': 'pass' })

                const foundationsApiService = new FoundationsApiService({})

                const requestConfiguration = foundationsApiService.buildFoundationsApiRequestConfig(`${getDomain}${getUri}`, null, null, '12345')
                const response = await foundationsApiService.get(requestConfiguration)

                checkForCorrelationIdHeader(response, '12345')

                checkResponseStatusCode(response, 200)

                checkResponseData(response, 'test', 'pass')
            })

            it('should return 400 response, correct data, logged error', async function () {
                nock(getDomain)
                    .get(getUri)
                    .reply(400, { 'bad': 'request' })

                let mockedLogger = {
                    error: sinon.spy()
                }

                const foundationsApiService = new FoundationsApiService(mockedLogger)

                const requestConfiguration = foundationsApiService.buildFoundationsApiRequestConfig(`${getDomain}${getUri}`)
                const response = await foundationsApiService.get(requestConfiguration)

                checkResponseStatusCode(response, 400)

                checkResponseData(response, 'bad', 'request')

                expect(mockedLogger.error.calledOnce).to.be.true
                const loggedError = mockedLogger.error.firstCall.args[0]
                checkLoggedErrorDetails(loggedError, 400, `[GET] ${getDomain}${getUri}`, 'Error: Request failed with status code 400')
            })

            it('should return 500 response, correct data, logged error', async function () {
                nock(getDomain)
                    .get(getUri)
                    .reply(500, { 'internal': 'server error' })

                let mockedLogger = {
                    error: sinon.spy()
                }

                const foundationsApiService = new FoundationsApiService(mockedLogger)

                // Should log error, but not rethrow as the base does
                const requestConfiguration = foundationsApiService.buildFoundationsApiRequestConfig(`${getDomain}${getUri}`)
                const response = await foundationsApiService.get(requestConfiguration)

                checkResponseStatusCode(response, 500)

                checkResponseData(response, 'internal', 'server error')

                expect(mockedLogger.error.calledOnce).to.be.true
                const loggedError = mockedLogger.error.firstCall.args[0]
                checkLoggedErrorDetails(loggedError, 500, `[GET] ${getDomain}${getUri}`, 'Error: Request failed with status code 500')
            })
        })

        describe('with returnDataOnly responseOptions', function () {
            it('should return correct data, no response information', async function () {
                nock(getDomain)
                    .get(getUri)
                    .reply(200, { 'test': 'pass' })

                const foundationsApiService = new FoundationsApiService({})

                const requestConfiguration = foundationsApiService.buildFoundationsApiRequestConfig(`${getDomain}${getUri}`, null, null, '12345')
                const responseOptions = foundationsApiService.buildFoundationsApiResponseOptions(true)
                const result = await foundationsApiService.get(requestConfiguration, responseOptions)

                expect(result).not.to.have.property('status')

                expect(result).not.to.have.property('data')
                // The data should just be the expected response data, nothing else
                expect(result).to.have.property('test')
                expect(result.test).to.equal('pass')
            })

            it('should return 400 response, correct data, logged error', async function () {
                nock(getDomain)
                    .get(getUri)
                    .reply(400, { 'bad': 'request' })

                let mockedLogger = {
                    error: sinon.spy()
                }

                const foundationsApiService = new FoundationsApiService(mockedLogger)
                const requestConfiguration = foundationsApiService.buildFoundationsApiRequestConfig(`${getDomain}${getUri}`, null, null, true)
                const responseOptions = foundationsApiService.buildFoundationsApiResponseOptions(true)
                const response = await foundationsApiService.get(requestConfiguration, responseOptions)

                checkResponseStatusCode(response, 400)

                checkResponseData(response, 'bad', 'request')

                expect(mockedLogger.error.calledOnce).to.be.true
                const loggedError = mockedLogger.error.firstCall.args[0]
                checkLoggedErrorDetails(loggedError, 400, `[GET] ${getDomain}${getUri}`, 'Error: Request failed with status code 400')
            })
        })

        describe('with protectiveMonitoring responseOptions', function () {
            it('should return 200 response, correct data, correlation id header, protective monitor successful event', async function () {
                nock(getDomain)
                    .get(getUri)
                    .reply(200, { 'test': 'pass' })

                const mockedPmLogger = { info: sinon.spy(), error: sinon.spy() }
                const mockedLog4js = {
                    getLogger: function (logName) {
                        if (logName === 'protective-monitoring') {
                            return mockedPmLogger
                        }
                        return null
                    }
                }
                const protectiveMonitoringService = new ProtectiveMonitoringService(mockedLog4js)
                const foundationsApiService = new FoundationsApiService({}, protectiveMonitoringService)

                const requestConfiguration = foundationsApiService.buildFoundationsApiRequestConfig(`${getDomain}${getUri}`, null, null, '12345')

                const successfulMonitoringOptions = protectiveMonitoringService.buildProtectiveMonitoringOptions('TEST_123', 'Testing protective monitoring')
                const foundationsApiProtectiveMonitoring = foundationsApiService.buildFoundationsApiProtectiveMonitoring('test', successfulMonitoringOptions)
                const responseOptions = foundationsApiService.buildFoundationsApiResponseOptions(false, foundationsApiProtectiveMonitoring)

                const response = await foundationsApiService.get(requestConfiguration, responseOptions)

                checkForCorrelationIdHeader(response, '12345')

                checkResponseStatusCode(response, 200)

                checkResponseData(response, 'test', 'pass')

                expect(mockedPmLogger.info.calledOnce).to.be.true
                expect(mockedPmLogger.error.calledOnce).to.be.false
                const loggedPmInfoMessage = JSON.parse(mockedPmLogger.info.firstCall.args[0])

                checkLoggedProtectiveMonitoringDetails(
                    loggedPmInfoMessage,
                    foundationsApiProtectiveMonitoring.environment,
                    successfulMonitoringOptions.auditCode,
                    successfulMonitoringOptions.auditDescription
                )
            })

            it('should return 400 response, correct data, logged error, protective monitor exception event', async function () {
                nock(getDomain)
                    .get(getUri)
                    .reply(400, { 'bad': 'request' })

                let mockedLogger = {
                    error: sinon.spy()
                }

                const mockedPmLogger = { info: sinon.spy(), error: sinon.spy() }
                const mockedLog4js = {
                    getLogger: function (logName) {
                        if (logName === 'protective-monitoring') {
                            return mockedPmLogger
                        }
                        return null
                    }
                }
                const protectiveMonitoringService = new ProtectiveMonitoringService(mockedLog4js)
                const exceptionMonitoringOptions = protectiveMonitoringService.buildProtectiveMonitoringOptions('TEST_123', 'Testing protective monitoring')

                const foundationsApiService = new FoundationsApiService(mockedLogger, protectiveMonitoringService)

                const requestConfiguration = foundationsApiService.buildFoundationsApiRequestConfig(`${getDomain}${getUri}`)

                const foundationsApiProtectiveMonitoring = foundationsApiService.buildFoundationsApiProtectiveMonitoring('test', null, exceptionMonitoringOptions)
                const responseOptions = foundationsApiService.buildFoundationsApiResponseOptions(false, foundationsApiProtectiveMonitoring)

                const response = await foundationsApiService.get(requestConfiguration, responseOptions)

                checkResponseStatusCode(response, 400)

                checkResponseData(response, 'bad', 'request')

                expect(mockedLogger.error.calledOnce).to.be.true
                const loggedError = mockedLogger.error.firstCall.args[0]
                checkLoggedErrorDetails(loggedError, 400, `[GET] ${getDomain}${getUri}`, 'Error: Request failed with status code 400')

                expect(mockedPmLogger.info.calledOnce).to.be.false
                expect(mockedPmLogger.error.calledOnce).to.be.true
                const loggedPmErrorMessage = JSON.parse(mockedPmLogger.error.firstCall.args[0])

                checkLoggedProtectiveMonitoringDetails(
                    loggedPmErrorMessage,
                    foundationsApiProtectiveMonitoring.environment,
                    exceptionMonitoringOptions.auditCode,
                    exceptionMonitoringOptions.auditDescription
                )
            })
        })
    })

    describe('#health ping', function () {
        const pingDomain = 'http://test-ping.foundationsapiservice.com'
        const pingUri = '/health/ping'

        it('should return 200 response, correct data, correlation id header', async function () {
            nock(pingDomain)
                .get(pingUri)
                .reply(200, { 'test': 'pass' })

            const foundationsApiService = new FoundationsApiService({})

            const response = await foundationsApiService.healthPing(pingDomain, '12345')

            checkForCorrelationIdHeader(response, '12345')

            checkResponseStatusCode(response, 200)

            checkResponseData(response, 'test', 'pass')
        })

        it('should return 400 response, correct data, logged error', async function () {
            nock(pingDomain)
                .get(pingUri)
                .reply(400, { 'bad': 'request' })

            let mockedLogger = {
                error: sinon.spy()
            }

            const foundationsApiService = new FoundationsApiService(mockedLogger)

            const response = await foundationsApiService.healthPing(pingDomain)

            checkResponseStatusCode(response, 400)

            checkResponseData(response, 'bad', 'request')

            expect(mockedLogger.error.calledOnce).to.be.true
            const loggedError = mockedLogger.error.firstCall.args[0]
            checkLoggedErrorDetails(loggedError, 400, `[GET] ${pingDomain}${pingUri}`, 'Error: Request failed with status code 400')
        })

        it('should return 500 response, correct data, logged error', async function () {
            nock(pingDomain)
                .get(pingUri)
                .reply(500, { 'internal': 'server error' })

            let mockedLogger = {
                error: sinon.spy()
            }

            const foundationsApiService = new FoundationsApiService(mockedLogger)

            // Should log error, but not rethrow as the base does
            const response = await foundationsApiService.healthPing(pingDomain)

            checkResponseStatusCode(response, 500)

            checkResponseData(response, 'internal', 'server error')

            expect(mockedLogger.error.calledOnce).to.be.true
            const loggedError = mockedLogger.error.firstCall.args[0]
            checkLoggedErrorDetails(loggedError, 500, `[GET] ${pingDomain}${pingUri}`, 'Error: Request failed with status code 500')
        })
    })
})
