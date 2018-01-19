const salesforce = require('../libraries/salesforce');
const AuthController = require('./auth');
const AbstractController = require('.');

module.exports = class SalesforceController extends AbstractController {
  initRouter() {
    this.router.get('/api/salesforce/contact', AuthController.checkAuthenticated, (req, res) => SalesforceController.getContact(req, res));
    this.router.get('/api/salesforce/assets', AuthController.checkAuthenticated, (req, res) => SalesforceController.getAssets(req, res));
  }

  static async getContact(req, res) {
    const contact = await salesforce.getContact(req.user.email);

    res.json(contact);
  }

  static async getAssets(req, res) {
    const assets = await salesforce.getAssets(req.user.email);

    res.json(assets);
  }
};
