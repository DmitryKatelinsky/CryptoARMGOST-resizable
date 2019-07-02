import PropTypes from "prop-types";
import React from "react";
import { bytesToSize } from "../../utils";
import FileIcon from "../Files/FileIcon";
import SignerCertificateInfo from "../SignerCertificateInfo";
import SignatureStatus from "./SignatureStatus";

class SignatureInfoBlock extends React.Component<any, any> {
  static contextTypes = {
    locale: PropTypes.string,
    localize: PropTypes.func,
  };

  render() {
    const { signerCertificate, file, signatures, handleActiveCert, handleNoShowSignatureInfo, handleNoShowSignerCertificateInfo } = this.props;
    const { localize, locale } = this.context;

    if (!signatures) {
      return null;
    }

    if (signerCertificate) {
      return <SignerCertificateInfo handleBackView={handleNoShowSignerCertificateInfo} certificate={signerCertificate} />;
    }

    const elements = signatures.map((signature: any) => {
      return (
        <SignatureStatus key={signature.id} signature={signature} handleActiveCert={handleActiveCert} />
      );
    });

    const status = this.getSignaturesStatus(signatures);

    return (
      <React.Fragment>
        <div className="row">
          <div className="col s2" style={{ width: "11%" }}>
            <div className={status ? "status_ok_icon" : "status_error_icon"} />
          </div>
          <div className="col s10 " style={{ fontSize: "75%" }}>
            <div className="col s12">
              <div className={status ? "valid" : "unvalid"}>{status ? localize("Sign.sign_ok", locale) : localize("Sign.sign_error", locale)}</div>
              <div className="collection-info cert-info ">{"Проверена:"} {(new Date(signatures[0].verifyingTime)).toLocaleDateString(locale, {
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                month: "numeric",
                year: "numeric",
              })}</div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col s2" style={{ width: "11%" }}>
            <FileIcon file={file} style={{ left: "0px", position: "relative" }} />
          </div>

          <div className="col s10" style={{ fontSize: "75%" }}>
            <div className="col s12">
              <div className="truncate">{file.filename}</div>
            </div>
            <div className="col s7">
              <div className="collection-info cert-info truncate">{(new Date(file.mtime)).toLocaleDateString(locale, {
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                month: "numeric",
                year: "numeric",
              })}
              </div>
            </div>
            <div className="col s4">
              <div className="collection-info cert-info truncate">{bytesToSize(file.filesize)}</div>
            </div>
          </div>
        </div>

        <div className="col s12">
          <hr />
        </div>

        <div>
          {elements}
        </div>
      </React.Fragment>
    );
  }

  getSignaturesStatus = (signatures) => {
    let res = true;

    if (signatures) {
      for (const element of signatures) {
        if (!element.status_verify) {
          res = false;
          break;
        }
      }

      return res;
    } else {
      return false;
    }
  }
}

export default SignatureInfoBlock;
