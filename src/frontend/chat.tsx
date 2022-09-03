import React from "react"
import {
    Box,
    Button,
    IconButton,
    Paper,
    TextField,
    Typography
} from "@mui/material"
import { SendRounded } from "@mui/icons-material"
import { IAppState } from "./App"
import { getwebsocketurl } from "./helpers"
import { IChat, IEvent } from "../shared"
import moment from "moment";

interface State {
    message: string
    history: IEvent<IChat>[]
}

interface Props {
    appState: IAppState
    onLogout: () => void
}

export class Chat extends React.Component<Props, State> {
    state: State = {
        message: '',
        history: []
    }
    ws = new WebSocket(getwebsocketurl());

    renderTimer: any;
    messagesEnd: any = undefined;

    componentDidMount = () => {
        this.ws.onopen = () => {
            console.log('connected');
        }

        this.ws.onmessage = (ev) => {

            try {
                this.socketOnMessage(JSON.parse(ev.data) as IEvent<any>)

            } catch (err) { throw err; }
        }

        window.addEventListener("keydown", this.handleKeyPress);

        this.getHistory();

        // trigger a render every 30 seconds to force the moment ago text to update.
        this.renderTimer = setInterval(() => { this.setState({}); }, 1000*30)
    }

    // componentDidUpdate() {
    //     this.scrollToBottom();
    // }

    componentWillUnmount = () => {
        window.removeEventListener("keydown", this.handleKeyPress);
        if (this.renderTimer) clearInterval(this.renderTimer);
    }

    socketOnMessage = async (event: IEvent<any>) => {
        let history = this.state.history;
        history.push(event);
        await this.setState({ history });
        setTimeout(() => { this.scrollToBottom(); }, 100);
    }

    getHistory = async () => {
        const history = await fetch('/api/chat/history').then(r => r.json());
        await this.setState({ history });
        setTimeout(() => { this.scrollToBottom(); }, 100);
    }

    handleKeyPress = (key: KeyboardEvent) => {
        if (key.code === "Enter") this.sendMessage();
    }

    sendMessage = () => {
        if (!this.ws?.OPEN) throw Error('Websocket not connected!');
        if (!this.props.appState.username) throw new Error('missing username');
        if (this.state.message.trim().length === 0) return;

        let newChatMessage: IChat = {
            message: this.state.message,
            username: this.props.appState.username,
        }

        this.ws.send(JSON.stringify(newChatMessage));
        this.setState({ message: '' })
    }

    scrollToBottom = () => {
        if (!this.messagesEnd) return;
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    }

    render = () => {
        return <Box sx={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ m: 1, overflow: 'scroll', flex: 1 }}>
                {this.state.history.map(h => {

                    if (h.type !== "chatmessage") {
                        return <Box key={h.id}>
                            <Typography>{JSON.stringify(h)}</Typography>
                        </Box>
                    }

                    return <Box key={h.id}>
                        <Typography color="primary.main" sx={{ fontSize: '0.75em', display: 'inline', mr: 1 }}>{h.data.username}</Typography>
                        <Typography sx={{ fontSize: '0.75em', opacity: 0.5, display: 'inline' }}>{moment(new Date(h.timestamp).toISOString()).fromNow()}</Typography>

                        <Typography sx={{ fontSize: '1em' }}>{h.data.message}</Typography>
                    </Box>
                })}

                <div style={{ float: "left", clear: "both" }}
                    ref={(el) => { this.messagesEnd = el; }} />

            </Box>

            <Paper sx={{ display: 'flex', p: 1 }} elevation={10}>
                <Button onClick={this.props.onLogout}>
                    {this.props.appState.username}
                </Button>
                <TextField
                    fullWidth
                    value={this.state.message}
                    onChange={(e) => {
                        this.setState({ message: e.target.value })
                    }}
                    size="small" />
                <Box sx={{ ml: 1 }}>
                    <IconButton onClick={() => {
                        this.sendMessage();
                    }}>
                        <SendRounded />
                    </IconButton>
                </Box>
            </Paper>
        </Box>
    }
}