module.exports = {
  webpackDevMiddleware: (config) => {
    config.watchOptions.poll = 300;
    return config;
  },
  env: {
    STRIPE_PUBLIC_KEY:
      'pk_test_51IY5gBEzNqbzg21ZMJ1HuiScaGmv3JdD5Ov0t88QYjHOEAxoL34sIsInOkIMQCl7Ns27RmjDYdbv9G3J1r2cX7M800xphsDJSr',
  },
};
