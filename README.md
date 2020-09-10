# FTX

React.js Frontend + Eel backend File Transfer Client.

## Building

### React Interface

`npm run build`

### Main Application

`py -m eel index.py build --add-data 'SetupMulticastWin.exe;.\\'`

### `SetupMulticastWin.py`

`py -m PyInstaller --noconsole --onefile SetupMulticastWin.py`

**NOTE: You must build the React Interface before the Main Application since they will be bundled together when building the Main Application**
