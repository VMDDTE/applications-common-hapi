// Initially designed to be a generic ApiService to handle api calls in a standard way, but using axois
import axios from 'axios'
import { validateApiRequestConfig } from './helpers'
import { isHealthUrl } from '../common/url-helpers'

export class ApiService {
    constructor (logger) {
        if (!logger) {
            throw new Error('ApiService required a logger')
        }

        this.axiosClient = axios
        this.logger = logger
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

    processResponse (response, _responseOptions) {
        // The default is sinmply to return the response, but this way allows us to override this behaviour
        return response
    }

    processException (exception, requestConfig, _responseOptions) {
        this.logApiServiceException(requestConfig.method, requestConfig.url, exception)
        // Because we are throwing another exception here (correct for generic api!?), we will need to use catch everywhere its used
        throw exception
    }

    logActionRequest (actionMessage, requestConfig) {
        const httpMethod = requestConfig.method
        const url = requestConfig.url
        const logMessage = {
            'message': actionMessage,
            'apiServiceUrl': this.buildApiServiceUrl(httpMethod, url)
        }

        // We only want to log health check endpoints as debug
        if (isHealthUrl(url)) {
            this.logger.debug(logMessage)
        } else {
            this.logger.info(logMessage)
        }
    }

    logApiServiceException (httpMethod, url, exception) {
        // What case should this be?
        this.logger.error({
            'message': 'ApiService Exception',
            'apiServiceUrl': this.buildApiServiceUrl(httpMethod, url),
            'errorStatus': exception.response ? exception.response.status : 'No Response',
            'exception': exception
        })
    }

    buildApiServiceUrl (httpMethod, url) {
        return `[${httpMethod.toUpperCase()}] ${url}`
    }
}
