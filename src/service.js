const Server = {
  mock: "mock",
  dev: "dev",
  prod: "prod",
}

const server = process.env.REACT_APP_SERVER
const prodUrl = process.env.REACT_APP_PROD_URL
const getImg = async (token, mode, cap) => {
  let url = ""
  switch (server) {
    case Server.mock:
      return Promise.resolve(`./${mode}_mock.jpg`)
    case Server.dev:
      url = "http://127.0.0.1:5000/entry"
      break
    case Server.prod:
      url = prodUrl
      break
    default:
      throw Error(`No such server: ${server}`)
  }
  let data = {token, mode, cap}
  const res = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  })
  if(res.ok) { return await res.text() }
  else { throw Error(await res.text()) }
}

export {getImg}
