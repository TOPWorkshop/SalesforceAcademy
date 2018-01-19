const config = require('config');
const jsforce = require('jsforce');

class Salesforce {
  constructor() {
    this.config = config.get('salesforce');

    this.connection = new jsforce.Connection({
      loginUrl: this.config.loginUrl,
    });
  }

  async login() {
    const { username } = this.config;
    const password = `${this.config.password}${this.config.token}`;

    await this.connection.login(username, password);
  }

  async getContacts() {
    await this.login();

    return this.connection
      .sobject('Contact')
      .find()
      .execute();
  }

  async getContact(email) {
    await this.login();

    const [contact] = await this.connection
      .sobject('Contact')
      .find({
        Email: email,
      })
      .execute();

    return contact;
  }

  async getAssets(contactEmail) {
    await this.login();

    const filter = {};

    if (contactEmail) {
      filter['Contact.Email'] = contactEmail;
    }

    return this.connection
      .sobject('Asset')
      .find(filter)
      .execute();
  }
}

module.exports = new Salesforce();
