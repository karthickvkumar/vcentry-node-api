const listAgent = (request, response, next) => {
  response.status(200).send({
    message : 'Agent profiles are listed successfully'
  })
}

const createAgent = (request, response, next) => {
  response.status(200).send({
    message : 'New Agent profiles are created successfully'
  })
}

module.exports = {
  listAgent,
  createAgent
}