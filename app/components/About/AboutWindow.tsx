import PropTypes from "prop-types";
import React from "react";
import LicenseCSPSetup from "../License/LicenseCSPSetup";
import LicenseInfo from "../License/LicenseInfo";
import LicenseSetupModal from "../License/LicenseSetupModal";
import Modal from "../Modal";

interface ILicenseInfoCSPState {
  showModalLicenseCSPSetup: boolean;
  showModalLicenseSetup: boolean;
}

class AboutWindow extends React.Component<{}, ILicenseInfoCSPState> {
  static contextTypes = {
    locale: PropTypes.string,
    localize: PropTypes.func,
  };

  constructor(props: {}) {
    super(props);

    this.state = ({
      showModalLicenseCSPSetup: false,
      showModalLicenseSetup: false,
    });
  }

  componentDidMount() {
    $(".add-licence-modal-btn").leanModal();
  }

  render() {
    const { localize, locale } = this.context;
    const licenseCsp = this.getLicense();

    return (
      <div className="content-noflex">
        <div className="row">
          <div className="col s8 leftcol">
            <div className="row halfbottom">
              <div className="row halfbottom" />
              <div className="col s12">
                <div className="desktoplic_text_item">{localize("License.About_License", locale)}</div>
                <hr />
                <LicenseInfo />
              </div>
              <div className="col s12">
                <div className="desktoplic_text_item">{localize("License.About_License_CSP", locale)}</div>
                <hr />
                <div className="col s6">
                  <div className="desktoplic_text_item bottomitem">{localize("License.serial_number", locale)}</div>
                  <div className="desktoplic_text_item">{licenseCsp.substring(0, licenseCsp.length - 5)}</div>
                </div>
                <div className="col s6">
                  <div className="desktoplic_text_item bottomitem">{localize("License.lic_status", locale)}</div>
                  <div className="desktoplic_text_item">{this.getLicenseStatus() ? localize("License.license_correct", locale) : localize("License.license_incorrect", locale)}</div>
                </div>
              </div>

              <div className="row" />

              <div className="col s12">
                <div className="desktoplic_text_item">О программе</div>
                <hr />
                <div className="row">
                  <div className="col s12">
                    <div className="desktoplic_text_item">{localize("About.about_programm", locale)}</div>
                  </div>
                </div>
                <div className="col s6">
                  <div className="desktoplic_text_item bottomitem">{localize("About.AppVersion", locale)}</div>
                  <div className="desktoplic_text_item">{`${localize("About.product_NAME", locale)} ${localize("About.version", locale)}`}</div>
                </div>
                <div className="col s6">
                  <div className="desktoplic_text_item bottomitem">{localize("About.developer", locale)}</div>
                  <div className="desktoplic_text_item">{localize("About.company_name", locale)},  {localize("About.address", locale)}</div>
                  <h6 className="contact-text"></h6>
                  <div className="mail-block">
                    <div className="contact-icon"><i className="mail_contact_icon"></i></div>
                    <div className="h6 text-center"><a href="mailto:info@trusted.ru">{localize("About.info", locale)}</a></div>
                  </div>
                </div>
                <div className="row" />
                <div className="col s6">
                  <div className="desktoplic_text_item bottomitem">{localize("About.CspVersion", locale)}</div>
                  <div className="desktoplic_text_item">{localize("Csp.cpcspPKZIVersion", locale)} {this.getCPCSPVersionPKZI()}</div>
                  <div className="desktoplic_text_item">{localize("Csp.cpcspSKZIVersion", locale)} {this.getCPCSPVersionSKZI()}</div>
                </div>
                <div className="col s6">
                  <div className="desktoplic_text_item bottomitem">{localize("About.support", locale)}</div>
                  <div className="mail-block">
                    <div className="contact-icon"><i className="mail_contact_icon"></i></div>
                    <div className="h6 text-center"><a href="mailto:support@trusted.ru">support@trusted.ru</a></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col s4 rightcol">
            <div className="row halfbottom" />
            <div className="col s12">
              <div className="desktoplic_text_item">Управление лицензией КриптоАРМ ГОСТ</div>
              <hr />
              <div className="row" >
                <div className="col s6 waves-effect waves-cryptoarm hover_outline" onClick={this.showModalLicenseSetup}>
                  <div className="col s12 svg_icon">
                    <a data-position="bottom">
                      <i className="material-icons license install" />
                    </a>
                  </div>
                  <div className="col s12 svg_icon_text">{localize("License.enter_key", locale)}</div>
                </div>
                <div className="col s6 waves-effect waves-cryptoarm hover_outline" onClick={() => this.gotoLink(localize("License.link_buy_license", locale))}>
                  <div className="col s12 svg_icon">
                    <a data-position="bottom">
                      <i className="material-icons license buy" />
                    </a>
                  </div>
                  <div className="col s12 svg_icon_text">{localize("License.buy_license", locale)}</div>
                </div>
              </div>
            </div>
            <div className="col s12">
              <div className="desktoplic_text_item">Управление лицензией КриптоПро CSP</div>
              <hr />
              <div className="row" >
                <div className="col s6 waves-effect waves-cryptoarm hover_outline" onClick={this.showModalLicenseCSPSetup}>
                  <div className="col s12 svg_icon">
                    <a data-position="bottom">
                      <i className="material-icons license install" />
                    </a>
                  </div>
                  <div className="col s12 svg_icon_text">{localize("License.enter_key", locale)}</div>
                </div>
                <div className="col s6 waves-effect waves-cryptoarm hover_outline" onClick={() => this.gotoLink(localize("License.link_buy_license_csp", locale))}>
                  <div className="col s12 svg_icon">
                    <a data-position="bottom">
                      <i className="material-icons license buy" />
                    </a>
                  </div>
                  <div className="col s12 svg_icon_text">{localize("License.buy_license", locale)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {this.getModalLicenseCSPSetup()}
        {this.getModalLicenseSetup()}
      </div>
    );
  }

  getCPCSPVersionPKZI = () => {
    try {
      return trusted.utils.Csp.getCPCSPVersion() + "." + trusted.utils.Csp.getCPCSPVersionPKZI();
    } catch (e) {
      return "";
    }
  }

  getCPCSPVersionSKZI = () => {
    try {
      return trusted.utils.Csp.getCPCSPVersion() + "." + trusted.utils.Csp.getCPCSPVersionSKZI() + " " + trusted.utils.Csp.getCPCSPSecurityLvl();
    } catch (e) {
      return "";
    }
  }

  getLicense = () => {
    try {
      return trusted.utils.Csp.getCPCSPLicense();
    } catch (e) {
      return "-";
    }
  }

  getLicenseStatus = () => {
    try {
      return trusted.utils.Csp.checkCPCSPLicense();
    } catch (e) {
      return false;
    }
  }

  gotoLink = (address: string) => {
    window.electron.shell.openExternal(address);
  }

  getModalLicenseCSPSetup = () => {
    const { localize, locale } = this.context;
    const { showModalLicenseCSPSetup } = this.state;

    if (!showModalLicenseCSPSetup) {
      return;
    }

    return (
      <Modal
        isOpen={showModalLicenseCSPSetup}
        header={localize("License.enter_key_csp", locale)}
        onClose={() => {
          this.closeModalLicenseCSPSetup();
          this.forceUpdate();
        }}
        style={{ height: "200px" }}
      >

        <LicenseCSPSetup onCancel={this.closeModalLicenseCSPSetup} />
      </Modal>
    );
  }

  getModalLicenseSetup = () => {
    const { localize, locale } = this.context;
    const { showModalLicenseSetup } = this.state;

    if (!showModalLicenseSetup) {
      return;
    }

    return (
      <Modal
        isOpen={showModalLicenseSetup}
        header={localize("License.enter_key", locale)}
        onClose={() => {
          this.closeModalLicenseSetup();
          this.forceUpdate();
        }}
        style={{ height: "300px" }}
      >

        <LicenseSetupModal text_info={localize("License.entered_the_key", locale)} icon="" onCancel={this.closeModalLicenseSetup} />
      </Modal>
    );
  }

  showModalLicenseCSPSetup = () => {
    this.setState({ showModalLicenseCSPSetup: true });
  }

  closeModalLicenseCSPSetup = () => {
    this.setState({ showModalLicenseCSPSetup: false });
  }

  showModalLicenseSetup = () => {
    this.setState({ showModalLicenseSetup: true });
  }

  closeModalLicenseSetup = () => {
    this.setState({ showModalLicenseSetup: false });
  }
}

export default AboutWindow;
