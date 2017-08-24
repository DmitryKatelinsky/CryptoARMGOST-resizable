import * as React from "react";
import { connect } from "react-redux";
import { deleteFile, selectFile } from "../AC";
import { encrypt } from "../module/encrypt_app";
import { lang, LangApp } from "../module/global_app";
import * as native from "../native";
import { activeFilesSelector } from "../selectors";
import * as encrypts from "../trusted/encrypt";
import { utils } from "../utils";
import BtnsForOperation from "./BtnsForOperation";
import CertificateBlockForEncrypt from "./CertificateBlockForEncrypt";
import { Dialog } from "./components";
import EncryptSettings from "./EncryptSettings";
import FileSelector from "./FileSelector";

class EncryptWindow extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  encrypt = () => {
    const { files, settings, deleteFile, selectFile } = this.props;

    if (files.length > 0) {
      let format = trusted.DataFormat.PEM;
      let certs = encrypt.get_certificates_for_encrypt;
      let folderOut = settings.outfolder;
      let policies = { deleteFiles: false, archiveFiles: false };
      let res = true;

      if (folderOut.length > 0) {
        if (!utils.dirExists(folderOut)) {
          $(".toast-failed_find_directory").remove();
          Materialize.toast(lang.get_resource.Settings.failed_find_directory, 2000, "toast-failed_find_directory");
          return;
        }
      }

      policies.deleteFiles = settings.delete;
      policies.archiveFiles = settings.archive;

      if (settings.encoding !== lang.get_resource.Settings.BASE) {
        format = trusted.DataFormat.DER;
      }

      if (policies.archiveFiles) {
        let outURI: string;
        if (folderOut.length > 0) {
          outURI = native.path.join(folderOut, lang.get_resource.Encrypt.archive_name);
        } else {
          outURI = native.path.join(native.HOME_DIR, lang.get_resource.Encrypt.archive_name);
        }

        const output = native.fs.createWriteStream(outURI);
        const archive = window.archiver("zip");

        output.on("close", () => {
          $(".toast-files_archived").remove();
          Materialize.toast(lang.get_resource.Encrypt.files_archived, 2000, "toast-files_archived");

          if (policies.deleteFiles) {
            files.forEach((file) => {
              native.fs.unlinkSync(file.fullpath);
            });
          }

          const newPath = encrypts.encryptFile(outURI, certs, policies, format, folderOut);
          if (newPath) {
            files.forEach((file) => {
              deleteFile(file.id);
            });
            selectFile(newPath);
          } else {
            res = false;
          }

          if (res) {
            $(".toast-files_encrypt").remove();
            Materialize.toast(lang.get_resource.Encrypt.files_encrypt, 2000, "toast-files_encrypt");
          } else {
            $(".toast-files_encrypt_failed").remove();
            Materialize.toast(lang.get_resource.Encrypt.files_encrypt_failed, 2000, "toast-files_encrypt_failed");
          }
        });

        archive.on("error", () => {
          $(".toast-files_archived_failed").remove();
          Materialize.toast(lang.get_resource.Encrypt.files_archived_failed, 2000, "toast-files_archived_failed");
        });

        archive.pipe(output);

        files.forEach((file) => {
          archive.append(native.fs.createReadStream(file.fullpath), { name: file.filename });
        });

        archive.finalize();
      } else {
        files.forEach((file) => {
          const newPath = encrypts.encryptFile(file.fullpath, certs, policies, format, folderOut);
          if (newPath) {
            deleteFile(file.id);
            selectFile(newPath);
          } else {
            res = false;
          }
        });

        if (res) {
          $(".toast-files_encrypt").remove();
          Materialize.toast(lang.get_resource.Encrypt.files_encrypt, 2000, "toast-files_encrypt");
        } else {
          $(".toast-files_encrypt_failed").remove();
          Materialize.toast(lang.get_resource.Encrypt.files_encrypt_failed, 2000, "toast-files_encrypt_failed");
        }
      }
    }
  }

  decrypt = () => {
    const { files, settings, deleteFile, selectFile } = this.props;

    if (files.length > 0) {
      const folderOut = settings.outfolder;
      let res = true;

      files.forEach((file) => {
        const newPath = encrypts.decryptFile(file.fullpath, folderOut);
        if (newPath) {
          deleteFile(file.id);
          selectFile(newPath);
        } else {
          res = false;
        }
      });

      if (res) {
        $(".toast-files_decrypt").remove();
        Materialize.toast(lang.get_resource.Encrypt.files_decrypt, 2000, "toast-files_decrypt");
      } else {
        $(".toast-files_decrypt_failed").remove();
        Materialize.toast(lang.get_resource.Encrypt.files_decrypt_failed, 2000, "toast-files_decrypt_failed");
      }
    }
  }

  render() {
    return (
      <div className="main">
        <Dialog />
        <div className="content">
          <div className="content-tem">
            <div className="col s6 m6 l6 content-item">
              <CertificateBlockForEncrypt />
            </div>
            <div className="col s6 m6 l6 content-item">
              <EncryptSettings />
            </div>
          </div>
          <div className="col s6 m6 l6 content-item-height">
            <BtnsForOperation
              btn_name_first={lang.get_resource.Encrypt.encrypt}
              btn_name_second={lang.get_resource.Encrypt.decrypt}
              operation_first={this.encrypt}
              operation_second={this.decrypt}
              operation="encrypt" />
            <FileSelector operation="encrypt" />
          </div>
        </div>
      </div>
    );
  }
}

export default connect((state) => {
  return {
    files: activeFilesSelector(state, { active: true }),
    settings: state.settings.encrypt,
  };
}, { deleteFile, selectFile })(EncryptWindow);
