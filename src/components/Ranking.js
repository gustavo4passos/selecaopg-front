import React, { useState, useEffect } from 'react'

import { Paper, makeStyles, Typography, Button, CircularProgress, Grid, createMuiTheme } from '@material-ui/core'

import Enrollment from './Enrollment'
import api from '../services/api';
import logoUFBA from '../assets/imgs/logoufba.png'
import { ThemeProvider } from '@material-ui/styles';
import { red, yellow } from '@material-ui/core/colors';

const useStyles = makeStyles(theme => ({
	root: {
		width: '70%',
		maxWidth: '500px',
		padding: theme.spacing(4),
		alignItems: 'center',
		display: 'flex',
		textAlign: 'center'
	},
	logo: {
		width: '100%',
		height: '160px',
		'& > img': {
			height: '100%'
		},
		marginBottom: '.5em'
	},
	title: {
		fontSize: '1.2em',
		fontFamily: 'Raleway'
	},
	ranking: {
		fontWeight: 'bold',
		fontSize: '.8em',
		'& > span': {
			fontSize: '3rem',
			marginRight: '10px'
		}
	},
	score: {
		'& > span': {
			fontWeight: 'bold'
		}
	},

	button: {
		backgroundColor: 'red'
	}
}))

const dangerTheme = createMuiTheme({
	palette: {
		primary: {
			main: red[500]
		}
	}
})

const Ranking = ({ranking, enrollment, selection, setEdit, handleDelete, ...props}) => {
	const classes = useStyles()

	return (
		<Paper className={classes.root}>
			<Grid container spacing={3}>
				<Grid item xs={12}>
					<div className={classes.logo}>
						<img src={logoUFBA}/>
					</div>
				</Grid>
				<Grid item xs={12} className={classes.title}>
					{constants.yourRanking}
					<div className={classes.ranking}>
						<span>{ranking}º</span> de {selection.vacancies} vagas
					</div>
				</Grid>
				
				<Grid item xs={12} className={classes.score}>
					{constants.yourScore} <span>{enrollment.score}</span> pontos.
				</Grid>
				<Grid item xs={12}>
					{/* <Button color='primary' variant='contained' onClick={() => setEdit(true)}>Editar</Button>&nbsp; */}
					<ThemeProvider theme={dangerTheme}>
						<Button color='primary' variant='contained' onClick={() => handleDelete(enrollment.id)}>{constants.delete}</Button>
					</ThemeProvider>
				</Grid>
			</Grid>
		</Paper>
	)
}

export default Ranking
