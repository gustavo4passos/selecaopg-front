import React from 'react'

import { Paper, makeStyles, Typography, Button } from '@material-ui/core'

import Enrollment from './Enrollment'

const useStyles = makeStyles(theme => ({
	root: {
		
	}
}))

function Selection() {
	const classes = useStyles()

	return (
		<Enrollment/>
	)
}

export default Selection
