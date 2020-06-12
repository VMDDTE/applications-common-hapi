import { ApiService } from './api.service'
import HttpHeaders from '../enums/http-headers.enum'

export class FoundationsApiService extends ApiService {
    constructor (logger, protectiveMonitoringService) {
        super(logger)

        // Should protective monitor service be required?
        this.protectiveMonitoringService = protectiveMonitoringService
    }

    /**
     * Calls a GET request to an API.
     *
     * @param {Provide the resource URL} url
     * @param {Provide originating Request Id if needed for use as correlation id} originatingRequestId
     * @param {Provide extra headers if needed} extraHeaders
     * @param {Indicate if whole response should be returned} returnDataOnly
     */
    async get (foundationApiRequestConfig, foundationsApiResponseOptions) {
        return await super.get(foundationApiRequestConfig, foundationsApiResponseOptions)
    }

    /**
     * Calls base service ping `GET` request to an API.
     *
     * @param {Provide the base service URL} url
     */
    async healthPing (baseServiceUrl, originatingRequestId) {
        const url = `${baseServiceUrl}/health/ping`
        return await super.get(this.buildFoundationsApiRequestConfig(url, null, null, originatingRequestId))
    }

    buildFoundationsApiRequestConfig (url, headers, data, originatingRequestId) {
        const requestConfiguration = this.buildApiRequestConfig(url, headers, data)

        let requestConfigurationHeaders = requestConfiguration.headers
        if (!requestConfigurationHeaders || !requestConfigurationHeaders['Content-Type']) {
            // No content type, default to json
            requestConfigurationHeaders = requestConfigurationHeaders || {}
            requestConfigurationHeaders['Content-Type'] = 'application/json'
        }

        if (originatingRequestId) {
            requestConfigurationHeaders = requestConfigurationHeaders || {}
            requestConfigurationHeaders[HttpHeaders.CORRELATION_ID] = originatingRequestId
        }

        requestConfiguration.headers = requestConfigurationHeaders

        return requestConfiguration
    }

    buildFoundationsApiResponseOptions (returnDataOnly, protectiveMonitoring) {
        const responseOptions = { }

        if (returnDataOnly) {
            responseOptions.returnDataOnly = returnDataOnly
        }
        if (protectiveMonitoring) {
            responseOptions.protectiveMonitoring = protectiveMonitoring
        }
        return responseOptions
    }

    buildFoundationsApiProtectiveMonitoring (environment, successfulMonitoringOptions, exceptionMonitoringOptions) {
        return {
            environment,
            successfulMonitoringOptions,
            exceptionMonitoringOptions
        }
    }

    // Successful response processing

    processResponse (response, foundationApiRequestOptions) {
        if (!foundationApiRequestOptions) {
            return response
        }

        this.processProtectiveMonitoring(foundationApiRequestOptions, response)

        if (foundationApiRequestOptions.returnDataOnly) {
            return response.data
        }

        return response
    }

    // Exception response processing

    processException (exception, foundationApiRequestConfig, foundationApiRequestOptions) {
        this.logStandardException(foundationApiRequestConfig, exception)

        // The original api service created in Licensing, simply consumed the error after logging, however returning the response will be more useful
        if (!foundationApiRequestOptions) {
            return exception.response
        }

        this.processProtectiveMonitoring(foundationApiRequestOptions, null, exception)

        return exception.response
    }

    logStandardException (foundationApiRequestConfig, exception) {
        this.logApiServiceException(foundationApiRequestConfig.method, foundationApiRequestConfig.url, exception)
    }

    // Protective monitoring

    processProtectiveMonitoring (foundationApiRequestOptions, response, exception) {
        const protectiveMonitoring = foundationApiRequestOptions.protectiveMonitoring
        if (!protectiveMonitoring) {
            return
        }

        if (protectiveMonitoring.successfulMonitoringOptions) {
            this.protectivelyMonitorSuccessfulEvent(protectiveMonitoring.environment, protectiveMonitoring.successfulMonitoringOptions, response)
        }

        if (protectiveMonitoring.exceptionMonitoringOptions) {
            this.protectivelyMonitorExceptionEvent(protectiveMonitoring.environment, protectiveMonitoring.exceptionMonitoringOptions, exception)
        }
    }

    protectivelyMonitorSuccessfulEvent (environment, successfulMonitoringOptions, response) {
        if (this.protectiveMonitoringService) {
            this.protectiveMonitoringService.monitorEventInformation(environment, successfulMonitoringOptions)
        }
    }

    protectivelyMonitorExceptionEvent (environment, exceptionMonitoringOptions, exception) {
        if (this.protectiveMonitoringService) {
            this.protectiveMonitoringService.monitorEventError(environment, exceptionMonitoringOptions)
        }
    }
}
