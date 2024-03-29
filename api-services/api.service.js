// Initially designed to be a generic ApiService to handle api calls in a standard way, but using axois
import axios from 'axios'
import { validateApiRequestConfig, extractLogMessageInfoFromRequestConfig } from './helpers'
import { isTypeOfVmdLogger } from '../common/logging.helpers'

export class ApiService {
    constructor (vmdlogger) {
        if (!vmdlogger) {
            throw new Error('ApiService requires a VmdLogger')
        }

        // We dont care what logger is provided as long is it supports logRequestDebug/logRequestInfo/logRequestError
        if (isTypeOfVmdLogger(vmdlogger)) {
            throw new Error('VmdLogger does not provide required methods')
        }

        this.axiosClient = axios
        this.vmdLogger = vmdlogger
    }

    /**
     * Calls a GET request to an API.
     *
     * @param {Provide the request configuration} requestConfig
     * @param {Provide responseOptions if needed} responseOptions
     */
    async get (requestConfig, responseOptions = null) {
        requestConfig.method = 'GET'
        return await this.actionRequest(requestConfig, responseOptions)
    }

    /**
     * Calls a POST request to an API.
     *
     * @param {Provide the request configuration} requestConfig
     * @param {Provide responseOptions if needed} responseOptions
     */
    async post (requestConfig, responseOptions = null) {
        requestConfig.method = 'POST'
        return await this.actionRequest(requestConfig, responseOptions)
    }

    /**
     * Calls a PUT request to an API.
     *
     * @param {Provide the request configuration} requestConfig
     * @param {Provide responseOptions if needed} responseOptions
     */
    async put (requestConfig, responseOptions = null) {
        requestConfig.method = 'PUT'
        return await this.actionRequest(requestConfig, responseOptions)
    }

    /**
     * Calls a `PATCH` request to an API.
     *
     * @param {Provide the request configuration} requestConfig
     * @param {Provide responseOptions if needed} responseOptions
     */
    async patch (requestConfig, responseOptions = null) {
        requestConfig.method = 'PATCH'
        return await this.actionRequest(requestConfig, responseOptions)
    }

    /**
     * Calls a `DELETE` request to an API.
     *
     * @param {Provide the request configuration} requestConfig
     * @param {Provide responseOptions if needed} responseOptions
     */
    async delete (requestConfig, responseOptions = null) {
        requestConfig.method = 'DELETE'
        return await this.actionRequest(requestConfig, responseOptions)
    }

    /**
     * Calls a HEAD request to an API.
     *
     * @param {Provide the request configuration} requestConfig
     * @param {Provide responseOptions if needed} responseOptions
     */
     async head (requestConfig, responseOptions = null) {
        requestConfig.method = 'HEAD'
        return await this.actionRequest(requestConfig, responseOptions)
    }

    async actionRequest (requestConfig, responseOptions) {
        validateApiRequestConfig(requestConfig)

        this.logActionRequest('ApiService BeginRequest', requestConfig)
        return await this.axiosClient(requestConfig)
            .then(response => this.processResponse(response, responseOptions))
            .catch(exception => this.processException(exception, requestConfig, responseOptions))
            .finally(() => this.logActionRequest('ApiService EndRequest', requestConfig))
    }

    logActionRequest (actionMessage, requestConfig) {
        const { correlationId, httpMethod, url, loggingProperties } = extractLogMessageInfoFromRequestConfig(requestConfig)
        this.logActionRequestMessage(correlationId, httpMethod, url, actionMessage, loggingProperties)
    }

    logActionRequestMessage (correlationId, httpMethod, url, actionMessage, properties) {
        // Providing an overridable method
        this.vmdLogger.logRequestInfo(correlationId, httpMethod, url, actionMessage, properties)
    }

    processResponse (response, _responseOptions) {
        // The default is simply to return the response, but this way allows us to override this behaviour
        return response
    }

    processException (exception, requestConfig, _responseOptions) {
        this.logApiServiceException(requestConfig, exception)
        // Because we are throwing another exception here (correct for generic api!?), we will need to use catch everywhere its used
        throw exception
    }

    logApiServiceException (requestConfig, exception) {
        const { correlationId, httpMethod, url, loggingProperties } = extractLogMessageInfoFromRequestConfig(requestConfig)
        const actionMessage = 'ApiService Exception'
        const properties = {
            ...loggingProperties, // Ensure we add any additional logging properties
            errorStatusCode: exception.response ? exception.response.status || '-' : 'No Response',
            errorMessage: exception
        }

        this.vmdLogger.logRequestError(correlationId, httpMethod, url, actionMessage, properties)
    }
}
