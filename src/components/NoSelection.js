import React from 'react'

import { Paper, makeStyles, Typography, Grid } from '@material-ui/core'

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

function NoSelection() {
	const classes = useStyles()

	return (
		<div className='main-page'>
            <Paper className={classes.root}>
				<Grid container spacing={2}>
					<Grid item xs={12}>
						<div className={classes.logo}>
							<img src={logoUFBA}/>
						</div>
					</Grid>
					<Grid item xs={12}>
						<Typography className={classes.title}>Não há seleção disponível no momento. <br/>Volte mais tarde.</Typography>
					</Grid>
				</Grid>
			</Paper>
        </div>
	)
}

export default NoSelection
