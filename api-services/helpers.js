import { HttpHeadersEnum } from '../enums/http-headers.enum'

function checkForRequestConfiguration (requestConfiguration) {
    if (!requestConfiguration) {
        throw new Error('Request Config required')
    }

    return requestConfiguration
}

function addMaxContentLengthToRequestConfiguration (requestConfiguration, maxContentLength) {
    checkForRequestConfiguration(requestConfiguration)

    if (!maxContentLength) {
        throw new Error('maxContentLength required')
    }

    requestConfiguration.maxContentLength = maxContentLength

    return requestConfiguration
}

function addMaxBodyLengthToRequestConfiguration (requestConfiguration, maxBodyLength) {
    checkForRequestConfiguration(requestConfiguration)

    if (!maxBodyLength) {
        throw new Error('maxBodyLength required')
    }

    requestConfiguration.maxBodyLength = maxBodyLength
    return requestConfiguration
}

function buildApiRequestConfig (url, headers, data) {
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

function buildFoundationsApiRequestConfig (url, headers, data, originatingRequestId) {
    const requestConfiguration = buildApiRequestConfig(url, headers, data)

    let requestConfigurationHeaders = requestConfiguration.headers
    if (!requestConfigurationHeaders || !requestConfigurationHeaders['Content-Type']) {
        // No content type, default to json
        requestConfigurationHeaders = requestConfigurationHeaders || {}
        requestConfigurationHeaders['Content-Type'] = 'application/json'
    }

    if (originatingRequestId) {
        // At this point we should always have a headers object
        requestConfigurationHeaders[HttpHeadersEnum.CORRELATION_ID] = originatingRequestId
    }

    requestConfiguration.headers = requestConfigurationHeaders

    return requestConfiguration
}

function buildFoundationsApiProtectiveMonitoring (environment, successfulMonitoringOptions, exceptionMonitoringOptions) {
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

function buildFoundationsApiResponseOptions (protectiveMonitoring) {
    if (!protectiveMonitoring) {
        throw new Error('buildFoundationsApiResponseOptions requires params')
    }

    // Could validate protectiveMonitoring
    const responseOptions = { protectiveMonitoring }

    return responseOptions
}

function validateApiRequestConfig (requestConfiguration) {
    checkForRequestConfiguration(requestConfiguration)

    if (!requestConfiguration.method) {
        throw new Error('Request Config requires a http method')
    }

    if (!requestConfiguration.headers || !requestConfiguration.headers['Content-Type']) {
        throw new Error('Request Config requires a content-type header')
    }
}

export {
    checkForRequestConfiguration,

    addMaxContentLengthToRequestConfiguration,
    addMaxBodyLengthToRequestConfiguration,

    buildApiRequestConfig,

    buildFoundationsApiRequestConfig,
    buildFoundationsApiProtectiveMonitoring,
    buildFoundationsApiResponseOptions,

    validateApiRequestConfig
}
