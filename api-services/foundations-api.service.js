import { ApiService } from './api.service'
import { buildFoundationsApiRequestConfig } from './helpers'

export class FoundationsApiService extends ApiService {
    constructor (logger, protectiveMonitoringService) {
        super(logger)

        // Should protective monitor service be required?
        this.protectiveMonitoringService = protectiveMonitoringService
    }

    /**
     * Calls base service ping `GET` request to an API.
     *
     * @param {Provide the base service URL} url
     */
    async healthPing (baseServiceUrl, originatingRequestId) {
        const url = `${baseServiceUrl}/health/ping`
        return await super.get(buildFoundationsApiRequestConfig(url, null, null, originatingRequestId))
    }

    // Successful response processing

    processResponse (response, foundationApiRequestOptions) {
        if (!foundationApiRequestOptions) {
            return response
        }

        this.processProtectiveMonitoring(foundationApiRequestOptions.protectiveMonitoring, response)

        return response
    }

    // Exception response processing

    processException (exception, foundationApiRequestConfig, foundationApiRequestOptions) {
        this.logException(foundationApiRequestConfig, exception)

        // The original api service created in Licensing, simply consumed the error after logging, however returning the response will be more useful
        if (!foundationApiRequestOptions) {
            return exception.response
        }

        this.processProtectiveMonitoring(foundationApiRequestOptions.protectiveMonitoring, null, exception)

        return exception.response
    }

    logException (foundationApiRequestConfig, exception) {
        this.logApiServiceException(foundationApiRequestConfig.method, foundationApiRequestConfig.url, exception)
    }

    // Protective monitoring

    processProtectiveMonitoring (protectiveMonitoring, response, exception) {
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
        if (!this.protectiveMonitoringService) {
            throw new Error('protectivelyMonitorSuccessfulEvent requires a protectiveMonitoringService')
        }

        this.protectiveMonitoringService.monitorEventInformation(environment, successfulMonitoringOptions)
    }

    protectivelyMonitorExceptionEvent (environment, exceptionMonitoringOptions, exception) {
        if (!this.protectiveMonitoringService) {
            throw new Error('protectivelyMonitorExceptionEvent requires a protectiveMonitoringService')
        }

        this.protectiveMonitoringService.monitorEventError(environment, exceptionMonitoringOptions)
    }
}
