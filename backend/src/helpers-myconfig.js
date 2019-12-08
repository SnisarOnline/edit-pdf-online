//================================================================//
//********** Common **********************************************//
//================================================================//
let Myconfig = {
  port: process.env.PORT || 3000,
  companyName: "edit-pdf-online",
  homePath: "",
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development'
};

module.exports = Myconfig;
