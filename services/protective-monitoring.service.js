import { checkForLog4jsProtectiveMonitoring } from './helpers'

export class ProtectiveMonitoringService {
    constructor (log4js) {
        this.log4jsLogger = checkForLog4jsProtectiveMonitoring(log4js, 'ProtectiveMonitoringService')
    }

    monitorEventInformation (environment, auditCode, auditDescription, pmcDetails, pmcType, pmcCode, priority) {
        this.log4jsLogger.info(buildProtectiveMonitorMessage(environment, auditCode, auditDescription, pmcDetails, pmcType, pmcCode, priority))
    }

    monitorEventError (environment, auditCode, auditDescription, pmcDetails, pmcType, pmcCode, priority) {
        this.log4jsLogger.error(buildProtectiveMonitorMessage(environment, auditCode, auditDescription, pmcDetails, pmcType, pmcCode, priority))
    }
}

// Effectively private method

const buildProtectiveMonitorMessage = function (environment, auditCode, auditDescription, pmcDetails, pmcType, pmcCode, priority) {
    // Foundations has the following message template
    // {Environment} {AuditCode} {AuditDescription} {PMCDetails} {PMCType} {PMCCode} {Priority}
    return {
        environment,
        auditCode,
        auditDescription,
        pmcDetails,
        pmcType,
        pmcCode,
        priority
    }
}
