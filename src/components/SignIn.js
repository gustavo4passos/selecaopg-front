import React from 'react'

import { Paper, makeStyles, Typography, Button, Grid} from '@material-ui/core'
import { Input, Form } from './Input';
import { constants } from '../constants/constants';
import api, { makeLogin } from '../services/api';
import { setUser, setToken, getToken } from '../services/auth';

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
		// backgroundColor: 'red',
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

	const validatePassword = (value) => {
		return (value.length >= 6) ? true : false
	}

	const handleSubmit = () => {
		api.post('/sessions', {email, password}).then((res) => {
			const {token, user} = res.data
			setToken(token)
			setUser(user)
			props.history.push('/inscricao')
		}).catch(error => {
			console.log(error)
		})
    }

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
								errorMessages={['Esse campo é obrigatório', 'Isso não parece um email']}
								/>
						</Grid>
						<Grid item xs className={classes.gridForm}>
							<Input 
								label={constants.passwordLabel}
								type="password"
								stateValue={[password, setPassword]}
								validators={['required']}
								validateField={validatePassword}
								errorMessages={['Esse campo é obrigatório', 'Mínimo de 6 caracteres']}
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
					</Form>
				</Grid>
			</Grid>
		</Paper>
	)
}

export default SignIn
