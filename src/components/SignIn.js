import React from 'react'

import { Paper, makeStyles, Typography } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
	root: {
		width: '100%',
		maxWidth: '700px',
		minHeight: '600px',
		padding: theme.spacing(4)
	}
}))

function SignIn() {
	const classes = useStyles()

	return (
		<div className='login'>
			<Paper className={classes.root}>
				
			</Paper>
		</div>
	)
}

export default SignIn
