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
        // This shared library 'api' service was based on the licensing version, in which the get (and only get) was successful then the response data was extracted/returned
        // Due to the generic nature of this shared library I have now made it optional if flag is passed, otherwise full response is returned
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
        // Only add properties if values are present
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
        // The original api service created in Licensing, simply consumed the error after logging, however returning the response will be more useful
        return exception.response
    }
}
