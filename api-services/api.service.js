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
     * @param {Provide the resource URL} url
     * @param {Provide extra headers if needed} extraHeaders
     */
    async get (requestConfig, responseOptions) {
        requestConfig.method = 'GET'
        this.validateRequestConfig(requestConfig)
        return await this.actionRequest(requestConfig, responseOptions)
    }

    /**
     * Calls a POST request to an API.
     *
     * @param {Provide the resource URL} url
     * @param {Provide the data payload to be created} data
     * @param {Provide extra headers if needed} extraHeaders
     * @param {Provide maxContentLength if needed} maxContentLength
     * @param {Provide maxBodyLength if needed} maxBodyLength
     */
    async post (url, data, extraHeaders, maxContentLength, maxBodyLength) {
        const requestConfig = this.buildAxiosRequestOptions('POST', url, extraHeaders, data)

        if (maxContentLength) {
            requestConfig.maxContentLength = maxContentLength
        }
        if (maxBodyLength) {
            requestConfig.maxBodyLength = maxBodyLength
        }

        return await this.actionRequest(requestConfig)
    }

    /**
     * Calls a PUT request to an API.
     *
     * @param {Provide the resource URL} url
     * @param {Provide the data payload to be updated} data
     * @param {Provide extra headers if needed} extraHeaders
     */
    async put (url, data, extraHeaders) {
        const requestConfig = this.buildAxiosRequestOptions('PUT', url, extraHeaders, data)
        return await this.actionRequest(requestConfig)
    }

    /**
     * Calls a `PATCH` request to an API.
     *
     * @param {Provide the resource URL} url
     * @param {Provide the data payload to be updated id needed} data
     * @param {Provide extra headers if needed} extraHeaders
     */
    async patch (url, data, extraHeaders) {
        const requestConfig = this.buildAxiosRequestOptions('PATCH', url, extraHeaders, data)
        return await this.actionRequest(requestConfig)
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

    async actionRequest (requestConfig, responseOptions) {
        return await this.axiosClient(requestConfig)
            .then(response => this.processResponse(response, responseOptions))
            .catch(exception => this.processException(exception, requestConfig, responseOptions))
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
