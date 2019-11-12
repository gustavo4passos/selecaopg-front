import React, { useState, useEffect } from 'react'

import { Paper, makeStyles, Typography, Button } from '@material-ui/core'

import Enrollment from './Enrollment'
import api from '../services/api';
import Loading from './Loading';
import NoSelection from './NoSelection';
import Axios from 'axios';
import { isBuffer } from 'util';
import Ranking from './Ranking';

const useStyles = makeStyles(theme => ({
	root: {
		
	}
}))

function Selection() {
	const classes = useStyles()
	const [selection, setSelection] = useState(null)
	const [enrollment, setEnrollment] = useState(null)
	const [isLoading, setLoading] = useState(true)
	const [edit, setEdit] = useState(false)

	useEffect(() => {
		
		
		let user = sessionStorage.getItem('@selecaopg/user')

		if (!user) return
		user = JSON.parse(user)

		setLoading(true)

		const fetchUserEnrollments = async () => {
			const response = await api.get(`/users/${user.id}/enrollments/`)

			return response.data
		}

		const fetchSelection = async () => {
			try {
				const res = await api.get('/selections/active')

				setSelection(res.data)

				const enrollments = await fetchUserEnrollments()

				let ok = false
				for (var enrollment of enrollments) {
					if (enrollment.selection_id === res.data.id) {
						ok = true
						break
					}
				}

				if (ok) {
					console.log('opa')
					setEnrollment(enrollment)
				}
			} catch(err) {
				console.log('err', err.response)
			}

			setLoading(false)
		}

		fetchSelection()
	}, [])

	const handleEnrollment = (enrollment) => {

	}

	console.log('LOADING', isLoading)
	console.log('selection', selection)
	console.log('enrollment', enrollment)
	return (
		<>
		{
			isLoading ?
			<Loading/> : 
				!selection ?
				<NoSelection/> :
					enrollment && !edit ?
					<Ranking enrollment={enrollment}/> :
					<Enrollment 
						selectionId={selection.id}
						enrollment={enrollment}
						handleEnrollment={(enrollment) => handleEnrollment(enrollment)}	
					/>
		}
		</>
	)
}

export default Selection
