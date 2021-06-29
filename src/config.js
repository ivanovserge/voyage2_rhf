const dev = {
  instance: process.env.REACT_APP_INSTANCE,
  api: `${process.env.REACT_APP_INSTANCE}/b2c/api/`
};

const prod = {
  instance: '../../../',
  api: '../../api/'
};

const config = process.env.NODE_ENV === 'production' ? prod : dev;

export default config;
