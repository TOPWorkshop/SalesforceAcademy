const salesforce = require('../../../app/libraries/salesforce');

function checkIsContact(contact) {
  expect(contact).toHaveProperty('Id');
  expect(contact).toHaveProperty('IsDeleted');
  expect(contact).toHaveProperty('AccountId');
  expect(contact).toHaveProperty('FirstName');
  expect(contact).toHaveProperty('LastName');
  expect(contact).toHaveProperty('Name');
  expect(contact).toHaveProperty('OwnerId');
  expect(contact).toHaveProperty('Email');
}

function checkIsAsset(asset) {
  expect(asset).toHaveProperty('Id');
  expect(asset).toHaveProperty('ContactId');
  expect(asset).toHaveProperty('IsDeleted');
  expect(asset).toHaveProperty('Name');
  expect(asset).toHaveProperty('SerialNumber');
  expect(asset).toHaveProperty('Description');
}

describe('Library -> Salesforce', () => {
  const email = 'emanuele.seccia@thinkopen.it';

  test('login', () => salesforce.login());

  test('getContacts', async () => {
    const contacts = await salesforce.getContacts();

    contacts.forEach(contact => checkIsContact(contact));
  });

  test('getContact', async () => {
    const contact = await salesforce.getContact(email);

    checkIsContact(contact);
    expect(contact).toHaveProperty('Email', email);
  });

  test('getAssets', async () => {
    const assets = await salesforce.getAssets();

    assets.forEach(asset => checkIsAsset(asset));
  });

  test('getAssets of a Contact', async () => {
    const assets = await salesforce.getAssets(email);

    assets.forEach(asset => checkIsAsset(asset));
  });
});
