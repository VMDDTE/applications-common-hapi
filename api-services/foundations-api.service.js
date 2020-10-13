import { ApiService } from './api.service'
import { buildFoundationsApiRequestConfig } from './helpers'
import { isHealthUrl } from '../common/url-string.helpers'

export class FoundationsApiService extends ApiService {
    constructor (vmdlogger, protectiveMonitoringService) {
        super(vmdlogger)

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

    logActionRequestMessage (correlationId, httpMethod, url, actionMessage, properties) {
        // We only want to log health check endpoints as debug, this is a foundations concept
        if (isHealthUrl(url)) {
            this.vmdLogger.logStandardDebug(correlationId, httpMethod, url, actionMessage, properties)
        } else {
            this.vmdLogger.logStandardInfo(correlationId, httpMethod, url, actionMessage, properties)
        }
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
        this.logApiServiceException(foundationApiRequestConfig, exception)
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
