import { ApiService } from './api.service'
import HttpHeaders from '../enums/http-headers.enum'

export class FoundationsApiService extends ApiService {
    /**
     * Calls a GET request to an API.
     *
     * @param {Provide the resource URL} url
     * @param {Provide originating Request Id if needed for use as correlation id} originatingRequestId
     * @param {Provide extra headers if needed} extraHeaders
     * @param {Indicate if whole response should be returned} returnDataOnly
     */
    async get (foundationApiRequestConfiguration, returnDataOnly = false) {
        const headers = this.addCorrelationIdHeader(foundationApiRequestConfiguration)
        return await super.get(foundationApiRequestConfiguration.url, headers).then(response => this.returnDataOnlyIfSuccessful(response, returnDataOnly))
    }

    returnDataOnlyIfSuccessful (response, returnDataOnly) {
        // The way the previous implementation worked was to only return a response if successful, however we now want to return response if error is seen
        // Originally licensing get requests only expected data to be returned if successful...
        if (returnDataOnly) {
            if (response.status >= 200 && response.status < 300) {
                return response.data
            }
        }

        return response
    }

    /**
     * Calls base service ping `GET` request to an API.
     *
     * @param {Provide the base service URL} url
     */
    async healthPing (baseServiceUrl, originatingRequestId) {
        const url = `${baseServiceUrl}/health/ping`
        // We now call the foundations-api get method
        return await this.get(this.buildFoundationApiRequestConfiguration(url, originatingRequestId))
    }

    buildFoundationApiRequestConfiguration (url, originatingRequestId, extraHeaders) {
        const requestConfiguration = {
            url
        }
        // Only add properties if valuesa are present
        if (originatingRequestId) {
            requestConfiguration.originatingRequestId = originatingRequestId
        }
        if (extraHeaders) {
            requestConfiguration.extraHeaders = extraHeaders
        }
        return requestConfiguration
    }

    addCorrelationIdHeader (foundationApiRequestConfiguration) {
        // Until such time that everything passes a correlation id and we can enforce, only add if we have it otherwise error are seen
        if (!foundationApiRequestConfiguration.originatingRequestId) {
            return foundationApiRequestConfiguration.extraHeaders
        }

        return {
            ...foundationApiRequestConfiguration.extraHeaders,
            [HttpHeaders.CORRELATION_ID]: foundationApiRequestConfiguration.originatingRequestId
        }
    }

    processException (httpMethod, url, exception) {
        this.logApiServiceException(httpMethod, url, exception)
        // The original api service created in Licensing, simply consumed the error after logging
        return exception.response
    }
}
