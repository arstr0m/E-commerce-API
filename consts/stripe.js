const Stripe = require('stripe');
const test_secret = Stripe('sk_test_51PagHkJFL8zEtUDyvnfJuWLjrkzjt7r6OzVCly72ilwxzPpvxx9L4CLc5whPVMoHn7KPjD36msIUDxMMRhkJfNV200IIWlFTm6');
const test_publishable = Stripe('pk_test_51PagHkJFL8zEtUDygvrswHCYTeHjp9ojLdYtYfbDHbC2i4by1kvwpVL2MmkPyFejhyhHSXlKGHi1HnHNvdSkNdkf00AgbO6J8R')

module.exports.test_secret = test_secret
module.exports.test_publishable = test_publishable