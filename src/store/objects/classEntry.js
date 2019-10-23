class Entry {

  constructor(id, login, password, service) {
    this.id = id
    this.login = login
    this.password = password
    this.service = service
  }

  set password(password) {
    this.password = password
  }

  get entryInfo() {
    return [this.login, this.password, this.service]
  }

  /* let testArray = []
  testArray[0] = new Entry(dados)
  testArray[1] = new Entry(dados) 
  isso funciona*/

}
