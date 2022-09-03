import { Box, Button, Container, CssBaseline, Paper, TextField } from '@mui/material';
import { ThemeProvider } from '@mui/system';
import React from 'react';
import { Chat } from './chat';
import { ConfigForm } from './config';
import { getwebsocketurl } from './helpers';
import { chattheme } from './theme';

export interface IAppState {
  username?: string
}

class App extends React.Component<{}, IAppState> {
  state: IAppState = {
    username: localStorage.getItem('username') || undefined,
  }

  minirouter = () => {
    // gets username etc..
    if (!this.state.username) return (
      <ConfigForm onUsername={(username) => {
        localStorage.setItem('username', username);
        this.setState({ username })
      }} />
    );

    return <Chat
      appState={this.state}
      onLogout={() => {
        localStorage.clear();
        this.setState({ username: undefined });
      }} />

  }

  render = () => {
    return (<ThemeProvider theme={chattheme}>
      <CssBaseline />
      {this.minirouter()}
    </ThemeProvider>
    );
  }
}

export default App;
