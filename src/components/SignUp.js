import React from 'react'

import { Paper, makeStyles, Typography, Button, Grid} from '@material-ui/core'
import { Input, Form } from './Input';
import { constants } from '../constants/constants';
import api from '../services/api';
import { setToken } from '../services/auth';

const useStyles = makeStyles(theme => ({
	root: {
		width: '100%',
		maxWidth: '700px',
		minHeight: '600px',
		padding: theme.spacing(4),
	},
	grid: {
		width: '100%',
		flexDirection: 'column',
		alignItems: 'center',
		// backgroundColor: 'red',
	},
	gridItem: {
		paddingTop: theme.spacing(2),
		width: '50%',
		alignItems: 'center'
	},
	gridForm: {
		paddingTop: theme.spacing(2),
		width: '100%',
		alignItems: 'center'
	}
}))

function SignUp(props) {
	const classes = useStyles();
	const [fullname, setFullName] = React.useState('')
	const [email, setEmail] = React.useState('')
	const [password, setPassword] = React.useState('')
	const [repeatPassword, setRepeatPassword] = React.useState('')

	const validatePassword = () => (password.length >= 6)

	const validateRepeatPassword = () => (repeatPassword === password)

	const handleSubmit = () => {
		api.post('/users', {fullname, email, password}).then((res) => {
			const {token} = res.data
			setToken(token)
			console.log(res.data)
			props.history.push('/')
		}).catch(error => {
			console.log(error)
		})
    }

	return (
		<div className='login'>
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
									label={constants.fullnameLabel}
									stateValue={[fullname, setFullName]}
									validators={['required']}
									errorMessages={['Esse campo é obrigatório']}
									/>
							</Grid>
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
									validateField={validatePassword}
									validators={['required']}
									errorMessages={['Esse campo é obrigatório', 'Mínimo de 6 caracteres']}
									/>
							</Grid>
							<Grid item xs className={classes.gridForm}>
								<Input 
									label={constants.repeatPasswordLabel}
									type="password"
									stateValue={[repeatPassword, setRepeatPassword]}
									validators={['required']}
									validateField={validateRepeatPassword}
									errorMessages={['Esse campo é obrigatório', 'As senhas não estão iguais']}
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
		</div>
	)
}

export default SignUp
