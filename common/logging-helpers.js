/* global log */
import { isHealthCheckRequest, extractUrl } from './request-helpers'

function logRequestInfo (hapiRequest, message, organisationReference, loggedInUserId) {
    const logMessage = buildBasicLogMessage(getCorrelationIdFromHapiRequest(hapiRequest))
    logMessage.message = message
    logMessage.url = buildLoggingUrl(hapiRequest.method, extractUrl(hapiRequest))

    if (organisationReference) {
        logMessage.organisationReference = organisationReference
    }

    if (loggedInUserId) {
        logMessage.loggedInUserId = loggedInUserId
    }

    // We only want to log health check endpoints as debug
    if (isHealthCheckRequest(hapiRequest)) {
        log.debug(logMessage)
    } else {
        log.info(logMessage)
    }
}

function buildBasicLogMessage (correlationId) {
    const logMessage = {}
    // If a correlation id is provided then define it in the standard way
    if (correlationId) {
        logMessage.vmd = {
            correlationId: correlationId
        }
    }

    return logMessage
}

function logStandardError (hapiRequest, message, statusCode, data, errorMessage) {
    const logMessage = buildBasicLogMessage(getCorrelationIdFromHapiRequest(hapiRequest))
    logMessage.message = message
    logMessage.statusCode = statusCode
    logMessage.data = data
    logMessage.errorMessage = errorMessage

    log.error(logMessage)
}

function buildLoggingUrl (httpMethod, url) {
    return `[${httpMethod.toUpperCase()}] ${url}`
}

// Not currently exposed
function getCorrelationIdFromHapiRequest (hapiRequest) {
    return hapiRequest.info.id
}

export {
    logRequestInfo,
    buildBasicLogMessage,
    logStandardError,
    buildLoggingUrl
}
