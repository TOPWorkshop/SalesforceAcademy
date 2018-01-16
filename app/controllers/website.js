const AbstractController = require('.');

module.exports = class WebsiteController extends AbstractController {
  initRouter() {
    this.router.get('/', (req, res) => WebsiteController.helloWorld(req, res));
  }

  static helloWorld(req, res) {
    res.json('Hello World');
  }
};
