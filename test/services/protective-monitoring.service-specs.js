/* eslint-disable no-unused-expressions */
/* eslint-disable no-new */

import { describe, it } from 'mocha'
import chai from 'chai'
import sinon from 'sinon'
import { ProtectiveMonitoringService } from '../../services/protective-monitoring.service'

const expect = chai.expect

describe('ProtectiveMonitoring.Service', function () {
    describe('#ctor', function () {
        it('should construct correctly', function () {
            let mockedLog4js = {
                getLogger: function (logName) {
                    if (logName === 'protective-monitoring') {
                        return {}
                    }
                    return null
                }
            }
            expect(() => { new ProtectiveMonitoringService(mockedLog4js) }).not.throw()
        })

        it('should error when no log4js passed', function () {
            expect(() => { new ProtectiveMonitoringService() }).to.throw('ProtectiveMonitoringService requires a log4js')
        })

        it('should error when object with no getLogger method is passed', function () {
            expect(() => { new ProtectiveMonitoringService({}) }).to.throw('ProtectiveMonitoringService requires a log4js')
        })

        it('should error when no protective monitor logger is found', function () {
            let mockedLog4js = {
                getLogger: sinon.spy()
            }
            expect(() => { new ProtectiveMonitoringService(mockedLog4js) }).to.throw('ProtectiveMonitoringService requires a log4js protective monitor logger')
        })
    })

    describe('#monitorEventInformation', function () {
        it('should log info message with correct details', async function () {
            const mockedPmLogger = { info: sinon.spy(), error: sinon.spy() }
            let mockedLog4js = {
                getLogger: function (logName) {
                    if (logName === 'protective-monitoring') {
                        return mockedPmLogger
                    }
                    return null
                }
            }
            const protectiveMonitoringService = new ProtectiveMonitoringService(mockedLog4js)

            const environment = 'test'
            const auditCode = 12345
            const auditDescription = 'something has been protectively monitored'
            protectiveMonitoringService.monitorEventInformation(environment, { auditCode, auditDescription })

            expect(mockedPmLogger.info.calledOnce).to.be.true
            expect(mockedPmLogger.error.calledOnce).to.be.false
            const loggedInfoMessage = JSON.parse(mockedPmLogger.info.firstCall.args[0])

            expect(loggedInfoMessage).to.have.property('Environment')
            expect(loggedInfoMessage.Environment).to.equal(environment)

            expect(loggedInfoMessage).to.have.property('AuditCode')
            expect(loggedInfoMessage.AuditCode).to.equal(auditCode)

            expect(loggedInfoMessage).to.have.property('AuditDescription')
            expect(loggedInfoMessage.AuditDescription).to.equal(auditDescription)
        })
    })

    describe('#monitorEventError', function () {
        it('should log error message with correct details', async function () {
            const mockedPmLogger = { info: sinon.spy(), error: sinon.spy() }
            let mockedLog4js = {
                getLogger: function (logName) {
                    if (logName === 'protective-monitoring') {
                        return mockedPmLogger
                    }
                    return null
                }
            }
            const protectiveMonitoringService = new ProtectiveMonitoringService(mockedLog4js)

            const environment = 'test'
            const auditCode = 12345
            const auditDescription = 'something has been protectively monitored'
            protectiveMonitoringService.monitorEventError(environment, { auditCode, auditDescription })

            expect(mockedPmLogger.info.calledOnce).to.be.false
            expect(mockedPmLogger.error.calledOnce).to.be.true
            const loggedErrorMessage = JSON.parse(mockedPmLogger.error.firstCall.args[0])

            expect(loggedErrorMessage).to.have.property('Environment')
            expect(loggedErrorMessage.Environment).to.equal(environment)

            expect(loggedErrorMessage).to.have.property('AuditCode')
            expect(loggedErrorMessage.AuditCode).to.equal(auditCode)

            expect(loggedErrorMessage).to.have.property('AuditDescription')
            expect(loggedErrorMessage.AuditDescription).to.equal(auditDescription)
        })
    })
})
