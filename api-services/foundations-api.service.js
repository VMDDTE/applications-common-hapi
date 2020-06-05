import { ApiService } from './api.service'
import HttpHeaders from '../enums/http-headers.enum'

export class FoundationsApiService extends ApiService {
    /**
     * Calls a GET request to an API.
     *
     * @param {Provide the resource URL} url
     * @param {Provide extra headers if needed} extraHeaders
     */
    async get (url, originatingRequestId, extraHeaders) {
        const headers = {
            ...extraHeaders,
            [HttpHeaders.CORRELATION_ID]: originatingRequestId
        }
        return await super.get(url, headers)
    }

    /**
     * Calls base service ping `GET` request to an API.
     *
     * @param {Provide the base service URL} url
     */
    async healthPing (baseServiceUrl, originatingRequestId) {
        const url = `${baseServiceUrl}/health/Ping`
        // We now call the foudnations-api get method
        return await this.get(url, originatingRequestId)
    }

    processException (httpMethod, url, exception) {
        this.logApiServiceException(httpMethod, url, exception)
        // The original api service created in Licensing, simply consumed the error after logging
    }
}
