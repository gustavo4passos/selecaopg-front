import React from 'react'

import { Paper, makeStyles, Typography, Grid } from '@material-ui/core'

import logoUFBA from '../assets/imgs/logoufba.png'
import { constants } from '../constants/constants';

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

function NoSelection() {
	const classes = useStyles()

	return (
      	<Paper className={classes.root}>
			<Grid container spacing={2}>
				<Grid item xs={12}>
					<div className={classes.logo}>
						<img src={logoUFBA}/>
					</div>
				</Grid>
				<Grid item xs={12}>
					<Typography className={classes.title}>{constants.noSelection}<br/> {constants.tryAgainLater}</Typography>
				</Grid>
			</Grid>
		</Paper>
	)
}

export default NoSelection
