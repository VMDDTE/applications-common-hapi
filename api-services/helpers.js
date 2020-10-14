import { httpHeadersEnum } from '../enums/http-headers.enum'

export function checkForRequestConfiguration (requestConfiguration) {
    if (!requestConfiguration) {
        throw new Error('Request Config required')
    }

    return requestConfiguration
}

export function addMaxContentLengthToRequestConfiguration (requestConfiguration, maxContentLength) {
    checkForRequestConfiguration(requestConfiguration)

    if (!maxContentLength) {
        throw new Error('maxContentLength required')
    }

    requestConfiguration.maxContentLength = maxContentLength

    return requestConfiguration
}

export function addMaxBodyLengthToRequestConfiguration (requestConfiguration, maxBodyLength) {
    checkForRequestConfiguration(requestConfiguration)

    if (!maxBodyLength) {
        throw new Error('maxBodyLength required')
    }

    requestConfiguration.maxBodyLength = maxBodyLength
    return requestConfiguration
}

export function buildApiRequestConfig (url, headers, data) {
    if (!url) {
        throw new Error('Url is required')
    }

    const requestConfig = { url }
    if (headers) {
        requestConfig.headers = headers
    }
    if (data) {
        requestConfig.data = data
    }
    return requestConfig
}

export function buildFoundationsApiRequestConfig (url, headers, data, originatingRequestId) {
    if (!process.env.COMPONENT) {
        throw new Error('Component is expected in the user environment')
    }

    const requestConfiguration = buildApiRequestConfig(url, headers, data)

    let requestConfigurationHeaders = requestConfiguration.headers

    if (!requestConfigurationHeaders || !requestConfigurationHeaders['Content-Type']) {
        // No content type, default to json
        requestConfigurationHeaders = requestConfigurationHeaders || {}
        requestConfigurationHeaders['Content-Type'] = 'application/json'
    }

    if (originatingRequestId) {
        // At this point we should always have a headers object
        requestConfigurationHeaders[httpHeadersEnum.CORRELATION_ID] = originatingRequestId
    }

    requestConfigurationHeaders['vmd-component'] = process.env.COMPONENT

    requestConfiguration.headers = requestConfigurationHeaders

    return requestConfiguration
}

export function buildFoundationsApiProtectiveMonitoring (environment, successfulMonitoringOptions, exceptionMonitoringOptions) {
    if (!environment) {
        throw new Error('Environment is required')
    }

    if (!successfulMonitoringOptions && !exceptionMonitoringOptions) {
        throw new Error('Either success or exception monintoring options are required')
    }

    return {
        environment,
        successfulMonitoringOptions,
        exceptionMonitoringOptions
    }
}

export function buildFoundationsApiResponseOptions (protectiveMonitoring) {
    if (!protectiveMonitoring) {
        throw new Error('buildFoundationsApiResponseOptions requires params')
    }

    // Could validate protectiveMonitoring
    const responseOptions = { protectiveMonitoring }

    return responseOptions
}

export function validateApiRequestConfig (requestConfiguration) {
    checkForRequestConfiguration(requestConfiguration)

    if (!requestConfiguration.method) {
        throw new Error('Request Config requires a http method')
    }

    if (!requestConfiguration.headers || !requestConfiguration.headers['Content-Type']) {
        throw new Error('Request Config requires a content-type header')
    }
}

function validateResponse (response) {
    if (!response) {
        throw new Error('A response is required')
    }

    if (!response.status) {
        throw new Error('Response doesnt contain a status')
    }
}

export function returnDataIfSuccessfulOrThrowError (response, successStatusCode = 200) {
    validateResponse(response)

    if (response.status === successStatusCode) {
        return response.data
    }
    throwUnexpectedResponseCodeError(response, successStatusCode)
}

export function throwUnexpectedResponseCodeError (response, expectedStatusCode = 200) {
    // Validate response again, because this method can be called separately
    validateResponse(response)

    throw new Error(`Unexpected response code '${response.status}', expected '${expectedStatusCode}'`)
}

export function extractCorrelationId (requestConfiguration) {
    return requestConfiguration.headers[httpHeadersEnum.CORRELATION_ID]
}

export function extractLogMessageInfoFromRequestConfig (requestConfiguration) {
    const correlationId = extractCorrelationId(requestConfiguration)
    const httpMethod = requestConfiguration.method
    const url = requestConfiguration.url

    return {
        correlationId,
        httpMethod,
        url
    }
}
