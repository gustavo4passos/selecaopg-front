import React, { useState, useEffect } from 'react'

import { Paper, makeStyles, Typography, Button, CircularProgress, Grid } from '@material-ui/core'

import Enrollment from './Enrollment'
import api from '../services/api';
import logoUFBA from '../assets/imgs/logoufba.png'

const useStyles = makeStyles(theme => ({
	root: {
		width: '100%',
		maxWidth: '500px',
		padding: theme.spacing(4),
		alignItems: 'center',
		display: 'flex',
		textAlign: 'center'
	},
	logo: {
		width: '100%',
		height: '230px',
		'& > img': {
			height: '100%'
		}
	},
	title: {
		fontSize: '1.3em'
	}
}))

function Ranking() {
	const classes = useStyles()

	return (
		<div className='main-page'>
            <Paper className={classes.root}>
				ranking
			</Paper>
        </div>
	)
}

export default Ranking
