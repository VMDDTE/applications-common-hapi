import { extractLogMessageInfoFromHapiRequest, isHealthCheckRequest, isResourceRequest } from './hapi-request.helpers'

// Decide if this is better placed in logging?
export function isTypeOfVmdLogger (vmdLogger) {
    // We dont really care what type of logger is provided as long is it supports logStandardDebug/logStandardInfo/logStandardError
    if (typeof vmdLogger.logStandardDebug !== 'function' || typeof vmdLogger.logStandardInfo !== 'function' || typeof vmdLogger.logStandardError !== 'function') {
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
        vmdLogger.logStandardDebug(correlationId, httpMethod, url, actionMessage, properties)
    } else {
        vmdLogger.logStandardInfo(correlationId, httpMethod, url, actionMessage, properties)
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
        errorStatusCode: errorStatusCode || 'No error status code',
        errorData: errorResponse.data || 'No error data',
        errorMessage: errorResponse.message || 'No error message'
    }

    vmdLogger.logStandardError(correlationId, httpMethod, url, actionMessage, properties)
}
