// Initially designed to be a generic ApiService to handle api calls in a standard way, but using axois
import axios from 'axios'

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

    buildApiRequestConfig (url, headers, data) {
        const requestConfig = { url }
        if (headers) {
            requestConfig.headers = headers
        }
        if (data) {
            requestConfig.data = data
        }
        return requestConfig
    }

    addMaxContentLengthToRequestConfiguration (requestConfiguration, maxContentLength) {
        if (maxContentLength) {
            requestConfiguration.maxContentLength = maxContentLength
        }
        return requestConfiguration
    }

    addMaxBodyLengthToRequestConfiguration (requestConfiguration, maxBodyLength) {
        if (maxBodyLength) {
            requestConfiguration.maxBodyLength = maxBodyLength
        }
        return requestConfiguration
    }

    async actionRequest (requestConfig, responseOptions) {
        this.validateRequestConfig(requestConfig)
        return await this.axiosClient(requestConfig)
            .then(response => this.processResponse(response, responseOptions))
            .catch(exception => this.processException(exception, requestConfig, responseOptions))
    }

    validateRequestConfig (requestConfig) {
        if (!requestConfig) {
            throw new Error('Request Config required')
        }
        if (!requestConfig.method) {
            throw new Error('Request Config requires a http method')
        }
        if (!requestConfig.headers || !requestConfig.headers['Content-Type']) {
            throw new Error('Request Config requires a content-type header')
        }
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

    logApiServiceException (httpMethod, url, exception) {
        // What case should this be?
        this.logger.error({
            'ErrorStatus': exception.response.status,
            'ApiServiceUrl': `[${httpMethod.toUpperCase()}] ${url}`,
            'Exception': exception
        })
    }
}
