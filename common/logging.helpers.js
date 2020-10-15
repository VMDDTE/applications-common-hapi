import { extractLogMessageInfoFromHapiRequest, isHealthCheckRequest, isResourceRequest } from './hapi-request.helpers'

// Decide if this is better placed in logging?
export function isTypeOfVmdLogger (vmdLogger) {
    // We dont really care what type of logger is provided as long is it supports logRequestDebug/logRequestInfo/logRequestError
    if (typeof vmdLogger.logRequestDebug !== 'function' || typeof vmdLogger.logRequestInfo !== 'function' || typeof vmdLogger.logRequestError !== 'function') {
        throw new Error('VmdLogger does not provide required methods')
    }
}

export function logRequestInfo (hapiRequest, vmdLogger, actionMessage, properties) {
    const {
        correlationId,
        httpMethod,
        url
    } = extractLogMessageInfoFromHapiRequest(hapiRequest)

    isTypeOfVmdLogger(vmdLogger)

    // We want to log health check and resources calls as debug
    const isHealthCheck = isHealthCheckRequest(hapiRequest)
    const isResource = isResourceRequest(hapiRequest)

    if (isHealthCheck || isResource) {
        vmdLogger.logRequestDebug(correlationId, httpMethod, url, actionMessage, properties)
    } else {
        vmdLogger.logRequestInfo(correlationId, httpMethod, url, actionMessage, properties)
    }
}

export function logRequestError (hapiRequest, vmdLogger, actionMessage, errorStatusCode, errorResponse) {
    const {
        correlationId,
        httpMethod,
        url
    } = extractLogMessageInfoFromHapiRequest(hapiRequest)

    isTypeOfVmdLogger(vmdLogger)

    errorResponse = errorResponse || {}

    const properties = {
        errorStatusCode: errorStatusCode || '-',
        errorMessage: errorResponse.message || '-'
    }
    // Error data seems less common, so only add property of specified
    if (errorResponse.data) {
        properties.errorData = errorResponse.data
    }

    vmdLogger.logRequestError(correlationId, httpMethod, url, actionMessage, properties)
}
