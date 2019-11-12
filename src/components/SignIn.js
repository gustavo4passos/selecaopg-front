import React from 'react'

import { Paper, makeStyles, Typography, Button, Grid, Snackbar} from '@material-ui/core'
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

	const [email, setEmail] = React.useState('')
	const [password, setPassword] = React.useState('')

	const [openSnackBar, setOpenSnackBar] = React.useState(false);

	const handleSubmit = () => {
		api.post('/sessions', {email, password}).then((res) => {
			const {token, user} = res.data
			setToken(token)
			setUser(user)
			props.history.push('/')
		}).catch(error => {
			setOpenSnackBar(true)
			console.log(error)
		})
	}

	const handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}

		setOpenSnackBar(false);
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
								onClick={handleSignUp}
								>{constants.btnGoToSignUp}</Button>
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

export default SignIn
