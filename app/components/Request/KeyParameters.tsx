import noUiSlider from "nouislider";
import PropTypes from "prop-types";
import React from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import { loadAllContainers, removeAllContainers } from "../../AC";
import { ALG_GOST12_256, ALG_GOST12_512, ALG_GOST2001, ALG_RSA } from "../../constants";
import { filteredContainersSelector } from "../../selectors";
import BlockNotElements from "../BlockNotElements";
import ContainersList from "../ContainersList";
import HeaderWorkspaceBlock from "../HeaderWorkspaceBlock";
import ProgressBars from "../ProgressBars";
import { ToolBarWithSearch } from "../ToolBarWithSearch";

interface IKeyUsage {
  cRLSign: boolean;
  dataEncipherment: boolean;
  decipherOnly: boolean;
  digitalSignature: boolean;
  encipherOnly: boolean;
  keyAgreement: boolean;
  keyEncipherment: boolean;
  keyCertSign: boolean;
  nonRepudiation: boolean;
  [key: string]: boolean;
}

interface IExtendedKeyUsage {
  "1.3.6.1.5.5.7.3.1": boolean;
  "1.3.6.1.5.5.7.3.2": boolean;
  "1.3.6.1.5.5.7.3.3": boolean;
  "1.3.6.1.5.5.7.3.4": boolean;
  [key: string]: boolean;
}

interface IKeyParametersProps {
  algorithm: string;
  containerName: string;
  exportableKey: boolean;
  extKeyUsage: IExtendedKeyUsage;
  keyLength: number;
  keyUsage: IKeyUsage;
  handleAlgorithmChange: (ev: any) => void;
  handleInputChange: (ev: any) => void;
  handleKeyUsageChange: (ev: any) => void;
  handleExtendedKeyUsageChange: (ev: any) => void;
  toggleExportableKey: () => void;
}

class KeyParameters extends React.Component<IKeyParametersProps, {}> {
  static contextTypes = {
    locale: PropTypes.string,
    localize: PropTypes.func,
  };

  componentDidMount() {
    /* https://github.com/facebook/react/issues/3667
    * fix onChange for < select >
    */
    $(document).ready(() => {
      $("select").material_select();
    });

    $(document).ready(function () {
      $(".tooltipped").tooltip();
    });

    $(ReactDOM.findDOMNode(this.refs.algorithmSelect)).on("change", this.props.handleAlgorithmChange);

    Materialize.updateTextFields();

    const self = this;
    const slider = document.getElementById("key-length-slider");

    if (slider) {
      if (slider.noUiSlider) {
        slider.noUiSlider.destroy();
      }
      noUiSlider.create(slider, {
        format: wNumb({
          decimals: 0,
        }),
        range: {
          "min": 512,
          "25%": 1024,
          "50%": 2048,
          "75%": 3072,
          "max": 4096,
        },
        snap: true,
        start: self.props.keyLength,
      });

      slider.noUiSlider.on("update", (values, handle) => {
        self.setState({ keyLength: values[handle] });
      });
    }
  }

  componentDidUpdate() {
    Materialize.updateTextFields();
  }

  componentWillUnmount() {
    $(".tooltipped").tooltip("remove");
  }

