import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";
import {
  LOCATION_CERTIFICATES, LOCATION_CONTAINERS, LOCATION_DOCUMENTS,
  LOCATION_EVENTS, LOCATION_MAIN, LOCATION_SETTINGS,
} from "../constants";

const remote = window.electron.remote;

class SideMenu extends React.Component<{}, {}> {
  static contextTypes = {
    locale: PropTypes.string,
    localize: PropTypes.func,
  };

  shouldComponentUpdate(nextContext: { locale: string }) {
    return (this.context.locale !== nextContext.locale) ? true : false;
  }

  render() {
    const { localize, locale } = this.context;

    return (
      <React.Fragment>
        <nav className="menu-logo">
          <div className="center">
            <Link to="/" className="menuheaderlink" href="/">
              <i className="logo-trusted" />
              <div className="logo-text">
                {localize("About.product_NAME", locale)}
              </div>
            </Link>
          </div>
        </nav>
        <div className="row">
          <Link to={LOCATION_MAIN}>
            {localize("SignAndEncrypt.SignAndEncrypt", locale)}
            <i className="material-icons left sign">mode_edit</i>
          </Link>

          <Link to={LOCATION_DOCUMENTS}>
            {localize("Documents.Documents", locale)}
            <i className="material-icons left document">library_books</i>
          </Link>

          <Link to={LOCATION_CERTIFICATES}>
            {localize("Certificate.Certificate", locale)}
            <i className="material-icons left cert">library_books</i>
          </Link>

          <Link to={LOCATION_CONTAINERS}>
            {localize("Containers.Containers", locale)}
            <i className="material-icons left keystore">library_books</i>
          </Link>

          <Link to={LOCATION_SETTINGS}>
            {localize("Settings.Settings", locale)}
            <i className="material-icons left settings">library_books</i>
          </Link>

          <Link to={LOCATION_EVENTS}>
            {localize("Events.Operations_log", locale)}
            <i className="material-icons left journal">help</i>
          </Link>
        </div>
        <div className="row">
          <div className="menu-elements">
            <div className="row">
              <hr />
              <Link to="/about">
                {localize("About.About", locale)}
                <i className="material-icons left about">about</i>
              </Link>
              <a onClick={() => window.electron.shell.openExternal(localize("Help.link_user_guide", locale))}>
                {localize("Help.Help", locale)}
                <i className="material-icons left license">license</i>
              </a>
              <Link to="/" onClick={() => {
                remote.getGlobal("sharedObject").isQuiting = true;
                remote.getCurrentWindow().close();
              }}>
                {localize("Common.exit", locale)}
                <i className="material-icons left exit">exit_to_app</i>
              </Link>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default SideMenu;
