import * as os from "os";
import PropTypes from "prop-types";
import React from "react";

const OS_TYPE = os.type();

interface ILicenseCSPSetupProps {
  onCancel?: () => void;
}

interface ILicenseCSPSetupState {
  license: string;
}

class LicenseCSPSetup extends React.Component<ILicenseCSPSetupProps, ILicenseCSPSetupState> {
  static contextTypes = {
    locale: PropTypes.string,
    localize: PropTypes.func,
  };

  constructor(props: ILicenseCSPSetupProps) {
    super(props);

    this.state = ({
      license: "",
    });
  }

  componentDidMount() {
    Materialize.updateTextFields();
  }

  componentDidUpdate() {
    Materialize.updateTextFields();
  }

  componentWillUnmount() {
    this.handelCancel();
  }

  render() {
    const { localize, locale } = this.context;
    const { license } = this.state;

    const disabledClass = license && this.validateLicense(license) ? "" : "disabled";

    return (
      <React.Fragment>
        <div className="row halftop">
          <div className="col s12">
            <div className="content-wrapper tbody border_group">
              <div className="row" />
              <div className="row">
                <div className="input-field col input-field-csr col s11">
                  <i className="material-icons prefix key-prefix key-label">vpn_key</i>
                  <input
                    id="license"
                    type="text"
                    className={license ? (this.validateLicense(license) ? "valid" : "invalid") : "validate"}
                    name="license"
                    value={license}
                    placeholder={localize("License.entered_the_key", locale)}
                    onChange={this.handleLicenseChange}
                  />
                  <label htmlFor="license">
                    {localize("License.key", locale)}
                  </label>
                </div>
                <div className="col s1">
                  <a onClick={this.paste}>
                    <i className="file-setting-item waves-effect material-icons secondary-content pulse active">content_copy</i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row halfbottom" />

        <div className="row halfbottom">
          <div style={{ float: "right" }}>
            <div style={{ display: "inline-block", margin: "10px" }}>
              <a className="btn btn-text waves-effect waves-light modal-close" onClick={this.handelCancel}>{localize("Common.cancel", locale)}</a>
            </div>
            <div style={{ display: "inline-block", margin: "10px" }}>
              <a className={"btn btn-outlined waves-effect waves-light modal-close " + disabledClass} onClick={this.handleApplyLicense}>{localize("Common.apply", locale)}</a>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }

  paste = () => {
    $("#license").focus();
    document.execCommand("paste");
    $("#license").trigger("autoresize");
  }

  handleLicenseChange = (ev: any) => {
    this.setState({ license: ev.target.value });
  }

  validateLicense = (license: string) => {
    if (license && license.length === 29 && license.match(/^[0-9A-Z]{5}-[0-9A-Z]{5}-[0-9A-Z]{5}-[0-9A-Z]{5}-[0-9A-Z]{5}/)) {
      return true;
    }

    return false;
  }

  handleApplyLicense = () => {
    const { license } = this.state;
    const { localize, locale } = this.context;
    const self = this;

    let cpconfigPath = "";
    let cmnd = "";

    if (OS_TYPE === "Darwin") {
      cpconfigPath = "/opt/cprocsp/sbin/cpconfig";
    } else {
      cpconfigPath = os.arch() === "ia32" ? "/opt/cprocsp/sbin/ia32/cpconfig" : "/opt/cprocsp/sbin/amd64/cpconfig";
    }

    if (OS_TYPE === "Windows_NT") {
      if (parseInt((this.getCPCSPVersion().charAt(0)), 10) < 5) {
        // tslint:disable-next-line:max-line-length
        cmnd = "reg add HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Installer\\UserData\\S-1-5-18\\Products\\7AB5E7046046FB044ACD63458B5F481C\\InstallProperties /v ProductID /t REG_SZ /f /d " + license;
      } else {
        // tslint:disable-next-line:max-line-length
        cmnd = "reg add HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Installer\\UserData\\S-1-5-18\\Products\\08F19F05793DC7340B8C2621D83E5BE5\\InstallProperties /v ProductID /t REG_SZ /f /d " + license;
      }
    } else {
      // tslint:disable-next-line:quotemark
      cmnd = "sh -c " + "\"" + cpconfigPath + ' -license -set ' + "'" + license + "'" + "\"";
    }

    const options = {
      name: "CryptoARM GOST",
    };

    window.sudo.exec(cmnd, options, function (error: Error) {
      if (error) {
        Materialize.toast(localize("License.lic_key_setup_fail", locale), 2000, "toast-lic_key_setup_fail");
      } else {
        Materialize.toast(localize("License.lic_key_setup", locale), 2000, "toast-lic_key_setup");
        self.handelCancel();
      }
    });

    this.handelCancel();
  }

  handelCancel = () => {
    const { onCancel } = this.props;

    if (onCancel) {
      onCancel();
    }
  }

  getCPCSPVersion = () => {
    try {
      return trusted.utils.Csp.getCPCSPVersion();
    } catch (e) {
      return "";
    }
  }
}

export default LicenseCSPSetup;
