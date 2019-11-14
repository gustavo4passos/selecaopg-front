import React, { useState } from 'react'

import { Paper, makeStyles, Typography, Button, Grid, Snackbar, CircularProgress} from '@material-ui/core'
import { Input, Form } from './Input';
import { constants } from '../constants/constants';
import api from '../services/api';
import { login } from '../services/auth';
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

function SignUp(props) {
	const classes = useStyles()
	
	const [fullname, setFullName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [repeatPassword, setRepeatPassword] = useState('')
	const [snackBar, setSnackBar] = useState({open: false, message: '', type: ''})
	const [isAuthenticating, setAuthenticating] = useState(false)

	const validateRepeatPassword = () => (repeatPassword === password)

	const showError = (message) => {
		setSnackBar({open: true, type: 'error', message})
	}

	const handleSubmit = () => {
		setAuthenticating(true)

		api.post('/users', {fullname, email, password}).then((res) => {
			const {token, user} = res.data

			login(user, token)
			setAuthenticating(false)

			props.history.push('/inscricao')
		}).catch(error => {
			showError(constants.ERROR_SERVER)
			setAuthenticating(false)
			console.log(error)
		})
	}

	const handleSignIn = () => props.history.push('/entrar')

	return (
		<Paper className={classes.root}>
			<Grid container className={classes.grid}>
				<Grid item xs className={classes.gridItem}>
					<Typography variant="h5" align='center' >
						{constants.signupTitle}
					</Typography>
				</Grid>
				<Grid item xs className={classes.gridItem}>
					<Form
						onSubmit={handleSubmit}>
						<Grid item xs className={classes.gridForm}>
							<Input 
								label={constants.fullnameLabel}
								stateValue={[fullname, setFullName]}
								validators={['required']}
								errorMessages={[constants.REQUIRED_FIELD]}
								/>
						</Grid>
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
							<Input 
								label={constants.repeatPasswordLabel}
								type="password"
								stateValue={[repeatPassword, setRepeatPassword]}
								validators={['required', 'customValidation']}
								customValidation={validateRepeatPassword}
								errorMessages={[constants.REQUIRED_FIELD, constants.PASSWORD_DIFF]}
								/>
						</Grid>
						<Grid item xs className={classes.gridForm}>								
							<Button
								fullWidth 
								color='primary'
								variant='contained'
								type='submit'
							>
								{isAuthenticating ? <CircularProgress size={24} color='inherit'/> : constants.btnSignup}
							</Button>
						</Grid>
						<Grid item xs className={classes.gridForm}>								
							<Button
								fullWidth 
								color='primary'
								variant='outlined'
								onClick={handleSignIn}
								>{constants.btnGoToSignIn}</Button>
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
					variant="error"
					message={constants.errorServer}
				/>
			</Snackbar>
		</Paper>
	)
}

export default SignUp
