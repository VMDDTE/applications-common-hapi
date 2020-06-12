import { checkForLog4jsProtectiveMonitoring } from './helpers'

export class ProtectiveMonitoringService {
    constructor (log4js) {
        this.log4jsLogger = checkForLog4jsProtectiveMonitoring(log4js, 'ProtectiveMonitoringService')
    }

    buildProtectiveMonitoringOptions (auditCode, auditDescription, pmcDetails, pmcType, pmcCode, priority) {
        return {
            auditCode,
            auditDescription,
            pmcDetails,
            pmcType,
            pmcCode,
            priority
        }
    }

    monitorEventInformation (environment, monitoringOptions) {
        const message = buildProtectiveMonitorMessage(environment, monitoringOptions)
        this.logMessage(true, message)
    }

    monitorEventError (environment, monitoringOptions) {
        const message = buildProtectiveMonitorMessage(environment, monitoringOptions)
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

const buildProtectiveMonitorMessage = function (environment, monitoringOptions) {
    // Foundations has the following message template: {Environment} {AuditCode} {AuditDescription} {PMCDetails} {PMCType} {PMCCode} {Priority}
    // Needs to be upper case property names to align with foundations
    return {
        Environment: environment,
        AuditCode: monitoringOptions.auditCode,
        AuditDescription: monitoringOptions.auditDescription,
        PMCDetails: monitoringOptions.pmcDetails,
        PMCType: monitoringOptions.pmcType,
        PMCCode: monitoringOptions.pmcCode,
        Priority: monitoringOptions.priority
    }
}
