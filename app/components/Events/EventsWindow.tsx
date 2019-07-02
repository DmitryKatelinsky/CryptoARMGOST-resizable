import * as path from "path";
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { loadAllEvents, loadArchiveLogFile, removeAllEvents } from "../../AC/eventsActions";
import { APP_LOG_FILE } from "../../constants";
import Modal from "../Modal";
import EventTable from "./EventTable";
import FilterEvents from "./FilterEvents";

const dialog = window.electron.remote.dialog;

interface IEventsWindowState {
  isArchiveLogFile: boolean;
  searchValue: string;
  showModalFilterEvents: boolean;
}

interface IEventsWindowProps {
  eventsLoaded: boolean;
  eventsLoading: boolean;
  isDefaultFilters: boolean;
}

interface IEventsWindowDispatch {
  loadAllEvents: () => void;
  loadArchiveLogFile: (filePath: string) => void;
  removeAllEvents: () => void;
}

class EventsWindow extends React.Component<IEventsWindowProps & IEventsWindowDispatch, IEventsWindowState> {
  static contextTypes = {
    locale: PropTypes.string,
    localize: PropTypes.func,
  };

  constructor(props: IEventsWindowProps & IEventsWindowDispatch) {
    super(props);

    this.state = {
      isArchiveLogFile: false,
      searchValue: "",
      showModalFilterEvents: false,
    };
  }

  componentDidMount() {
    $(".btn-floated, .file-setting-item").dropdown({
      alignment: "left",
      belowOrigin: false,
      gutter: 0,
      inDuration: 300,
      outDuration: 225,
    });
  }

  render() {
    const { localize, locale } = this.context;
    const { isArchiveLogFile } = this.state;
    const { isDefaultFilters } = this.props;

    const classDefaultFilters = isDefaultFilters ? "filter_off" : "filter_on";

    return (
      <div className="content-noflex">
        <div className="row">
          <div className="row halfbottom" />

          <div className="col" style={{ width: "calc(100% - 80px)" }}>
            <div className="input-field input-field-csr col s12 border_element find_box">
              <i className="material-icons prefix">search</i>
              <input
                id="search"
                type="search"
                placeholder={localize("EventsTable.search_in_table", locale)}
                value={this.state.searchValue}
                onChange={this.handleSearchValueChange} />
              <i className="material-icons close" onClick={() => this.setState({ searchValue: "" })} style={this.state.searchValue ? { color: "#444" } : {}}>close</i>
            </div>
          </div>
          <div className="col" style={{ width: "40px" }}>
            <a onClick={this.handleShowModalFilterEvents}>
              <i className="file-setting-item waves-effect material-icons secondary-content">filter_list</i>
            </a>
          </div>
          <div className="col" style={{ width: "40px" }}>
            <a className="btn-floated" data-activates="dropdown-btn-for-events">
              <i className="file-setting-item waves-effect material-icons secondary-content">more_vert</i>
            </a>
            <ul id="dropdown-btn-for-events" className="dropdown-content">
              <li><a onClick={this.handleReloadEvents}>{isArchiveLogFile ? localize("EventsTable.goto_current_logfile", locale) : localize("Common.update", locale)}</a></li>
              <li><a onClick={this.handleLoadArchiveLogFile}>{localize("EventsTable.load_archive_logfile", locale)}</a></li>
            </ul>
          </div>
          <div className="col s12">
            <EventTable searchValue={this.state.searchValue} />
          </div>
          {this.showModalCertificateRequest()}
        </div>
      </div>
    );
  }

  showModalCertificateRequest = () => {
    const { localize, locale } = this.context;
    const { showModalFilterEvents } = this.state;

    if (!showModalFilterEvents) {
      return;
    }

    return (
      <Modal
        isOpen={showModalFilterEvents}
        header={localize("Filters.filters_settings", locale)}
        onClose={this.handleCloseModalFilterEvents}>

        <FilterEvents onCancel={this.handleCloseModalFilterEvents} />
      </Modal>
    );
  }

  handleSearchValueChange = (ev: any) => {
    this.setState({ searchValue: ev.target.value });
  }

  handleShowModalFilterEvents = () => {
    this.setState({ showModalFilterEvents: true });
  }

  handleCloseModalFilterEvents = () => {
    this.setState({ showModalFilterEvents: false });
  }

  handleReloadEvents = () => {
    // tslint:disable-next-line:no-shadowed-variable
    const { eventsLoading, loadAllEvents, removeAllEvents } = this.props;

    this.setState({ isArchiveLogFile: false });

    removeAllEvents();

    if (!eventsLoading) {
      loadAllEvents();
    }
  }

  handleLoadArchiveLogFile = () => {
    // tslint:disable-next-line:no-shadowed-variable
    const { eventsLoading, loadArchiveLogFile, removeAllEvents } = this.props;
    const { localize, locale } = this.context;

    if (!window.framework_NW) {
      const file = dialog.showOpenDialog({
        defaultPath: path.dirname(APP_LOG_FILE),
        filters: [
          { name: localize("Events.operations_log", locale), extensions: ["log"] },
        ],
        properties: ["openFile"],
      });
      if (file) {
        removeAllEvents();

        if (!eventsLoading) {
          loadArchiveLogFile(file[0]);
        }

        this.setState({ isArchiveLogFile: true });
      }
    }
  }
}

export default connect((state) => ({
  eventsLoaded: state.events.loaded,
  eventsLoading: state.events.loading,
  isDefaultFilters: state.filters.events.isDefaultFilters,
}), { loadAllEvents, loadArchiveLogFile, removeAllEvents })(EventsWindow);
