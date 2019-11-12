import React, { useState, useEffect } from 'react'

import { makeStyles } from '@material-ui/styles'
import { Paper, Grid, Typography, 
	Button, FormLabel, RadioGroup, 
	FormControlLabel, Radio, FormControl, 
	MenuItem, IconButton, Fab, ListSubheader, Checkbox, Snackbar, CircularProgress, SnackbarContent 
} from '@material-ui/core';
import { Add, Remove, Close } from '@material-ui/icons'
import { ValidatorForm, TextValidator, SelectValidator } from 'react-material-ui-form-validator'

import $ from 'jquery'

import api from '../services/api'

import logoUFBA from '../assets/imgs/logoufba.png'
import { getUser } from '../services/auth';
import { SnackbarContentWrapper } from './SnackBar';
import { constants } from '../constants/constants';

const useStyles = makeStyles(theme => ({
	root: {
		width: '100%',
		maxWidth: '1000px',
		minHeight: '90vh',
		padding: theme.spacing(4)
	},
	header: {
		display: 'flex',
		justifyContent: 'space-between',
		[theme.breakpoints.down('sm')]: {
			flexWrap: 'wrap',
			textAlign: 'center'
		}
	},
	subheader: {
		maxWidth: '60%',
		flexGrow: 1,
		[theme.breakpoints.down('sm')]: {
			maxWidth: '100%',
		}
	},
	title: {
		fontFamily: 'Ubuntu !important',
		fontSize: '1.75em',
		marginBottom: '.5em',
		'& > span': {
			fontSize: '1.5em',
			fontFamily: 'Varela Round !important',
			fontWeight: 'bold'
		}
	},
	subtitle: {
		textAlign: 'justify',
		[theme.breakpoints.down('sm')]: {
			textAlign: 'center'
		}
	},
	logo: {
		height: '230px',
		[theme.breakpoints.down('sm')]: {
			marginTop: '.9em',
			width: '100%',
			textAlign: 'center'
		},
		'& > img': {
			height: '100%'
		}
	},
	fieldset: {
		marginTop: '0.5em',
		marginBottom: '1em',
		border: '1px solid #ddd',
		borderRadius: '1em',
		padding: '1em 1em 2em !important'
	},
	snackError: {
		backgroundColor: 'red',
		color: 'white'
	},
	snackMessage: {
		display: 'flex',
		alignItems: 'center',
		color: 'white'
	}
}))

const MAX_FILE_SIZE = 15000000;

const tables = {
	Conceito : {
		'A': 9.5 ,
		'B': 8.0 ,
		'C': 6.0 ,
		'D': 4.5 ,
		'E': 2.0
	},
	Area : {
		'computacao': 1.0,
		'matematica': 0.9,
		'otherExact': 0.7,
		'other': 0.5
	},
	ENADE : {
		'1': [ 7.7 , 0.73],
		'2': [ 7.42, 0.76],
		'3': [ 7.15, 0.78],
		'4': [ 6.88, 0.81],
		'5': [ 6.60, 0.84]
	},
	Categoria : {
		Qualis : {
			'A1': 10.0,
			'A2': 8.5,
			'B1': 7.0,
			'B2': 5.0,
			'B3': 2.0,
			'B4': 1.0,
			'B5': 0.5,
			'SBC': 0.5
		},
		Outros : {
			'patente': 2.5,
			'livro': 2.0,
			'capitulo': 1.0,
			'resumo': 0.5,
			'minicurso': 0.5,
			'relatorio': 0.5
		}
	},
	Capes : {
		'2' : 0.6,
		'3' : 0.8
	}
}

const arrayQualis = Object.keys(tables.Categoria.Qualis)
const arrayOutros = Object.keys(tables.Categoria.Outros)

