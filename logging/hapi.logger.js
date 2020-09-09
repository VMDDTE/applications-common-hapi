import cron from 'node-cron'
import path from 'path'
import fs from 'fs'
import simpleNodeLogger from 'simple-node-logger'

export class HapiLogger {
    constructor (config, logDir = 'logs') {
        this.config = config
        this.logDir = logDir

        this.logLevel = this.config.logLevel || 'info'
        this.requiresFileLogging = this.config.requiresFileLogging || false
    }

    buildLogger (serviceName) {
        const nameOffset = serviceName.length + 1

        if (this.requiresFileLogging) {
            console.info('Creating rolling file logger')
            if (!fs.existsSync(this.logDir)) {
                fs.mkdirSync(this.logDir)
            }

            const rollingFileLoggerOptions = {
                level: this.logLevel,
                logDirectory: this.logDir,
                fileNamePattern: serviceName + '-<DATE>.log',
                dateFormat: 'YYYY.MM.DD'
            }

            const rollingFileLogger = simpleNodeLogger.createRollingFileLogger(rollingFileLoggerOptions)
            scheduleLogDeletion(rollingFileLogger, this.logDir, serviceName, nameOffset)
            return rollingFileLogger
        } else {
            console.info('Creating console logger')
            const simpleLogger = simpleNodeLogger.createSimpleLogger()
            simpleLogger.setLevel(this.logLevel)
            return simpleLogger
        }
    }
}

const scheduleLogDeletion = (log, logDir, service, nameOffset) => {
    cron.schedule('0 0 * * *', () => {
        deleteOldLogs(log, logDir, service, nameOffset)
    })
}

const deleteOldLogs = (log, logDir, service, nameOffset) => {
    log.info('Begin deletion of old logs')

    fs.readdir(logDir, function (err, files) {
        if (err) {
            log.error('error reading log files')
        } else {
            files.forEach(function (file) {
                if (file.startsWith(service)) {
                    const currentTime = new Date()
                    const weekFromNow = currentTime - (new Date().getTime() - (7 * 24 * 60 * 60 * 1000))
                    const parts = file.substring(nameOffset).split('.')
                    if (parts.length === 4) {
                        const year = parts[0]
                        const month = parts[1] - 1
                        const date = parts[2]
                        const fileTime = new Date(year, month, date)
                        if ((currentTime - fileTime) > weekFromNow) {
                            deleteFile(log, logDir, file)
                        }
                    }
                }
            })
        }
    })
}

const deleteFile = (log, logDir, file) => {
    log.info('deleting log file', file)
    fs.unlink(path.join(logDir, file),
        function (err) {
            if (err) {
                log.error(err)
            }
            log.info('deleted log file: ' + file)
        })
}

// module.exports.setupLogging = setupLogging
