import {
    Alert,
    Button,
    Container,
    CssBaseline,
    Paper,
    TextField
} from '@mui/material';
import { useState } from 'react';

interface ConfigFormProps {
    onUsername: (username: string) => void
}

export function ConfigForm(props: ConfigFormProps) {

    const [username, setUsername] = useState<string>('')
    const [validation, setValidation] = useState<Error | undefined>();

    const validateUsername = async (username: string) => {
        if (!username) throw Error('invalid username!');
        if (username.length < 4) throw Error('too short!')
        return true;
    }

    return <Container maxWidth="xs"><Paper sx={{ m: 2, p: 2 }}>

        <TextField
            label="username"
            fullWidth
            value={username}
            onChange={(e) => { setUsername(e.target.value); }}
        />

        <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={async () => {
                setValidation(undefined);
                const valid = await validateUsername(username).catch(err => setValidation(err))

                if (valid) { props.onUsername(username); }
            }}>Enter chat</Button>

        {validation && <Alert severity='error'>{validation.message}</Alert>}

    </Paper></Container>
}