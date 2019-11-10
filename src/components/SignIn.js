import React from 'react'

import { Paper, makeStyles, Typography, Button } from '@material-ui/core'

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
		<Paper className={classes.root}>
			<Button color='primary' variant='contained'>Logar</Button>
		</Paper>
	)
}

export default SignIn
