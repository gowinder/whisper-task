import React, { Component, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { EXTENSIONS, LANGUAGE_FULL, TASKS } from '../constrants';
import apiClient from '../utils/apiClient';
import { BsChevronCompactDown, BsChevronCompactUp } from 'react-icons/bs';

interface Props {
  showModal: boolean;
  closeModal: () => void;
}

interface State {
  rootDir: string;
  includeExts: string[];
  rescan: boolean;
  scanInterval: string;
  schedulerInterval: string;
  language: string;
  task: string;
  extSize: number;
}

class SettingsDialog extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      rootDir: '',
      includeExts: [],
      rescan: false,
      scanInterval: '60',
      schedulerInterval: '60',
      language: LANGUAGE_FULL[0],
      task: TASKS[0],
      extSize: 1,
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleIncludeExtSelectChange = this.handleIncludeExtSelectChange.bind(this);
  }

  async componentDidMount() {
    try {
      const response = await apiClient.get('/settings');
      const data = JSON.parse(response.data.values);
      console.log('componentDidMount resp.data', data);
      this.setState({
        rootDir: data.root_dir,
        includeExts: data.include_exts,
        rescan: data.rescan,
        scanInterval: data.scan_interval,
        schedulerInterval: data.scheduler_interval,
        language: data.language,
        task: data.task,
      });
    } catch (error) {
      console.error(error);
    }
  }

  async handleSubmit(event: React.FormEventHandler<HTMLFormElement>) {
    event.preventDefault();
    try {
      // construct a data from this.state
      const data = {
        root_dir: this.state.rootDir,
        include_exts: this.state.includeExts,
        rescan: this.state.rescan,
        scan_interval: this.state.scanInterval,
        scheduler_interval: this.state.schedulerInterval,
        language: this.state.language,
        task: this.state.task,
      };
      const response = await apiClient.post('/settings', { values: JSON.stringify(data) });
      console.log('handleSubmit response', response);
    } catch (error) {
      console.error(error);
    }
  }

  handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const name = event.target.name;
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    console.log('handleInputChange name', name, 'value', value);
    const v = {
      [name]: value,
    } as Pick<State, keyof State>;
    console.log('v', v);
    this.setState(v);
  }

  handleIncludeExtSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(event.target.selectedOptions, (option) => option.value);
    console.log(
      '🚀 ~ file: SettingsDialog.tsx:73 ~ SettingsDialog ~ selectedOptions:',
      selectedOptions,
    );
    this.setState({ includeExts: selectedOptions });
  };

  render() {
    const { showModal, closeModal } = this.props;
    console.log('SettingsDialog, ', this.state.rootDir);
    return (
      <div className={`modal ${showModal ? 'modal-open' : ''}`}>
        <div className="modal-box flex flex-col space-y-2">
          <div className="flex flex-row">
            <h3 className="grow font-bold text-lg text-center">Settings</h3>
            <button className="btn flex-none" onClick={closeModal}>
              X
            </button>
          </div>
          <form onSubmit={this.handleSubmit}>
            <div className="sig">
              <span className="sigl">Scan root</span>
              <input
                type="text"
                name="rootDir"
                placeholder="Type here"
                className="input w-full max-w-xs input-sm  sigr"
                value={this.state.rootDir}
                onChange={this.handleInputChange}
              />
            </div>
            <div className="sig">
              <span className="sigl">Rescan</span>
              <div className="sigr flex mx-2 items-justify">
                <input
                  name="rescan"
                  type="checkbox"
                  className="checkbox checkbox-primary"
                  checked={this.state.rescan}
                  onChange={this.handleInputChange}
                />
              </div>
            </div>
            <div className="sig">
              <span className="sigl">Scan interval</span>
              <div className="sigr flex flex-row">
                <input
                  className="w-16 rounded-md text-right"
                  name="scanInterval"
                  type="number"
                  value={this.state.scanInterval}
                  onChange={this.handleInputChange}
                />
                <span className="ml-1 mr-4">s</span>
                <input
                  name="scanInterval"
                  type="range"
                  min="60"
                  max="86400"
                  value={this.state.scanInterval}
                  className="range range-sm sigr"
                  onChange={this.handleInputChange}
                />
              </div>
            </div>
            <div className="sig">
              <span className="sigl">Scheduler interval</span>
              <div className="sigr flex flex-row">
                <input
                  className="w-16 rounded-md text-right"
                  name="schedulerInterval"
                  type="number"
                  value={this.state.schedulerInterval}
                  onChange={this.handleInputChange}
                />
                <span className="ml-1 mr-4">s</span>
                <input
                  name="schedulerInterval"
                  type="range"
                  min="60"
                  max="86400"
                  value={this.state.schedulerInterval}
                  className="range range-sm sigr"
                  onChange={this.handleInputChange}
                />
              </div>
            </div>
            <div className="sig">
              <span className="sigl">Lanugage</span>
              <select className="rounded sigr" name="language" value={this.state.language}>
                {LANGUAGE_FULL.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
            <div className="sig">
              <span className="sigl">Task</span>
              <select className="rounded" name="task" value={this.state.task}>
                {TASKS.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
            <div className="sig">
              <span className="sigl">Include File EXT</span>
              <div className="sigr flex flex-row justify-center rounded-md overflow-clip">
                {/* NOTE tailwind-scrollbar plugin is required for overflow-clip the scrollbar, otherwise it cannot be rounded */}
                <select
                  name="includeExts"
                  className="rounded-md scrollbar flex-grow"
                  multiple={true}
                  defaultValue={this.state.includeExts}
                  size={this.state.extSize}
                  onChange={this.handleIncludeExtSelectChange}>
                  {EXTENSIONS.map((ext) => (
                    <option className="" value={ext.value} key={ext.value}>
                      {ext.label}
                    </option>
                  ))}
                </select>
                <button
                  className="flex-none"
                  onClick={() => {
                    this.state.extSize === 1
                      ? this.setState({ extSize: 3 })
                      : this.setState({ extSize: 1 });
                  }}>
                  {this.state.extSize === 1 ? (
                    <BsChevronCompactDown className="animate-bounce" />
                  ) : (
                    <BsChevronCompactUp className="animate-bounce" />
                  )}
                </button>
              </div>
            </div>
            <div className="modal-action">
              <button type="submit" className="btn">
                Save!
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default SettingsDialog;
