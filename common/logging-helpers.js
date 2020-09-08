/* global log */
import { isHealthCheckRequest } from './request-helpers'

function logRequestInfo (request, organisationReference, loggedInUserId) {
    const logMessage = {
        vmd: {
            correlationId: request.info.id
        },
        path: request.path
    }

    if (organisationReference) {
        logMessage.organisationReference = organisationReference
    }

    if (loggedInUserId) {
        logMessage.loggedInUserId = loggedInUserId
    }

    // We only want to log health check endpoints as debug
    if (isHealthCheckRequest(request)) {
        log.debug(logMessage)
    } else {
        log.info(logMessage)
    }
}

function logStandardError (statusCode, data, message) {
    log.error({
        statusCode,
        data,
        message
    })
}

export {
    logRequestInfo,
    logStandardError
}
