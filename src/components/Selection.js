import React, { useState, useEffect } from 'react'

import Enrollment from './Enrollment'
import api from '../services/api';
import Loading from './Loading';
import NoSelection from './NoSelection';
import Ranking from './Ranking';

import { Fab } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import { logout } from '../services/auth';

const useStyles = makeStyles(theme => ({
	fab: {
		position: 'fixed',
		bottom: '3em',
		right: '3em'
	}
}))

function Selection(props) {
	const classes = useStyles()

	const [selection, setSelection] = useState(null)
	const [enrollment, setEnrollment] = useState(null)
	const [ranking, setRanking] = useState(0)
	const [isLoading, setLoading] = useState(true)
	const [edit, setEdit] = useState(false)

	const fetchRanking = async (enrollmentId) => {
		const response = await api.get(`/ranking/${enrollmentId}`)

		setRanking(response.data.ranking)
	}

	useEffect(() => {
		let user = sessionStorage.getItem('@selecaopg/user')

		if (!user) return
		user = JSON.parse(user)

		setLoading(true)

		const fetchUserEnrollments = async () => {
			const response = await api.get(`/users/${user.id}`)

			return response.data.enrollments
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
					await fetchRanking(enrollment.id)
					setEnrollment(enrollment)
				}
			} catch(err) {
				console.log('err', err.response)
			}

			setLoading(false)
		}

		fetchSelection()
	}, [])

	const handleEnrollment = async (enrollment) => {
		setLoading(true)

		try {
			await fetchRanking(enrollment.id)
		} catch(err) {
			console.log(err.response.data)
		}
		
		setEnrollment(enrollment)
		setLoading(false)
	}

	const handleDeleteEnrollment = async (id) => {
		setLoading(true)

		try {
			const response = await api.delete(`/enrollments/${id}`)
			
			setEnrollment(null)
		} catch(err) {
			console.log(err)
		}

		setLoading(false)
	}

	const handleLogout = async () => {
		setLoading(true)

		try {
			await api.post('/sessions/logout')
			logout()
			props.history.push('/entrar')
		} catch(err) {
			console.log(err)
		}

		setLoading(false)
	}

	return (
		<>
		{
			isLoading ?
			<Loading/> : 
				!selection ?
				<NoSelection/> :
					enrollment && !edit ?
					<Ranking 
						enrollment={enrollment}
						selection={selection}
						ranking={ranking}
						setEdit={(value) => setEdit(value)}
						handleDelete={handleDeleteEnrollment}
					/> :
					<Enrollment 
						selectionId={selection.id}
						enrollment={enrollment}
						handleEnrollment={handleEnrollment}	
						edit={edit}
					/>
		}
			<Fab color='primary' className={classes.fab} onClick={() => handleLogout()}>
				<ExitToAppIcon/>
			</Fab>
		</>
	)
}

export default Selection
