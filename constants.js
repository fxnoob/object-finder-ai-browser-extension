const { generateGuid } = require("./src/services/guid");
const constants = {
  appConfig: {
    appName: "Object Finder AI",
    // put extension key here if required which would only be used in development mode
    key:"-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAniodbRULqdbI5fqDW3p9\n1hHU2WGZzNvf0/spfO416davV7jMvUblpbiZhpoBgUVYGWnbJd0V88tDo3YiI96L\nSAZJ+ZB5QgGxcIrsMT3NpllvoqThNKOo/FK/z+OtUYtDaADVmtxeGe+cDD75n/NO\nrhAAQP7342zA0yKMulNA9bwsGxzLSb0xWUNSk1Rr31VE6egraVZATwSi+ZaG5ZRf\nnKBPhq3Lups3ZmuWYEV+u801oLCwu8vqc9kLPwsmhPGAMau7giyPkR8biWaqpYm3\nFnB8nuNdQv7UXd1OYxHPGUxbJNZlN3m1sLqebKR10lVODZdJdCRkQmLUmiE/j8P7\ngQIDAQAB\n-----END PUBLIC KEY-----",
    endpoint: process.env.mode === "production" ? "https://imagetext.xyz": "http://localhost:3000",
  },
  contentScript: {
    mountId: generateGuid(),
  },
  browser: {
    firefox: {
      manifest: {
        browser_specific_settings: {
          gecko: {
            id: "objectfinderai@fxboob",
            strict_min_version: "42.0",
          },
        },
      },
    },
  },
  support: {
    terms: "https://imagetext.xyz/terms",
    privacyPolicy: "https://imagetext.xyz/privacy",
    donate: "https://www.patreon.com/fxnoob",
    howToVideoLink: "https://youtu.be/x4EhlskT3Uw",
    uninstallFeedbackForm: "https://forms.gle/DHEjQ9Vr1Lnv7e6B6",
  },
  promotion: {
    ocrWebsite: "http://imagetext.xyz/",
    voiceTypingExtension:
      "https://chrome.google.com/webstore/detail/voice-typing/hmpihaioaacpehkghnkmnmgmihalkmdf",
  },
};

module.exports = constants;
