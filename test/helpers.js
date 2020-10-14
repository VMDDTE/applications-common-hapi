import chai from 'chai'
import sinon from 'sinon'
const expect = chai.expect

function checkResponseForRequestHeaders (response) {
    expect(response).to.have.nested.property('config.headers')
    return response.config.headers
}

function checkForCorrelationIdHeader (response, expectedCorrelationId) {
    const headers = checkResponseForRequestHeaders(response)
    expect(headers).to.have.property('X-VMD-Request-Id')
    expect(headers['X-VMD-Request-Id']).to.equal(expectedCorrelationId)
}

function checkResponseForRequestData (response) {
    expect(response).to.have.nested.property('config.data')
    return response.config.data
}

function checkRequestData (response, expectedPropertyName, expectedPropertyValue) {
    const data = checkResponseForRequestData(response)
    const parsedData = JSON.parse(data)
    expect(parsedData).to.have.property(expectedPropertyName)
    expect(parsedData[expectedPropertyName]).to.equal(expectedPropertyValue)
}

async function expectThrows (method, errorMessage) {
    let error = null
    try {
        method()
    } catch (err) {
        error = err
    }
    expect(error).to.be.an('Error')
    if (errorMessage) {
        expect(error.message).to.equal(errorMessage)
    }
}

async function expectThrowsAsync (method, errorMessage) {
    let error = null
    try {
        await method()
    } catch (err) {
        error = err
    }
    expect(error).to.be.an('Error')
    if (errorMessage) {
        expect(error.message).to.equal(errorMessage)
    }
}

function checkResponseStatusCode (response, expectedCode) {
    expect(response).to.have.property('status')
    expect(response.status).to.equal(expectedCode)
}

function checkResponseData (response, expectedPropertyName, expectedPropertyValue) {
    expect(response).to.have.property('data')
    expect(response.data).to.have.property(expectedPropertyName)
    expect(response.data[expectedPropertyName]).to.equal(expectedPropertyValue)
}

function checkLoggedErrorDetails (loggedStandardErrorArgs, expectedHttpMethod, expectedUrl, expectedStatus, expectedExceptionStartsWith) {
    const httpMethod = loggedStandardErrorArgs[1]
    expect(httpMethod).to.equal(expectedHttpMethod)

    const url = loggedStandardErrorArgs[2]
    expect(url).to.equal(expectedUrl)

    const loggedError = loggedStandardErrorArgs[4]
    expect(loggedError).to.have.property('errorStatusCode')
    expect(loggedError.errorStatusCode).to.equal(expectedStatus)

    const errorMessageStartsWithReqEx = new RegExp(`^${expectedExceptionStartsWith}`)
    expect(loggedError).to.have.property('errorMessage')
    expect(loggedError.errorMessage).to.match(errorMessageStartsWithReqEx)
}

function checkLoggedProtectiveMonitoringDetails (loggedPmMessage, environment, auditCode, auditDescription) {
    expect(loggedPmMessage).to.have.property('Environment')
    expect(loggedPmMessage.Environment).to.equal(environment)

    expect(loggedPmMessage).to.have.property('AuditCode')
    expect(loggedPmMessage.AuditCode).to.equal(auditCode)

    expect(loggedPmMessage).to.have.property('AuditDescription')
    expect(loggedPmMessage.AuditDescription).to.equal(auditDescription)
}

function buildMockLogger () {
    return {
        logStandardDebug: sinon.spy(),
        logStandardInfo: sinon.spy(),
        logStandardError: sinon.spy()
    }
}

export {
    checkForCorrelationIdHeader,
    checkResponseForRequestData,
    checkRequestData,

    expectThrows,
    expectThrowsAsync,

    checkResponseStatusCode,
    checkResponseData,
    checkLoggedErrorDetails,
    checkLoggedProtectiveMonitoringDetails,

    buildMockLogger
}
