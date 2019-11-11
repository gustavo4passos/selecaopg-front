import React, { useState, useEffect } from 'react'

import { Paper, makeStyles, Typography, Button } from '@material-ui/core'

import Enrollment from './Enrollment'
import api from '../services/api';
import Loading from './Loading';
import NoSelection from './NoSelection';

const useStyles = makeStyles(theme => ({
	root: {
		
	}
}))

function Selection() {
	const classes = useStyles()
	const [selection, setSelection] = useState(null)
	const [isLoading, setLoading] = useState(false)

	useEffect(() => {
		let user = sessionStorage.getItem('user')

		if (!user) return

		setLoading(true)

		api.get('/selections/active').then(res => {
			setSelection(res.data)
		}).catch(err => {
			console.log('err', err)
			
		}).finally(() => {
			setLoading(false)
		})
	}, [])

	return (
		<>
		{
			isLoading ?
			<Loading/> : 
				selection ?
				<NoSelection/> :
				<Enrollment selection={selection}/>
		}
		</>
	)
}

export default Selection
