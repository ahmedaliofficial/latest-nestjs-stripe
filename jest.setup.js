// eslint-disable-next-line
require('dotenv').config();

const { STRIPE_SECRET_KEY } = process.env;

if (!STRIPE_SECRET_KEY)
  throw new Error('No STRIPE_SECRET_KEY provided in env!');