  render() {
    const { localize, locale } = this.context;
    const { algorithm, containerName, exportableKey, extKeyUsage, keyLength, keyUsage,
      handleAlgorithmChange, handleExtendedKeyUsageChange,
      handleInputChange, handleKeyUsageChange, toggleExportableKey } = this.props;

    return (
      <div className="row">
        <HeaderWorkspaceBlock text={localize("CSR.keys_params", locale)} />
        <br />
        <div className="row">
          <div className="input-field col s12">
            <select className="select" ref="algorithmSelect" value={algorithm} onChange={handleAlgorithmChange} >>
              <option value={ALG_RSA}>RSA</option>
              <option value={ALG_GOST2001}>{localize("Algorithm.id_GostR3410_2001", locale)}</option>
              <option value={ALG_GOST12_256}>{localize("Algorithm.id_tc26_gost3410_12_256", locale)}</option>
              <option value={ALG_GOST12_512}>{localize("Algorithm.id_tc26_gost3410_12_512", locale)}</option>
            </select>
            <label>{localize("CSR.algorithm", locale)}</label>
          </div>
        </div>
        <div className="row">
          <div className="input-field col s12">
            <input
              id="containerName"
              type="text"
              className="validate"
              name="containerName"
              value={containerName}
              onChange={handleInputChange}
            />
            <label htmlFor="containerName">{localize("CSR.container", locale)}</label>
          </div>
        </div>
        {algorithm === "RSA" ?
          <div className="row nobottom">
            <div className="valign-wrapper">
              <div className="col s5">
                <p className="label">{localize("CSR.key_length", locale)}</p>
              </div>
              <div className="col s4">
                <div id="key-length-slider"></div>
              </div>
              <div className="col s3">
                <div id="key-length-value">{keyLength}</div>
              </div>
            </div>
          </div>
          : null}

        <div className="row">
          <div className="col s12">
            <p className="label">
              {localize("CSR.key_usage", locale)}
            </p>
          </div>
          <div className="col s6">
            <div className="input-checkbox">
              <input
                name="dataEncipherment"
                type="checkbox"
                id="dataEncipherment"
                className="checkbox-red"
                checked={keyUsage.dataEncipherment}
                onChange={handleKeyUsageChange}
              />
              <label htmlFor="dataEncipherment" className="truncate tooltipped" data-position="right" data-tooltip={localize("CSR.key_usage_dataEncipherment", locale)}>
                {localize("CSR.key_usage_dataEncipherment", locale)}
              </label>
            </div>
            <div className="input-checkbox">
              <input
                name="keyAgreement"
                type="checkbox"
                id="keyAgreement"
                className="checkbox-red"
                checked={keyUsage.keyAgreement}
                onChange={handleKeyUsageChange}
              />
              <label htmlFor="keyAgreement" className="truncate tooltipped" data-position="right" data-tooltip={localize("CSR.key_usage_keyAgreement", locale)}>
                {localize("CSR.key_usage_keyAgreement", locale)}
              </label>
            </div>
            <div className="input-checkbox">
              <input
                name="keyCertSign"
                type="checkbox"
                id="keyCertSign"
                className="checkbox-red"
                checked={keyUsage.keyCertSign}
                onChange={handleKeyUsageChange}
              />
              <label htmlFor="keyCertSign" className="truncate tooltipped" data-position="right" data-tooltip={localize("CSR.key_usage_keyCertSign", locale)}>
                {localize("CSR.key_usage_keyCertSign", locale)}
              </label>
            </div>
            <div className="input-checkbox">
              <input
                name="decipherOnly"
                type="checkbox"
                id="decipherOnly"
                className="checkbox-red"
                checked={keyUsage.decipherOnly}
                onChange={handleKeyUsageChange}
              />
              <label htmlFor="decipherOnly" className="truncate tooltipped label" data-position="right" data-tooltip={localize("CSR.key_usage_decipherOnly", locale)}>
                {localize("CSR.key_usage_decipherOnly", locale)}
              </label>
            </div>
          </div>
          <div className="col s6">
            <div className="input-checkbox">
              <input
                name="digitalSignature"
                type="checkbox"
                id="digitalSignature"
                className="checkbox-red"
                checked={keyUsage.digitalSignature}
                onChange={handleKeyUsageChange}
              />
              <label htmlFor="digitalSignature" className="truncate tooltipped" data-position="right" data-tooltip={localize("CSR.key_usage_digitalSignature", locale)}>
                {localize("CSR.key_usage_digitalSignature", locale)}
              </label>
            </div>
            <div className="input-checkbox">
              <input
                name="nonRepudiation"
                type="checkbox"
                id="nonRepudiation"
                className="checkbox-red"
                checked={keyUsage.nonRepudiation}
                onChange={handleKeyUsageChange}
              />
              <label htmlFor="nonRepudiation" className="truncate tooltipped" data-position="right" data-tooltip={localize("CSR.key_usage_nonRepudiation", locale)}>
                {localize("CSR.key_usage_nonRepudiation", locale)}
              </label>
            </div>
            <div className="input-checkbox">
              <input
                name="cRLSign"
                type="checkbox"
                id="cRLSign"
                className="checkbox-red"
                checked={keyUsage.cRLSign}
                onChange={handleKeyUsageChange}
              />
              <label htmlFor="cRLSign" className="truncate tooltipped" data-position="right" data-tooltip={localize("CSR.key_usage_cRLSign", locale)}>
                {localize("CSR.key_usage_cRLSign", locale)}
              </label>
            </div>
            <div className="input-checkbox">
              <input
                name="keyEncipherment"
                type="checkbox"
                id="keyEncipherment"
                className="checkbox-red"
                checked={keyUsage.keyEncipherment}
                onChange={handleKeyUsageChange}
              />
              <label htmlFor="keyEncipherment" className="truncate tooltipped" data-position="right" data-tooltip={localize("CSR.key_usage_keyEncipherment", locale)}>
                {localize("CSR.key_usage_keyEncipherment", locale)}
              </label>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col s12">
            <p className="label">
              {localize("CSR.extKeyUsage", locale)}
            </p>
          </div>
          <div className="col s12">
            <div className="input-checkbox">
              <input
                name="1.3.6.1.5.5.7.3.1"
                type="checkbox"
                id="1.3.6.1.5.5.7.3.1"
                className="checkbox-red"
                checked={extKeyUsage["1.3.6.1.5.5.7.3.1"]}
                onChange={handleExtendedKeyUsageChange}
              />
              <label htmlFor="1.3.6.1.5.5.7.3.1" className="truncate tooltipped" data-position="right" data-tooltip="1.3.6.1.5.5.7.3.1">
                {localize("CSR.eku_serverAuth", locale)}
              </label>
            </div>
            <div className="input-checkbox">
              <input
                name="1.3.6.1.5.5.7.3.2"
                type="checkbox"
                id="1.3.6.1.5.5.7.3.2"
                className="checkbox-red"
                checked={extKeyUsage["1.3.6.1.5.5.7.3.2"]}
                onChange={handleExtendedKeyUsageChange}
              />
              <label htmlFor="1.3.6.1.5.5.7.3.2" className="truncate tooltipped" data-position="right" data-tooltip="1.3.6.1.5.5.7.3.2">
                {localize("CSR.eku_clientAuth", locale)}
              </label>
            </div>
            <div className="input-checkbox">
              <input
                name="1.3.6.1.5.5.7.3.3"
                type="checkbox"
                id="1.3.6.1.5.5.7.3.3"
                className="checkbox-red"
                checked={extKeyUsage["1.3.6.1.5.5.7.3.3"]}
                onChange={handleExtendedKeyUsageChange}
              />
              <label htmlFor="1.3.6.1.5.5.7.3.3" className="truncate tooltipped" data-position="right" data-tooltip="1.3.6.1.5.5.7.3.3">
                {localize("CSR.eku_codeSigning", locale)}
              </label>
            </div>
            <div className="input-checkbox">
              <input
                name="1.3.6.1.5.5.7.3.4"
                type="checkbox"
                id="1.3.6.1.5.5.7.3.4"
                className="checkbox-red"
                checked={extKeyUsage["1.3.6.1.5.5.7.3.4"]}
                onChange={handleExtendedKeyUsageChange}
              />
              <label htmlFor="1.3.6.1.5.5.7.3.4" className="truncate tooltipped" data-position="right" data-tooltip="1.3.6.1.5.5.7.3.4">
                {localize("CSR.eku_emailProtection", locale)}
              </label>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col s12 input-radio">
            <input
              name="exportableKey"
              className="with-gap" type="radio"
              id="exportableKey"
              checked={exportableKey}
              onClick={toggleExportableKey}
            />
            <label htmlFor="exportableKey" className="truncate tooltipped" data-position="right" data-tooltip={localize("CSR.exportable_key", locale)}>
              {localize("CSR.exportable_key", locale)}
            </label>
          </div>
        </div>
      </div>
    );
  }
}

export default KeyParameters;