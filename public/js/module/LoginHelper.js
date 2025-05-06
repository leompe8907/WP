var LoginHelper = {
  licenses: [],
  activationIterative: false,
  activationFailIfInUse: true,

  configure: function(licenses, activationIterative, activationFailIfInUse) {
    this.licenses = licenses;
    this.activationIterative = activationIterative;
    this.activationFailIfInUse = activationFailIfInUse;
  },

  loginAndActivateLicense: function (user, password, automatic, hasLicenseCredentials, license, pin, cbLoginFailed, cbActivationSuccessfull, cbActivationFailed) {
    var self = this;

    cv.clientLogin(user, password, automatic, function () {

      self.getClientConfig(hasLicenseCredentials, license, pin, cbLoginFailed, cbActivationSuccessfull, cbActivationFailed);

    }, function (result) {
      if (cbLoginFailed) {
        cbLoginFailed(result);
      }
    });
  },

  getClientConfig: function (hasLicenseCredentials, license, pin, cbLoginFailed, cbActivationSuccessfull, cbActivationFailed) {
    var self = this;

    cv.getClientConfig(function () {
      if (hasLicenseCredentials) {

        if (license != null && license != '') {
          self.changeFirstLicense(license, pin);
        }

        self.autoActivateLicense(0, cbActivationSuccessfull, cbActivationFailed);
      } else {
        if (cbActivationFailed) {
          cbActivationFailed();
        }
      }
    }, function (result) {
      console.log("Has user but pending config and license. Go to Login");
      if (cbLoginFailed) {
        cbLoginFailed(result);
      }
    });
  },

  changeFirstLicense: function (license, pin) {
    if (this.licenses.length == 0) {
      return;
    }

    if (this.licenses[0].key == license) {
      return;
    }

    var filtered = this.licenses.filter(function (item) {
      return item.key != license;
    });

    var licenseObj = {
      key: license,
      pin: pin
    };

    this.licenses = filtered;
    this.licenses.unshift(licenseObj);
  },

  autoActivateLicense: function (index, cbActivationSuccessfull, cbActivationFailed) {
    //debugger;
    if (index >= this.licenses.length || index > CONFIG.app.maxAutoActivateLicense || (index > 0 && !this.activationIterative)) {
      if (cbActivationFailed) {
        cbActivationFailed();
      }
      return;
    }

    var license = this.licenses[index].key;
    var pin = this.licenses[index].pin;
    console.log("Trying to activate license " + license + " (index " + index + ")");

    if ((typeof license == 'undefined' || license == null || license.length == 0) && (typeof pin == 'undefined' || pin == null || pin.length == 0)) {
      this.autoActivateLicense(index + 1);
      return;
    }

    this.activateLicense(license, pin, index, cbActivationSuccessfull, cbActivationFailed);
  },

  activateLicense: function (license, pin, index, cbActivationSuccessfull, cbActivationFailed) {
    var self = this;
    User.setLicenseToActivate(license);

    cv.activateStreamingLicense(license, pin, this.activationFailIfInUse, function () {
      console.log("License activated successfully: " + license + " (index: " + index + ")");
      if (cbActivationSuccessfull) {
        cbActivationSuccessfull();
      }
    }, function (error) {
      console.log("Error auto activation license " + license + " with pin " + pin + ". Error: " + error);

      if (index >= 0) {
        index = index + 1;
        self.autoActivateLicense(index, cbActivationSuccessfull, cbActivationFailed);
      } else {
        if (cbActivationFailed) {
          cbActivationFailed();
        }
      }
    });
  }

};
