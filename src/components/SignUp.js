import React from 'react'

import { Paper, makeStyles, Typography, Button, Grid, Snackbar} from '@material-ui/core'
import { Input, Form } from './Input';
import { constants } from '../constants/constants';
import api from '../services/api';
import { setUser, setToken } from '../services/auth';
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
	
	const [fullname, setFullName] = React.useState('')
	const [email, setEmail] = React.useState('')
	const [password, setPassword] = React.useState('')
	const [repeatPassword, setRepeatPassword] = React.useState('')

	const [openSnackBar, setOpenSnackBar] = React.useState(false);

	const validateRepeatPassword = () => (repeatPassword === password)

	const handleSubmit = () => {
		api.post('/users', {fullname, email, password}).then((res) => {
			const {token, user} = res.data
			setToken(token)
			setUser(user)
			props.history.push('/')
		}).catch(error => {
			setOpenSnackBar(true)
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
								errorMessages={[constants.fieldRequired]}
								/>
						</Grid>
						<Grid item xs className={classes.gridForm}>
							<Input 
								label={constants.emailLabel}
								stateValue={[email, setEmail]}
								validators={['required', 'isEmail']}
								errorMessages={[constants.fieldRequired, constants.emailIncorrect]}
								/>
						</Grid>
						<Grid item xs className={classes.gridForm}>
							<Input 
								label={constants.passwordLabel}
								type="password"
								stateValue={[password, setPassword]}
								validators={['required', 'isPassword']}
								errorMessages={[constants.fieldRequired, constants.passwordShort]}
								/>
						</Grid>
						<Grid item xs className={classes.gridForm}>
							<Input 
								label={constants.repeatPasswordLabel}
								type="password"
								stateValue={[repeatPassword, setRepeatPassword]}
								validators={['required', 'customValidation']}
								customValidation={validateRepeatPassword}
								errorMessages={[constants.fieldRequired, constants.passwordDifferent]}
								/>
						</Grid>
						<Grid item xs className={classes.gridForm}>								
							<Button
								fullWidth 
								color='primary'
								variant='contained'
								type='submit'
								>{constants.btnLogin}</Button>
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
				open={openSnackBar}
				autoHideDuration={6000}
				onClose={() => setOpenSnackBar(false)}
			>
				<SnackbarContentWrapper
					onClose={() => setOpenSnackBar(false)}
					variant="error"
					message={constants.errorServer}
				/>
			</Snackbar>
		</Paper>
	)
}

export default SignUp
