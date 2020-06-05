import ApiService from './api.service'
import HttpHeaders from '../enums/http-headers.enum'

export default class FoundationsApiService extends ApiService {
    /**
     * Calls a GET request to an API.
     *
     * @param {Provide the resource URL} url
     * @param {Provide originating Request Id if needed for use as correlation id} originatingRequestId
     * @param {Provide extra headers if needed} extraHeaders
     */
    async get (url, originatingRequestId, extraHeaders) {
        const headers = this.addCorrelationIdHeader(extraHeaders, originatingRequestId)
        return await super.get(url, headers)
    }

    /**
     * Calls base service ping `GET` request to an API.
     *
     * @param {Provide the base service URL} url
     */
    async healthPing (baseServiceUrl, originatingRequestId) {
        const url = `${baseServiceUrl}/health/Ping`
        // We now call the foundations-api get method
        return await this.get(url, originatingRequestId)
    }

    processException (httpMethod, url, exception) {
        this.logApiServiceException(httpMethod, url, exception)
        // The original api service created in Licensing, simply consumed the error after logging
        return exception.response
    }

    addCorrelationIdHeader (headers, correlationId) {
        // Until such time that everything passes a correlation id and we can enforce, only add if we have it otherwise error are seen
        if (!correlationId) {
            return headers
        }

        return {
            ...headers,
            [HttpHeaders.CORRELATION_ID]: correlationId
        }
    }
}
