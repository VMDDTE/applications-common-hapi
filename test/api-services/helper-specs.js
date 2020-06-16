/* eslint-disable no-unused-expressions */
/* eslint-disable no-new */
import { describe, it } from 'mocha'
import chai from 'chai'
import { expectThrowsAsync } from '../helpers'
import {
    addMaxContentLengthToRequestConfiguration, addMaxBodyLengthToRequestConfiguration, validateApiRequestConfig,
    buildApiRequestConfig, buildFoundationsApiRequestConfig,
    buildFoundationsApiProtectiveMonitoring, buildFoundationsApiResponseOptions } from '../../api-services/helpers'

const expect = chai.expect

describe('Api.Service Helpers', function () {
    describe('#checkForRequestConfiguration', function () {
        it('should throw error when no request config provided', async function () {
            await expectThrowsAsync(() => addMaxContentLengthToRequestConfiguration(), 'Request Config required')
        })
    })

    describe('#addMaxContentLengthToRequestConfiguration', function () {
        it('should add maxContentLength to request config provided', async function () {
            const requestConfig = {}
            const maxContentLength = 12345
            addMaxContentLengthToRequestConfiguration(requestConfig, maxContentLength)

            expect(requestConfig).to.have.property('maxContentLength')
            expect(requestConfig.maxContentLength).to.equal(maxContentLength)
        })

        it('should throw error when no request config provided', async function () {
            await expectThrowsAsync(() => addMaxContentLengthToRequestConfiguration(), 'Request Config required')
        })

        it('should throw error when no maxContentLength provided', async function () {
            await expectThrowsAsync(() => addMaxContentLengthToRequestConfiguration({}), 'maxContentLength required')
        })
    })

    describe('#addMaxBodyLengthToRequestConfiguration', function () {
        it('should add maxContentLength to request config provided', async function () {
            const requestConfig = {}
            const maxBodyLength = 54321
            addMaxBodyLengthToRequestConfiguration(requestConfig, maxBodyLength)

            expect(requestConfig).to.have.property('maxBodyLength')
            expect(requestConfig.maxBodyLength).to.equal(maxBodyLength)
        })

        it('should throw error when no request config provided', async function () {
            await expectThrowsAsync(() => addMaxBodyLengthToRequestConfiguration(), 'Request Config required')
        })

        it('should throw error when no maxBodyLength provided', async function () {
            await expectThrowsAsync(() => addMaxBodyLengthToRequestConfiguration({}), 'maxBodyLength required')
        })
    })

    describe('#validateApiRequestConfig', function () {
        it('should throw error when no request config provided', async function () {
            await expectThrowsAsync(() => validateApiRequestConfig(), 'Request Config required')
        })

        it('should throw error when no method provided', async function () {
            const requestConfig = {}
            await expectThrowsAsync(() => validateApiRequestConfig(requestConfig), 'Request Config requires a http method')
        })

        it('should throw error when no headers property is provided', async function () {
            const requestConfig = { 'method': 'get' }
            await expectThrowsAsync(() => validateApiRequestConfig(requestConfig), 'Request Config requires a content-type header')
        })

        it('should throw error when no content-type header property is provided', async function () {
            const requestConfig = {
                'method': 'get',
                'headers': {}
            }
            await expectThrowsAsync(() => validateApiRequestConfig(requestConfig), 'Request Config requires a content-type header')
        })
    })

    describe('#buildApiRequestConfig', function () {
        it('should throw error when no url provided', async function () {
            await expectThrowsAsync(() => buildApiRequestConfig(), 'Url is required')
        })

        it('should add url to request config', async function () {
            const url = 'test.url'
            const requestConfig = buildApiRequestConfig(url)

            expect(requestConfig).to.have.property('url')
            expect(requestConfig.url).to.equal(url)
        })

        it('should add headers to request config when provided', async function () {
            const url = 'test.url'
            const headers = { 'testHeader': 'Some Test header' }
            const requestConfig = buildApiRequestConfig(url, headers)

            expect(requestConfig).to.have.property('headers')
            expect(requestConfig.headers).to.equal(headers)
        })

        it('should add data to request config when provided', async function () {
            const url = 'test.url'
            const data = { 'testData': 'Some Test Data' }
            const requestConfig = buildApiRequestConfig(url, null, data)

            expect(requestConfig).to.have.property('data')
            expect(requestConfig.data).to.equal(data)
        })
    })

    describe('#buildFoundationsApiRequestConfig', function () {
        it('should throw error when no url provided', async function () {
            await expectThrowsAsync(() => buildFoundationsApiRequestConfig(), 'Url is required')
        })

        it('should add url to request config', async function () {
            const url = 'test.url'
            const requestConfig = buildFoundationsApiRequestConfig(url)

            expect(requestConfig).to.have.property('url')
            expect(requestConfig.url).to.equal(url)
        })

        it('should add default content-type header to request config when not provided', async function () {
            const url = 'test.url'
            const requestConfig = buildFoundationsApiRequestConfig(url)

            expect(requestConfig).to.have.property('headers')
            expect(requestConfig.headers).to.have.property('Content-Type')
            expect(requestConfig.headers['Content-Type']).to.equal('application/json')
        })

        it('should add content-type header to request config when provided', async function () {
            const url = 'test.url'
            const customContentType = 'application/notJson'
            const headers = { 'Content-Type': customContentType }
            const requestConfig = buildFoundationsApiRequestConfig(url, headers)

            expect(requestConfig).to.have.property('headers')
            expect(requestConfig.headers).to.have.property('Content-Type')
            expect(requestConfig.headers['Content-Type']).to.equal(customContentType)
        })

        it('should add additional headers to request config when provided', async function () {
            const url = 'test.url'
            const headers = { 'testHeader': 'Some Test header' }
            const requestConfig = buildFoundationsApiRequestConfig(url, headers)

            expect(requestConfig).to.have.property('headers')

            expect(requestConfig.headers).to.have.property('Content-Type')
            expect(requestConfig.headers['Content-Type']).to.equal('application/json')
            expect(requestConfig.headers).to.have.property('testHeader')
            expect(requestConfig.headers['testHeader']).to.equal('Some Test header')
        })

        it('should add data to request config when provided', async function () {
            const url = 'test.url'
            const data = { 'testData': 'Some Test Data' }
            const requestConfig = buildFoundationsApiRequestConfig(url, null, data)

            expect(requestConfig).to.have.property('data')
            expect(requestConfig.data).to.equal(data)
        })
    })

    describe('#buildFoundationsApiProtectiveMonitoring', function () {
        it('should return correct result', async function () {
            const environment = 'testEnvironment'
            const successfulMonitoringOptions = { 'success': 'successfulMonitoringOptions' }
            const exceptionMonitoringOptions = { 'exception': 'exceptionMonitoringOptions' }
            const protectiveMonitoring = buildFoundationsApiProtectiveMonitoring(environment, successfulMonitoringOptions, exceptionMonitoringOptions)

            expect(protectiveMonitoring).to.have.property('environment')
            expect(protectiveMonitoring.environment).to.equal(environment)

            expect(protectiveMonitoring).to.have.property('successfulMonitoringOptions')
            expect(protectiveMonitoring.successfulMonitoringOptions).to.equal(successfulMonitoringOptions)

            expect(protectiveMonitoring).to.have.property('exceptionMonitoringOptions')
            expect(protectiveMonitoring.exceptionMonitoringOptions).to.equal(exceptionMonitoringOptions)
        })

        it('should throw error when no environment provided', async function () {
            await expectThrowsAsync(() => buildFoundationsApiProtectiveMonitoring(), 'Environment is required')
        })

        it('should throw error when no monitoring options provided', async function () {
            await expectThrowsAsync(() => buildFoundationsApiProtectiveMonitoring('testEnvironment'), 'Either success or exception monintoring options are required')
        })
    })

    describe('#buildFoundationsApiResponseOptions', function () {
        it('should return correct result', async function () {
            const returnDataOnly = true
            const protectiveMonitoring = { 'pm': 'protectiveMonitoringOptions' }
            const foundationsApiResponseOptions = buildFoundationsApiResponseOptions(returnDataOnly, protectiveMonitoring)

            expect(foundationsApiResponseOptions).to.have.property('returnDataOnly')
            expect(foundationsApiResponseOptions.returnDataOnly).to.equal(returnDataOnly)

            expect(foundationsApiResponseOptions).to.have.property('protectiveMonitoring')
            expect(foundationsApiResponseOptions.protectiveMonitoring).to.equal(protectiveMonitoring)
        })

        it('should return correct empty result', async function () {
            await expectThrowsAsync(() => buildFoundationsApiResponseOptions(), 'buildFoundationsApiResponseOptions requires params')
        })

        it('should throw error when non boolean value passed for returnDataOnly', async function () {
            await expectThrowsAsync(() => buildFoundationsApiResponseOptions('nonBoolean'), 'returnDataOnly is expected to be a boolean, but received \'nonBoolean\'')
        })
    })
})
