import React, { useState } from 'react'

import { Paper, makeStyles, Typography, Button, Grid, Snackbar, CircularProgress} from '@material-ui/core'
import { Input, Form } from './Input';
import { constants } from '../constants/constants';
import api, { makeLogin } from '../services/api';
import { setUser, setToken, getToken } from '../services/auth';
import { SnackbarContentWrapper } from './SnackBar';

const useStyles = makeStyles(theme => ({
	root: {
		width: '100%',
		maxWidth: '500px',
		padding: theme.spacing(4),
		alignItems: 'center',
		display: 'flex'
	},
	grid: {
		width: '100%',
		flexDirection: 'column',
		marginBottom: theme.spacing(5)
	},
	gridItem: {
		alignItems: 'center'
	},
	gridForm: {
		paddingTop: theme.spacing(2),
		width: '100%',
		alignItems: 'center'
	}
}))

function SignIn(props) {
	const classes = useStyles();

	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [snackBar, setSnackBar] = useState({open: false, message: '', type: ''})
	const [isAuthenticating, setAuthenticating] = useState(false)

	const showError = (message) => {
		setSnackBar({open: true, type: 'error', message})
	}

	const handleSubmit = () => {
		setAuthenticating(true)

		api.post('/sessions', {email, password}).then((res) => {
			const {token, user} = res.data

			setToken(token)
			setUser(user)
			setAuthenticating(false)

			props.history.push('/inscricao')
		}).catch((error) => {
			if (!error.response) {
				showError(constants.ERROR_SERVER)
				setAuthenticating(false)
				return
			}

			const { code } = error.response.data

			if (code === constants.USER_NOT_FOUND.code) {
				showError(constants.USER_NOT_FOUND.message)
			} else if (code === constants.INVALID_PASSWORD.code) {
				showError(constants.INVALID_PASSWORD.message)
			} else {
				showError(constants.ERROR_SERVER)
			}

			setAuthenticating(false)
		})
	}

	const handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}

		setSnackBar({...snackBar, open: false});
	};

	const handleSignUp = () => props.history.push('/cadastrar')

	return (
		<Paper className={classes.root}>
			<Grid container className={classes.grid}>
				<Grid item xs className={classes.gridItem}>
					<Typography variant="h5" align='center' >
						{constants.loginTitle}
					</Typography>
				</Grid>
				<Grid item xs className={classes.gridItem}>
					<Form
						onSubmit={handleSubmit}>
						<Grid item xs className={classes.gridForm}>
							<Input 
								label={constants.emailLabel}
								stateValue={[email, setEmail]}
								validators={['required', 'isEmail']}
								errorMessages={[constants.REQUIRED_FIELD, constants.EMAIL_INCORRECT]}
								/>
						</Grid>
						<Grid item xs className={classes.gridForm}>
							<Input 
								label={constants.passwordLabel}
								type="password"
								stateValue={[password, setPassword]}
								validators={['required', 'isPassword']}
								errorMessages={[constants.REQUIRED_FIELD, constants.PASSWORD_SHORT]}
								/>
						</Grid>
						<Grid item xs className={classes.gridForm}>								
							<Button
								fullWidth 
								color='primary'
								variant='contained'
								type='submit'
							>
								{isAuthenticating ? <CircularProgress size={24} color='inherit'/> : constants.btnLogin}
							</Button>
						</Grid>
						<Grid item xs className={classes.gridForm}>								
							<Button
								fullWidth 
								color='primary'
								variant='outlined'
								onClick={handleSignUp}
							>
								{constants.btnGoToSignUp}
							</Button>
						</Grid>
					</Form>
				</Grid>
			</Grid>
			<Snackbar
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left',
				}}
				open={snackBar.open}
				autoHideDuration={6000}
				onClose={() => setSnackBar({...snackBar, open: false})}
			>
				<SnackbarContentWrapper
					onClose={() => setSnackBar({...snackBar, open: false})}
					variant={snackBar.type}
					message={snackBar.message}
				/>
			</Snackbar>
		</Paper>
	)
}

export default SignIn
