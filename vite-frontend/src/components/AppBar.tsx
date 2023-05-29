import { Menu, Popover } from '@headlessui/react';
import React, { Component } from 'react';
import { BsList, BsGear } from 'react-icons/bs';
import SettingsDialog from './SettingsDialog';

interface Props {
  theme: string;
  onChangeTheme: (theme: string) => void;
}

type State = {
  selectTheme: string;
  showModal: boolean;
};

class AppBar extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      selectTheme: props.theme,
      showModal: false,
    };
  }

  handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTheme = event.target.value;
    this.props.onChangeTheme(selectedTheme);
    this.setState({ selectTheme: selectedTheme });
    console.log('handleThemeChange', selectedTheme);
  };

  closeModal = () => {
    this.setState({ showModal: false });
  };

  render() {
    return (
      <div className="flex flex-col">
        <SettingsDialog showModal={this.state.showModal} closeModal={this.closeModal} />
        <div className="flex flex-row justify-between items-center shadow bg-base ">
          <div className="flex-none">
            <div className="dropdown">
              <button tabIndex={0} className="btn btn-primary">
                <BsList className="stroke-primary-content scale-150" />
              </button>
              <ul
                tabIndex={0}
                className="dropdown-content shadow-md bg-opacity-80 menu p-2 bg-neutral text-neutral-content shadow rounded-box w-52">
                <li>
                  <a>Item 1</a>
                </li>
                <li>
                  <a>Stop all whisper tasks</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="grow text-center">
            <h1 className="text-3xl text-base-content">Whisper Task</h1>
          </div>
          <div className="flex justify-center items-center space-x-2">
            <label className="text-base-content text-opacity-40">Theme</label>
            <select
              className="rounded "
              value={this.state.selectTheme}
              onChange={this.handleThemeChange}>
              <option value="dark">dark</option>
              <option value="light">light</option>
              <option value="lofi">lofi</option>
              <option value="retro">retro</option>
              <option value="cyberpunk">cyberpunk</option>
              <option value="aqua">aqua</option>
              <option value="luxury">luxury</option>
              <option value="dracula">dracula</option>
              <option value="cupcake">cupcake</option>
            </select>
            <button className="btn btn-primary" onClick={() => this.setState({ showModal: true })}>
              <BsGear className="stroke-primary-content scale-150" />
            </button>
          </div>
        </div>
        <div>
          <span>abc</span>
        </div>
        <div>
          <span>abc</span>
        </div>
      </div>
    );
  }
}

export default AppBar;
