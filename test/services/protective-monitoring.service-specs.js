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

    describe('#monitorEvent', function () {
        it('should log info message with correct details', async function () {
            const mockedLogger = { info: sinon.spy(), error: sinon.spy() }
            let mockedLog4js = {
                getLogger: function (logName) {
                    if (logName === 'protective-monitoring') {
                        return mockedLogger
                    }
                    return null
                }
            }
            const protectiveMonitoringService = new ProtectiveMonitoringService(mockedLog4js)

            const environment = 'test'
            const auditCode = 12345
            const auditDescription = 'something has been protectively monitored'
            protectiveMonitoringService.monitorEventInformation(environment, auditCode, auditDescription)

            expect(mockedLogger.info.calledOnce).to.be.true
            expect(mockedLogger.error.calledOnce).to.be.false
            const loggedInfoMessage = mockedLogger.info.firstCall.args[0]

            expect(loggedInfoMessage).to.have.property('environment')
            expect(loggedInfoMessage.environment).to.equal(environment)

            expect(loggedInfoMessage).to.have.property('auditCode')
            expect(loggedInfoMessage.auditCode).to.equal(auditCode)

            expect(loggedInfoMessage).to.have.property('auditDescription')
            expect(loggedInfoMessage.auditDescription).to.equal(auditDescription)
        })

        it('should log error message with correct details', async function () {
            const mockedLogger = { info: sinon.spy(), error: sinon.spy() }
            let mockedLog4js = {
                getLogger: function (logName) {
                    if (logName === 'protective-monitoring') {
                        return mockedLogger
                    }
                    return null
                }
            }
            const protectiveMonitoringService = new ProtectiveMonitoringService(mockedLog4js)

            const environment = 'test'
            const auditCode = 12345
            const auditDescription = 'something has been protectively monitored'
            protectiveMonitoringService.monitorEventError(environment, auditCode, auditDescription)

            expect(mockedLogger.info.calledOnce).to.be.false
            expect(mockedLogger.error.calledOnce).to.be.true
            const loggedErrorMessage = mockedLogger.error.firstCall.args[0]

            expect(loggedErrorMessage).to.have.property('environment')
            expect(loggedErrorMessage.environment).to.equal(environment)

            expect(loggedErrorMessage).to.have.property('auditCode')
            expect(loggedErrorMessage.auditCode).to.equal(auditCode)

            expect(loggedErrorMessage).to.have.property('auditDescription')
            expect(loggedErrorMessage.auditDescription).to.equal(auditDescription)
        })
    })
})
