// Initially designed to be a generic ApiService to handle api calls in a standard way, but using axois
import axios from 'axios'
import { validateApiRequestConfig, extractLogMessageInfo } from './helpers'

export class ApiService {
    constructor (vmdlogger) {
        if (!vmdlogger) {
            throw new Error('ApiService requires a VmdLogger')
        }

        if (typeof vmdlogger.logStandardInfo !== 'function' || typeof vmdlogger.logStandardError !== 'function') {
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
    async get (requestConfig, responseOptions) {
        requestConfig.method = 'GET'
        return await this.actionRequest(requestConfig, responseOptions)
    }

    /**
     * Calls a POST request to an API.
     *
     * @param {Provide the request configuration} requestConfig
     * @param {Provide responseOptions if needed} responseOptions
     */
    async post (requestConfig, responseOptions) {
        requestConfig.method = 'POST'
        return await this.actionRequest(requestConfig, responseOptions)
    }

    /**
     * Calls a PUT request to an API.
     *
     * @param {Provide the request configuration} requestConfig
     * @param {Provide responseOptions if needed} responseOptions
     */
    async put (requestConfig, responseOptions) {
        requestConfig.method = 'PUT'
        return await this.actionRequest(requestConfig, responseOptions)
    }

    /**
     * Calls a `PATCH` request to an API.
     *
     * @param {Provide the request configuration} requestConfig
     * @param {Provide responseOptions if needed} responseOptions
     */
    async patch (requestConfig, responseOptions) {
        requestConfig.method = 'PATCH'
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
        const { correlationId, httpMethod, url } = extractLogMessageInfo(requestConfig)
        this.logActionRequestMessage(correlationId, httpMethod, url, actionMessage)
    }

    logActionRequestMessage (correlationId, httpMethod, url, actionMessage, properties) {
        // Providing an overridable method
        this.vmdLogger.logStandardInfo(correlationId, httpMethod, url, actionMessage, properties)
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
        const { correlationId, httpMethod, url } = extractLogMessageInfo(requestConfig)
        const actionMessage = 'ApiService Exception'
        // We may want to decide on a consistent error format, but confirmed with Paul a properties object works
        const properties = {}
        properties.errorStatus = exception.response ? exception.response.status : 'No Response'
        properties.exception = exception

        this.vmdLogger.logStandardError(correlationId, httpMethod, url, actionMessage, properties)
    }
}
