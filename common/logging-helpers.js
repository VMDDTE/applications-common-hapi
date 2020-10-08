/* global log */
import { isHealthCheckRequest, isResourcesRequest, extractUrl } from './hapi-request.helpers'

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

    // We want to log health check and resources calls as debug
    const isHealthCheck = isHealthCheckRequest(hapiRequest)
    const isResource = isResourcesRequest(hapiRequest)

    if (isHealthCheck || isResource) {
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