function Enrollment(props) {
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

		degree: '', // MASTERS OR DOCTORATE
		mastersFreshman: false,
		
		noteType: 'cr',
		noteRG: '',
		area: '',
		enade: '',
		noteCRPG: '',
		capes: '',
		scientificProductions: [],

		undergraduateTranscript: new File([], ''),
		graduateTranscript: new File([], ''),
	})

	const [openSnackBar, setOpenSnackBar] = React.useState({error: false, message: ''});

	const [isRegistering, setRegistering] = useState(false)
  
  	const { 
		name, email, phone, degree,
		mastersFreshman, noteType, noteRG, 
		area, enade, noteCRPG, capes, 
		advisorName, entrySemester,
		lattesLink, undergraduateUniversity,
		enadeLink, scientificProductions, 
		undergraduateTranscript, graduateTranscript, 
	} = inputs

	// useEffect(() => {
	// 	setInputs({
	// 		...inputs,
	// 		name: 'a',
	// 		email: 'igoor1205@gmail.com',
	// 		phone: '71',
	// 		degree: 'doctorate',
	// 		noteType: 'cr',
	// 		noteRG: '9',

	// 	})
	// }, [])

	const validateFile = (file, types, size) => {
		if ( !(types.indexOf(file.name.split('.')[1]) != -1) ) {
			return false;
		}
		if ( file.size > size ){
			return false;
		}
		return true;
	}

	const handleSubmit = (e) => {
		setRegistering(true)

		const showError = (message) => {
			setOpenSnackBar({error: true, message})
			setRegistering(false)
		}

		let formData = new FormData()
		let publications = []
		let score = 0

		formData.append('entry_semester', entrySemester)
		formData.append('degree', degree)
		formData.append('advisor_name', advisorName)
		formData.append('lattes_link', lattesLink)
		formData.append('undergraduate_university', undergraduateUniversity)
		formData.append('enade_link', enadeLink)

		//RG + CRPG + PI

		let RG = 0;
		let CRPG = 0;
		let PI = 0;
		let ponderada = 1;
		let qualis = 0;
		let outros = 0;

		const { ENADE, Area, Capes, Categoria, Conceito } = tables

		if(degree == 'masters'){
			let ira = 0;
			let mediaEnade = ENADE[enade][0];
			let devEnade = ENADE[enade][1];
			let noteArea = Area[area];

			if ( noteType == 'cr')
				ira = Number(noteRG);
			else
				ira = Conceito[noteRG];

			if(mastersFreshman){
				ponderada = 0.3;
			}
			else if(capes < 4){
				ponderada = Capes[capes];
			}
			console.log(ira, mediaEnade, devEnade, noteArea)
			RG = Math.min(10.0, ((ira - mediaEnade)/devEnade)*1.67 + 5.00) * Number(noteArea);

			CRPG = noteCRPG * ponderada;
		}
		else if( degree == 'doctorate'){
			if(capes < 4){
				ponderada = Capes[capes];
			}

			CRPG = noteCRPG * ponderada;
		}

		let countOutros = [ 0, 0, 0, 0, 0, 0];
		
		for(let i in scientificProductions){
			let producao = scientificProductions[i]
			let publication = {}

			publication.category = producao.category

			if(producao.publicationMode == 'link'){
				publication.link = producao.publicationLink
				// formPublication.append('link', producao.publicationLink);
			}
			else{
				if(validateFile(producao.publicationFile, ['pdf'], MAX_FILE_SIZE)) {
					publication.file = 'publication'+i
					formData.append(publication.file, producao.publicationFile);
				} else {
					showError(constants.errorFileSize)
				}
					
			}
			
			let indexQualis = arrayQualis.indexOf(producao.category);
			if(indexQualis != -1){
				qualis += Categoria.Qualis[producao.category];
				publication.score = Categoria.Qualis[producao.category]
			}
			else{
				let indexOutros = arrayOutros.indexOf(producao.category);

				if(indexOutros != -1){
					if(countOutros[indexOutros] < 2){
						countOutros[indexOutros]++;
						outros = Math.min(5.0, outros + Categoria.Outros[producao.category]);
						
					}
					publication.score = Categoria.Outros[producao.category]
				}
			}

			publications.push(publication);
			formData.append('publications', JSON.stringify(publications))
		}
		console.log('qualis', qualis)
		console.log('outros', outros)

		PI = Math.min(qualis + outros, 10.0);

		console.log('RG', RG)
		console.log('CRPG', CRPG)
		console.log('PI', PI)

		score = RG + CRPG + PI;
		console.log('score', score)
		formData.append('score', score);

		if(!validateFile(undergraduateTranscript, ['pdf'], MAX_FILE_SIZE)) return
		formData.append('undergraduate_transcript', undergraduateTranscript);
		
		if(!validateFile(graduateTranscript, ['pdf'], MAX_FILE_SIZE)) return
		formData.append('graduate_transcript', graduateTranscript);

		let user = getUser()

		formData.append('user_id', user.id)
		formData.append('selection_id', 1) // props.selection.id
		const config = {
			headers: { 'content-type': 'multipart/form-data' }
		}
		
		api.post('/enrollments', formData, config)
		.then(response => { console.log(response); })
		.catch(error => { 
			showError(constants.errorServer)
			console.log(error); 
		})
  	}
   
  	const addScientificProduction = () => {
		setInputs({
			...inputs, 
			scientificProductions: [
				...inputs.scientificProductions,
				{
					category: '',
					publicationMode: 'link',
					publicationLink: '',
					publicationFile: new File([], ''),
					proceedingsLink: '',
					eventLink: '',
				}
			]
		})
	}

	const removeScientificProduction = (index) => {
		scientificProductions.splice(index, 1)
		setInputs({
			...inputs, 
			scientificProductions: [
				...scientificProductions
			]
		})
	}

	const handleInput = (key, value) => {
		setInputs({...inputs, [key]: value})
	}

	const handleScientifProductions = (num, key, value) => {
		scientificProductions[num][key] = value
		setInputs({...inputs, scientificProductions: [...scientificProductions]})
	}

	const clickFile = (key) => $(key).click()

	return (
		<Paper className={classes.root}>
			<ValidatorForm
				onSubmit={handleSubmit}
			>
				<Grid container spacing={2}>
					<Grid item xs={12} className={classes.header}>
						<div className={classes.subheader}>
							<Typography className={classes.title}>
								<span>PGCOMP<br/></span>
								Programa de Pós-graduação<br/>em Ciência da Computação
							</Typography>
							<Typography className={classes.subtitle}>O presente formulário se destina a comprovação dos dados referentes ao Edital 06/2019 do Programa de Pós-Graduação em Computação - PGCOMP da Universidade Federal da Bahia - UFBA.</Typography>
						</div>
						<div className={classes.logo}>
							<img src={logoUFBA}/>
						</div>
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
					<Grid item xs={12} sm={8}>
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
					<Grid item xs={12} sm={4}>
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
						<FormControl required color='primary'>
							<FormLabel component='p'>Curso do Candidato(a) *</FormLabel>
							<RadioGroup name='degree' value={degree} onChange={e => handleInput('degree', e.target.value)}>
								<FormControlLabel value='masters' label='Mestrado' control={<Radio color='primary'/>}/>
								<FormControlLabel value='doctorate' label='Doutorado' control={<Radio color='primary'/>}/>
							</RadioGroup>
						</FormControl>
					</Grid>
					{
						degree === 'masters' &&
						<>
							<Grid item xs={12}>
								<FormControl>
									<FormControlLabel label='Sou ingressante de mestrado.' control={
										<Checkbox checked={mastersFreshman} onChange={() => handleInput('mastersFreshman', !mastersFreshman)} color='primary'/>
									}/>
								</FormControl>
							</Grid>
							<Grid item xs={12}>
								<FormLabel component='p'>Coeficiente de Rendimento da Graduação</FormLabel>
							</Grid>
							<Grid item xs={12}>
								<FormControl color='primary'>
									<FormLabel>IRA (Índice de Rendimento Acadêmico)</FormLabel>
									<RadioGroup value={noteType} name='noteType' row onChange={e => handleInput('noteType', e.target.value)}>
										<FormControlLabel value='cr' label='CR (Coeficiente de Rendimento)' control={<Radio color='primary'/>}/>
										<FormControlLabel value='conceito' label='Notas por Conceito' control={<Radio color='primary'/>}/>
									</RadioGroup>
								</FormControl>
							</Grid>	
							{
								noteType === 'conceito' &&

								<Grid item xs={12} sm={3}>
									<SelectValidator
										label='Conceito *'
										value={noteRG}
										onChange={(e) => handleInput('noteRG', e.target.value)}
										validators={['required']}
										errorMessages={['Campo obrigatório']}
										fullWidth
									>	
										<MenuItem value='A'>A</MenuItem>
										<MenuItem value='B'>B</MenuItem>
										<MenuItem value='C'>C</MenuItem>
										<MenuItem value='D'>D</MenuItem>
										<MenuItem value='E'>E</MenuItem>
									</SelectValidator>	
								</Grid> 
							}
							{
								noteType === 'cr' &&
								<Grid item xs={12} sm={3}>
									<TextValidator
										label='Nota *'
										type='number'
										value={noteRG}
										onChange={(e) => handleInput('noteRG', e.target.value)}
										validators={['required']}
										errorMessages={['Campo obrigatório']}
										fullWidth
									/>
								</Grid>
							}
							<Grid item xs={12} sm={6} alignItems='flex-start' alignContent='flex-start'>
								<SelectValidator
									label='ENADE do seu Curso de Graduação *'
									value={enade}
									onChange={(e) => handleInput('enade', e.target.value)}
									validators={['required']}
									errorMessages={['Campo obrigatório']}
									fullWidth
								>	
									<MenuItem value='1'>1</MenuItem>
									<MenuItem value='2'>2</MenuItem>
									<MenuItem value='3'>3</MenuItem>
									<MenuItem value='4'>4</MenuItem>
									<MenuItem value='5'>5</MenuItem>
								</SelectValidator>	
							</Grid> 
							<Grid item xs={12} alignItems='flex-start' alignContent='flex-start'>
								<SelectValidator
									label='Área do seu Curso de Graduação *'
									value={area}
									onChange={(e) => handleInput('area', e.target.value)}
									validators={['required']}
									errorMessages={['Campo obrigatório']}
									fullWidth
								>	
									<MenuItem value='computacao'>
										Ciência da Computação, Sistemas de Informação, Licenciatura em Computação, Engenharia da Computação e Engenharia de Software
									</MenuItem>
									<MenuItem value='matematica'>Matemática Computacional, Matemática, Estatística, Física e Engenharia Elétrica (e correlatas)</MenuItem>
									<MenuItem value='otherExact'>Outras Ciências Exatas</MenuItem>
									<MenuItem value='other'>Outras Áreas</MenuItem>
								</SelectValidator>	
							</Grid> 
						</>
					}

					<Grid item xs={12}>
						<FormLabel component='p'>Coeficiente de Rendimento em Programas de Pós Graduação Stricto Sensu</FormLabel>
					</Grid>
					<Grid item xs={12} sm={3}>
						<TextValidator
							label='Nota *'
							type='number'
							value={noteCRPG}
							onChange={(e) => handleInput('noteCRPG', e.target.value)}
							validators={['required']}
							errorMessages={['Campo obrigatório']}
							fullWidth
						/>
					</Grid>
					{
						!mastersFreshman &&
						<Grid item xs={12} sm={3}>
							<SelectValidator
								label='Conceito CAPES *'
								value={capes}
								onChange={(e) => handleInput('capes', e.target.value)}
								validators={['required']}
								errorMessages={['Campo obrigatório']}
								fullWidth
							>	
								<MenuItem value='2'>2</MenuItem>
								<MenuItem value='3'>3</MenuItem>
								<MenuItem value='4'>4</MenuItem>
								<MenuItem value='5'>5</MenuItem>
								<MenuItem value='6'>6</MenuItem>
								<MenuItem value='7'>7</MenuItem>
							</SelectValidator>	
						</Grid>
					}
					<Grid item xs={12} style={{marginTop: '1em'}}>
						<Grid container spacing={1} alignItems='center'>
							<Grid item xs={true}>
								<FormLabel>Produções Intelectuais</FormLabel>
							</Grid>
							
							<Grid item xs='auto' style={{textAlign: 'right'}}>
								<Fab size='small' color='primary' onClick={() => addScientificProduction()}>
									<Add/>
								</Fab>
							</Grid>
						</Grid>
					</Grid>
					
					{
						scientificProductions.map((prod, i) => (
							<Grid key={i} className={classes.fieldset} item xs={12}>
								<Grid container spacing={2}>
									<Grid item xs={12}>
										<Grid container spacing={1} alignItems='center'>
											<Grid item xs={true}>
												<FormLabel>Publicação {i+1}</FormLabel>
											</Grid>
											
											<Grid item xs='auto' style={{textAlign: 'right'}}>
												<Fab size='small' color='primary' onClick={() => removeScientificProduction(i)}>
													<Remove/>
												</Fab>
											</Grid>
										</Grid>
									</Grid>
									<Grid item xs={12} sm={8}>
										<SelectValidator
											label='Categoria *'
											value={prod.category}
											onChange={(e) => handleScientifProductions(i, 'category', e.target.value)}
											validators={['required']}
											errorMessages={['Campo obrigatório']}
											fullWidth
										>	
											<ListSubheader>Artigos Completos</ListSubheader>
											<MenuItem value='A1'>A1</MenuItem>
											<MenuItem value='A2'>A2</MenuItem>
											<MenuItem value='B1'>B1</MenuItem>
											<MenuItem value='B2'>B2</MenuItem>
											<MenuItem value='B3'>B3</MenuItem>
											<MenuItem value='B4'>B4</MenuItem>
											<MenuItem value='B5'>B5</MenuItem>
											<MenuItem value='SBC'>Sem QUALIS mas com selo SBC</MenuItem>
											<ListSubheader>Outros Tipos</ListSubheader>
											<MenuItem value='patente'>Patente Depositada</MenuItem>
											<MenuItem value='livro'>Livro</MenuItem>
											<MenuItem value='capitulo'>Capítulo de Livro ou Organização de Livro</MenuItem>
											<MenuItem value='resumo'>Resumo Estendido</MenuItem>
											<MenuItem value='minicurso'>Minicurso ou Tutorial Ministrado em Conferência</MenuItem>
											<MenuItem value='relatorio'>Relatório Técnico do PGCOMP</MenuItem>
										</SelectValidator>	
									</Grid>
									<Grid item xs={4} alignContent='flex-end'>
										<FormControl color='primary'>
											<FormLabel>Publicação</FormLabel>
											<RadioGroup value={prod.publicationMode} name='noteType' row onChange={e => handleScientifProductions(i, 'publicationMode', e.target.value)}>
												<FormControlLabel value='link' label='Link' control={<Radio color='primary'/>}/>
												<FormControlLabel value='file' label='Arquivo' control={<Radio color='primary'/>}/>
											</RadioGroup>
										</FormControl>
									</Grid>	
									{
										prod.publicationMode === 'link' &&
										<Grid item xs={12}>
											<TextValidator
												label='Link para a Publicação *'
												value={prod.publicationLink}
												onChange={(e) => handleScientifProductions(i, 'publicationLink', e.target.value)}
												validators={['required']}
												errorMessages={['Campo obrigatório']}
												fullWidth
											/>
										</Grid>
									}
									{
										prod.publicationMode === 'file' &&
										<Grid item xs={12}>
											<FormLabel component='p'>Arquivo Publicação *</FormLabel>
											<input id='publication-file' type='file' value='' onChange={e => handleScientifProductions(i, 'publicationFile', e.target.files[0])} hidden/>
											<Button fullWidth={false} variant='outlined' color='primary' size='small' onClick={() => clickFile('#publication-file')}>
												Adicionar Arquivo
											</Button>
											{
												prod.publicationFile.size !== 0 && 
												<Button style={{marginLeft: '5px'}} onClick={e => handleScientifProductions(i, 'publicationFile', new File([], ''))}>
													Remover
												</Button>
											}
											<Typography variant='subtitle2'>{prod.publicationFile.name}</Typography>
										</Grid>
									}
									<Grid item xs={12}>
										<TextValidator
											label='Link para os Anais'
											value={prod.proceedingsLink}
											onChange={(e) => handleScientifProductions(i, 'proceedingsLink', e.target.value)}
											fullWidth
										/>
									</Grid>
									<Grid item xs={12}>
										<TextValidator
											label='Link do Evento'
											value={prod.eventLink}
											onChange={(e) => handleScientifProductions(i, 'eventLink', e.target.value)}
											fullWidth
										/>
									</Grid>
								</Grid>
								
							</Grid>
						))
					}
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
						<Button color='primary' variant='contained' type='submit'>
							{isRegistering ? <CircularProgress color='default' size={24}/> : "Inscrever-se"}
						</Button>
					</Grid>
				</Grid>
			</ValidatorForm>
			<Snackbar
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left',
				}}
				open={openSnackBar.error}
				autoHideDuration={6000}
				onClose={() => setOpenSnackBar({error: false, message: ''})}
			>
				<SnackbarContentWrapper
					onClose={() => setOpenSnackBar({error: false, message: ''})}
					variant="error"
					message={openSnackBar.message}
				/>
			</Snackbar>
		</Paper>
	)
}

export default Enrollment
