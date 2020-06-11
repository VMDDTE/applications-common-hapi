import { checkForLog4jsProtectiveMonitoring } from './helpers'

export class ProtectiveMonitoringService {
    constructor (log4js) {
        this.log4jsLogger = checkForLog4jsProtectiveMonitoring(log4js, 'ProtectiveMonitoringService')
    }

    monitorEventInformation (environment, auditCode, auditDescription, pmcDetails, pmcType, pmcCode, priority) {
        const message = buildProtectiveMonitorMessage(environment, auditCode, auditDescription, pmcDetails, pmcType, pmcCode, priority)
        this.logMessage(true, message)
    }

    monitorEventError (environment, auditCode, auditDescription, pmcDetails, pmcType, pmcCode, priority) {
        const message = buildProtectiveMonitorMessage(environment, auditCode, auditDescription, pmcDetails, pmcType, pmcCode, priority)
        this.logMessage(false, message)
    }

    logMessage (isInfoLog, message) {
        // Certainly for writing logs to file we need to stringify to ensure valid json
        const messageAsString = JSON.stringify(message)
        if (isInfoLog) {
            this.log4jsLogger.info(messageAsString)
        } else {
            this.log4jsLogger.error(messageAsString)
        }
    }
}

// Effectively private method

const buildProtectiveMonitorMessage = function (environment, auditCode, auditDescription, pmcDetails, pmcType, pmcCode, priority) {
    // Foundations has the following message template
    // {Environment} {AuditCode} {AuditDescription} {PMCDetails} {PMCType} {PMCCode} {Priority}
    // Needs to be upper case to align with foundations format
    return {
        Environment: environment,
        AuditCode: auditCode,
        AuditDescription: auditDescription,
        PMCDetails: pmcDetails,
        PMCType: pmcType,
        PMCCode: pmcCode,
        Priority: priority
    }
}
