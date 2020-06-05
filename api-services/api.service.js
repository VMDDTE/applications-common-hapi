// Initially designed to be a generic ApiService to handle api calls in a standard way

export class ApiService {
    constructor (httpClient, logger) {
        // presently the httpClient is based around axois, could make sense to enforce/mock axois
        if (!httpClient) {
            throw new Error('ApiService requires a http client')
        }

        if (!logger) {
            throw new Error('ApiService required a logger')
        }

        this.baseHeaders = { 'Content-Type': 'application/json' }
        this.httpClient = httpClient
        this.logger = logger
    }

    /**
     * Calls a GET request to an API.
     *
     * @param {Provide the resource URL} url
     * @param {Provide extra headers if needed} extraHeaders
     */
    async get (url, extraHeaders) {
        const method = 'GET'
        return await this.httpClient({
            headers: {
                ...this.baseHeaders,
                ...extraHeaders
            },
            method,
            url: url }
        ).catch(exception => this.processException(method, url, exception))
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
        const method = 'POST'

        let requestConfig = {
            headers: {
                ...this.baseHeaders,
                ...extraHeaders
            },
            data,
            method,
            url
        }

        if (maxContentLength) {
            requestConfig.maxContentLength = maxContentLength
        }
        if (maxBodyLength) {
            requestConfig.maxBodyLength = maxBodyLength
        }

        return await this.httpClient(requestConfig).catch(exception => this.processException(method, url, exception))
    }

    /**
     * Calls a PUT request to an API.
     *
     * @param {Provide the resource URL} url
     * @param {Provide the data payload to be updated} data
     * @param {Provide extra headers if needed} extraHeaders
     */
    async put (url, data, extraHeaders) {
        const method = 'PUT'
        return await this.httpClient({
            headers: {
                ...this.baseHeaders,
                ...extraHeaders
            },
            data,
            method,
            url: url
        }).catch(exception => this.processException(method, url, exception))
    }

    /**
     * Calls a `PATCH` request to an API.
     *
     * @param {Provide the resource URL} url
     * @param {Provide the data payload to be updated id needed} data
     * @param {Provide extra headers if needed} extraHeaders
     */
    async patch (url, data, extraHeaders) {
        const method = 'PATCH'
        return await this.httpClient({
            headers: {
                ...this.baseHeaders,
                ...extraHeaders
            },
            data,
            method,
            url
        }).catch(exception => this.processException(method, url, exception))
    }

    processException (httpMethod, url, exception) {
        this.logApiServiceException(httpMethod, url, exception)
        // Because we are throwing another exception here (correct for generic api!?), we will need to use catch everywhere it used
        throw exception
    }

    logApiServiceException (httpMethod, url, exception) {
        // What case should this be?
        this.logger.error({ 'ApiServiceUrl': `[${httpMethod.toUpperCase()}] ${url}`, 'Exception': exception })
    }
}
