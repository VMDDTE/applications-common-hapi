// Initially designed to be a generic ApiService to handle api calls in a standard way, but using axois
import axios from 'axios'

export class ApiService {
    constructor (logger) {
        if (!logger) {
            throw new Error('ApiService required a logger')
        }

        this.baseHeaders = { 'Content-Type': 'application/json' }
        this.axiosClient = axios
        this.logger = logger
    }

    /**
     * Calls a GET request to an API.
     *
     * @param {Provide the resource URL} url
     * @param {Provide extra headers if needed} extraHeaders
     */
    async get (url, extraHeaders) {
        const requestConfig = this.buildAxiosRequestConfig('GET', url, extraHeaders)
        return await this.actionRequest(requestConfig)
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
        const requestConfig = this.buildAxiosRequestConfig('POST', url, extraHeaders, data)

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
        const requestConfig = this.buildAxiosRequestConfig('PUT', url, extraHeaders, data)
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
        const requestConfig = this.buildAxiosRequestConfig('PATCH', url, extraHeaders, data)
        return await this.actionRequest(requestConfig)
    }

    buildAxiosRequestConfig (method, url, extraHeaders, data = null) {
        const requestConfig = {
            method,
            url,
            headers: {
                ...this.baseHeaders,
                ...extraHeaders
            }
        }
        if (data) {
            requestConfig.data = data
        }
        return requestConfig
    }

    async actionRequest (axiosRequestConfig) {
        return await this.axiosClient(axiosRequestConfig).catch(exception => this.processException(axiosRequestConfig.method, axiosRequestConfig.url, exception))
    }

    processException (httpMethod, url, exception) {
        this.logApiServiceException(httpMethod, url, exception)
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
