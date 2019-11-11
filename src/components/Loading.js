import React, { useState, useEffect } from 'react'

import { Paper, makeStyles, Typography, Button, CircularProgress } from '@material-ui/core'

import Enrollment from './Enrollment'
import api from '../services/api';

const useStyles = makeStyles(theme => ({
	root: {
		
	}
}))

function Loading() {
	const classes = useStyles()

	return (
		<div className='main-page'>
            <CircularProgress/>
        </div>
	)
}

export default Loading
