import React, { useState, useEffect } from 'react'

import { makeStyles } from '@material-ui/styles'
import { Paper, Grid, Typography, Button, FormLabel, RadioGroup, FormControlLabel, Radio, FormControl } from '@material-ui/core';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator'

import $ from 'jquery'

const useStyles = makeStyles(theme => ({
	root: {
		width: '100%',
		maxWidth: '700px',
		minHeight: '90vh',
		padding: theme.spacing(4)
	},
	title: {
		fontFamily: 'Varela Round !important',
		fontSize: '1.75em',
		textAlign: 'center',
		marginBottom: '.5em',
		'& > span': {
			fontSize: '1.5em',
			fontFamily: 'Varela Round !important',
			fontWeight: 'bold'
		}
	},
	subtitle: {
		textAlign: 'justify'
	}
}))


function Enrollment() {
	const classes = useStyles()

	const [inputs, setInputs] = useState({
		name: '',
		email: '',
		phone: '',
		advisorName: '',
		entrySemester: '',
		lattesLink: '',
		undergraduateUniversity: '',
		enadeLink: '',
		undergraduateTranscript: new File([], ''),
		graduateTranscript: new File([], ''),
		scientificProduction: new File([], ''),
		publications: new File([], '')
	})

	const handleSubmit = (e) => {
		const { 
			name, email, phone,
			advisorName, entrySemester,
			lattesLink, undergraduateUniversity,
			enadeLink, undergraduateTranscript,
			graduateTranscript, scientificProduction,
			publications
		} = inputs
	}

	const handleInput = (key, value) => {
		setInputs({...inputs, [key]: value})
	}

	const clickFile = (key) => $(key).click()

	return (
		<Paper className={classes.root}>
			<ValidatorForm
				onSubmit={handleSubmit}
			>
				<Grid container spacing={2}>
					<Grid item xs={12}>
						<Typography className={classes.title}>
							<span>PGCOMP<br/></span>
							Programa de Pós-graduação<br/>em Ciência da Computação
						</Typography>
						<Typography className={classes.subtitle}>O presente formulário se destina a comprovação dos dados referentes ao Edital 06/2019 do Programa de Pós-Graduação em Computação - PGCOMP da Universidade Federal da Bahia - UFBA.</Typography>
					</Grid>
					<Grid item xs={12}>
						<TextValidator
							label='Nome Completo *'
							name='name'
							value={inputs.name}
							onChange={(e) => handleInput('name', e.target.value)}
							validators={['required']}
							errorMessages={['Campo obrigatório']}
							fullWidth
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextValidator
							label='Email *'
							name='email'
							value={inputs.email}
							onChange={(e) => handleInput('email',e.target.value)}
							validators={['required', 'isEmail']}
							errorMessages={['Campo obrigatório', 'Email inválido']}
							fullWidth
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextValidator
							label='Celular *'
							name='phone'
							value={inputs.phone}
							onChange={(e) => handleInput('phone', e.target.value)}
							validators={['required']}
							errorMessages={['Campo obrigatório']}
							fullWidth
						/>
					</Grid>
					<Grid item xs={12}>
						<FormControl color='primary'>
							<FormLabel>Curso do Candidato(a) *</FormLabel>
							<RadioGroup name='degree'>
								<FormControlLabel value='masters' label='Mestrado' control={<Radio color='primary'/>}/>
								<FormControlLabel value='doctorate' label='Doutorado' control={<Radio color='primary'/>}/>
							</RadioGroup>
						</FormControl>
					</Grid>
					<Grid item xs={12} sm={8}>
						<TextValidator
							label='Nome do Orientador *'
							name='advisor-name'
							value={inputs.advisorName}
							onChange={(e) => handleInput('advisorName', e.target.value)}
							validators={['required']}
							errorMessages={['Campo obrigatório']}
							fullWidth
						/>
					</Grid>
					<Grid item xs={12} sm={4}>
						<TextValidator
							label='Semestre de Entrada *'
							name='entry-semester'
							value={inputs.entrySemester}
							onChange={(e) => handleInput('entrySemester', e.target.value)}
							validators={['required']}
							errorMessages={['Campo obrigatório']}
							fullWidth
						/>
					</Grid>
					<Grid item xs={12}>
						<TextValidator
							label='Universidade em que cursou a graduação *'
							name='undergraduate-university'
							value={inputs.undergraduateUniversity}
							onChange={(e) => handleInput('undergraduateUniversity', e.target.value)}
							validators={['required']}
							errorMessages={['Campo obrigatório']}
							fullWidth
						/>
					</Grid>
					
					<Grid item xs={12}>
						<TextValidator
							label='Link para CV Lattes *'
							name='lattes-link'
							value={inputs.lattesLink}
							onChange={(e) => handleInput('lattesLink', e.target.value)}
							validators={['required']}
							errorMessages={['Campo obrigatório']}
							fullWidth
						/>
					</Grid>
					<Grid item xs={12}>
						<TextValidator
							label='Link para ENADE'
							name='enade-link'
							value={inputs.enadeLink}
							onChange={(e) => handleInput('enadeLink', e.target.value)}
							fullWidth
						/>
					</Grid>
					<Grid item xs={12}>
						<FormLabel component='p'>Histórico acadêmico de curso(s) de Pós-Graduação Strictu Sensu</FormLabel>
						<input id='graduate-transcript' type='file' value='' onChange={e => handleInput('graduateTranscript', e.target.files[0])} hidden/>
						<Button fullWidth={false} variant='outlined' color='primary' size='small' onClick={() => clickFile('#graduate-transcript')}>
							Adicionar Arquivo
						</Button>
						{
							inputs.graduateTranscript.size !== 0 && 
							<Button style={{marginLeft: '5px'}} onClick={e => handleInput('graduateTranscript', new File([], '	'))}>Remover</Button>
						}
						<Typography variant='subtitle2'>{inputs.graduateTranscript.name}</Typography>
					</Grid>
					<Grid item xs={12}>
						<FormLabel component='p'>Histórico acadêmico de curso(s) de graduação (em PDF, apenas para mestrandos)</FormLabel>
						<input id='undergraduate-transcript' type='file' value='' onChange={e => handleInput('undergraduateTranscript', e.target.files[0])} hidden/>
						<Button fullWidth={false} variant='outlined' color='primary' size='small' onClick={() => clickFile('#undergraduate-transcript')}>
							Adicionar Arquivo
						</Button>
						{
							inputs.undergraduateTranscript.size !== 0 && 
							<Button style={{marginLeft: '5px'}} onClick={e => handleInput('undergraduateTranscript', new File([], '	'))}>Remover</Button>
						}
						<Typography variant='subtitle2'>{inputs.undergraduateTranscript.name}</Typography>
					</Grid>
					<Grid item xs={12}>
						<FormLabel component='p'>Publicações em PDF listadas no currículo lattes (arquivo ZIP)</FormLabel>
						<input id='publications' type='file' value='' onChange={e => handleInput('publications', e.target.files[0])} hidden/>
						<Button fullWidth={false} variant='outlined' color='primary' size='small' onClick={() => clickFile('#publications')}>
							Adicionar Arquivo
						</Button>
						{
							inputs.publications.size !== 0 && 
							<Button style={{marginLeft: '5px'}} onClick={e => handleInput('publications', new File([], '	'))}>Remover</Button>
						}
						<Typography variant='subtitle2'>{inputs.publications.name}</Typography>
					</Grid>
					<Grid item xs={12}>
						<Button color='primary' variant='contained' type='submit'>Inscrever-se</Button>
					</Grid>
				</Grid>
			</ValidatorForm>

		</Paper>
	)
}

export default Enrollment
