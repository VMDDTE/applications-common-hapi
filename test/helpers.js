import chai from 'chai'
const expect = chai.expect

function checkForCorrelationIdHeader (response, expectedCorrelationId) {
    expect(response).to.have.nested.property('config.headers')
    expect(response.config.headers).to.have.property('X-VMD-Request-Id')
    expect(response.config.headers['X-VMD-Request-Id']).to.equal(expectedCorrelationId)
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

function checkLoggedErrorDetails (loggedError, expectedStatus, expectedApiServiceUrl, expectedExceptionStartsWith) {
    expect(loggedError).to.have.property('ErrorStatus')
    expect(loggedError.ErrorStatus).to.equal(expectedStatus)

    expect(loggedError).to.have.property('ApiServiceUrl')
    expect(loggedError.ApiServiceUrl).to.equal(expectedApiServiceUrl)

    expect(loggedError).to.have.property('Exception')

    const errorMessageStartsWithReqEx = new RegExp(`^${expectedExceptionStartsWith}`)
    expect(loggedError.Exception).to.match(errorMessageStartsWithReqEx)
}

module.exports = {
    checkForCorrelationIdHeader,
    expectThrowsAsync,
    checkLoggedErrorDetails
}
