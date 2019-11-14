import React, { useState, useEffect } from 'react'

import { makeStyles } from '@material-ui/styles'
import { Paper, Grid, Typography, 
	Button, FormLabel, RadioGroup, 
	FormControlLabel, Radio, FormControl, 
	MenuItem, IconButton, Fab, ListSubheader, Checkbox, Snackbar, CircularProgress, SnackbarContent, TextField, FormHelperText 
} from '@material-ui/core';
import { Add, Remove, Close } from '@material-ui/icons'
import { ValidatorForm, TextValidator, SelectValidator } from 'react-material-ui-form-validator'

import $ from 'jquery'
import Inputmask from "inputmask";
import validator from 'validator'

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
		padding: theme.spacing(4),
		'& .MuiFormLabel-root': {
			marginTop: 0
		}
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

const Enrollment = ({selectionId, enrollment, handleEnrollment, edit, ...props}) => {
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

		undergraduateTranscript: {value: new File([], ''), error: null},
		graduateTranscript: {value: new File([], ''), error: null},
	})

	const [snackBar, setSnackBar] = useState({open: false, message: '', type: ''})

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

	useEffect(() => {
		if (edit === true) {
			let user = sessionStorage.getItem('@selecaopg/user')
			if (!user) return

			user = JSON.parse(user)

			setInputs({
				...inputs,
				name: user.fullname,
				email: user.email,
				phone: enrollment.phone,
				advisorName: enrollment.advisor_name,
				entrySemester: enrollment.entry_semester,
				lattesLink: enrollment.lattes_link,
				undergraduateUniversity: enrollment.undergraduate_university,
				enadeLink: enrollment.enade_link,

				degree: enrollment.degree,
				mastersFreshman: enrollment.mastersFreshman,
				
				noteType: enrollment.noteType,
				noteRG: enrollment.noteRG,
				area: enrollment.area,
				enade: enrollment.enade,
				noteCRPG: enrollment.noteCRPG,
				capes: enrollment.capes,
				scientificProductions: enrollment.publications.map(publication => ({
					category: publication.category,
					publicationMode: publication.hasFile?'file':'link',
					publicationLink: publication.pdfLink,
					publicationFile: {value: new File([], ''), error: null},
					proceedingsLink: publication.proceedingsLink,
					eventLink: publication.eventLink,
				})),

				undergraduateTranscript: {value: new File([], ''), error: null},
				graduateTranscript: {value: new File([], ''), error: null},
	
			})
		}
		

		ValidatorForm.addValidationRule('isURL', (value) => {
			return value.length == 0 || validator.isURL(value)
		})
		ValidatorForm.addValidationRule('isAlpha', (value) => {
			return validator.isAlpha(value.replace(/ /g, ''), 'pt-BR')
		})

		ValidatorForm.addValidationRule('isNote', (value) => {
			return value >= 0 && value <= 10
		})
		Inputmask('(99) 99999-9999').mask('#phone-input')
		Inputmask('9999.9').mask('#semester-input')
		// Inputmask('[9[,99]]|[1[0][,00]]').mask('#note-crpg-input')
		
	}, [])

	const validateFile = (file, types, size) => {
		let sp = file.name.split('.')

		if ( !(types.indexOf(sp[sp.length-1]) != -1) ) {
			return 'type';
		}
		if ( file.size > size ){
			return 'size';
		}
		return true;
	}

	const handleSubmit = (e) => {
		for (let i in scientificProductions) {
			let prod = scientificProductions[i]

			if (prod.publicationMode === 'file' && prod.publicationFile.value.name === '') {
				scientificProductions[i].publicationFile = {...prod.publicationFile, error: constants.REQUIRED_FIELD} 
				setInputs({...inputs, scientificProductions: [...scientificProductions]})
				return
			}
		}

		setRegistering(true)

		const showError = (message) => {
			setSnackBar({open: true, type: 'error', message})
			setRegistering(false)
		}

		let formData = new FormData()
		let publications = []
		let score = 0

		formData.append('phone', phone)
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

			formData.append('enade', enade)
			formData.append('area', area)

			formData.append('score_type', noteType)
			if ( noteType == 'cr')
				ira = Number(noteRG);
			else
				ira = Conceito[noteRG];

			formData.append('rg', noteRG)
			if(mastersFreshman){
				ponderada = 0.3;
			}
			else if(capes < 4){
				ponderada = Capes[capes]
				formData.append('capes', capes)
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

		formData.append('crpg', noteCRPG)

		let countOutros = [ 0, 0, 0, 0, 0, 0];
		
		for(let i in scientificProductions){
			let producao = scientificProductions[i]
			let publication = {}

			publication.category = producao.category
			publication.proceedingsLink = producao.proceedingsLink
			publication.eventLink = producao.eventLink
			if(producao.publicationMode == 'link'){
				publication.link = producao.publicationLink
				// formPublication.append('link', producao.publicationLink);
				publication.hasFile = false
			}
			else{
				if(validateFile(producao.publicationFile.value, ['pdf'], MAX_FILE_SIZE)) {
					publication.file = 'publication'+i
					formData.append(publication.file, producao.publicationFile.value);
				} else {
					showError(constants.errorFileSize)
				}
				
				publication.hasFile = true
			}
			
			let indexQualis = arrayQualis.indexOf(producao.category);
			if(indexQualis != -1){
				qualis += Categoria.Qualis[producao.category];
				publication.score = Categoria.Qualis[producao.category]
			} else{
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
		}
		// console.log('publications', publications)
		formData.append('publications', JSON.stringify(publications))
		// console.log('qualis', qualis)
		// console.log('outros', outros)

		PI = Math.min(qualis + outros, 10.0);

		// console.log('RG', RG)
		// console.log('CRPG', CRPG)
		// console.log('PI', PI)

		score = RG + CRPG + PI;
		// console.log('score', score)
		formData.append('score', score);

		if(undergraduateTranscript.value.name !== '') {	
			formData.append('undergraduate_transcript', undergraduateTranscript.value);
		}
		
		if(graduateTranscript.value.name !== '') {
			formData.append('graduate_transcript', graduateTranscript.value);
		}

		let user = getUser()

		formData.append('user_id', user.id)
		formData.append('selection_id', selectionId) // props.selection.id

		api({
			method: edit ? 'PUT' : 'POST',
			url: '/enrollments',
			data: formData,
			headers: { 'content-type': 'multipart/form-data' }
		}).then(response => { 
			console.log(response)
			setRegistering(false)
			handleEnrollment(response.data)
		})
		.catch(error => { 
			console.log(error)
     		showError(constants.errorServer)
			setRegistering(false)
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
					publicationFile: {value: new File([], ''), error: null},
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
		console.log('key', value)

		if (key === 'noteCRPG' || key === 'noteRG') {
			if (Number(value) != value) return
		} 

		if (key === 'undergraduateTranscript' || key === 'graduateTranscript') {
			const validate = validateFile(value, ['pdf'], MAX_FILE_SIZE)

			if (validate === 'type') {
				setInputs({...inputs, [key]: {value: new File([], ''), error: constants.FILE_ONLY_PDF}})
			} else if (validate === 'size') {
				setInputs({...inputs, [key]: {value: new File([], ''), error: constants.FILE_SIZE}})
			} else setInputs({...inputs, [key]: {value, error: null}})
		} else setInputs({...inputs, [key]: value})
	}

	const handleScientifProductions = (num, key, value) => {
		console.log(num, key, value)
		if (key === 'publicationFile') {
			const validate = validateFile(value, ['pdf'], MAX_FILE_SIZE)

			if (validate === 'type') {
				scientificProductions[num][key] = {value: new File([], ''), error: constants.FILE_ONLY_PDF}
			} else if (validate === 'size') {
				scientificProductions[num][key] = {value: new File([], ''), error: constants.FILE_SIZE}
			} else {
				scientificProductions[num][key] = {value, error: null}
			}
			setInputs({...inputs, scientificProductions: [...scientificProductions]})
		} else {
			scientificProductions[num][key] = value
			setInputs({...inputs, scientificProductions: [...scientificProductions]})
		}

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
								<span>{constants.pgcompTitle}<br/></span>
								{constants.progLabel}<br/>{constants.ccLabel}
							</Typography>
							<Typography className={classes.subtitle}>{constants.formDesc}</Typography>
						</div>
						<div className={classes.logo}>
							<img src={logoUFBA}/>
						</div>
					</Grid>
					<Grid item xs={12}>
						<TextValidator
							id='name-input'
							variant='outlined'
							label={constants.fullnameReq}
							name='name'
							value={inputs.name}
							onChange={(e) => handleInput('name', e.target.value)}
							validators={['required', 'isAlpha']}
							errorMessages={[constants.REQUIRED_FIELD, constants.CHAR_INVALID]}
							fullWidth
						/>
					</Grid>
					<Grid item xs={12} sm={8}>
						<TextValidator
							id='email-input'
							variant='outlined'
							label={constants.emailReq}
							name='email'
							value={inputs.email}
							onChange={(e) => handleInput('email',e.target.value)}
							validators={['required', 'isEmail']}
							errorMessages={[constants.REQUIRED_FIELD, constants.EMAIL_INCORRECT]}
							fullWidth
						/>
					</Grid>
					<Grid item xs={12} sm={4}>
						<TextValidator
							id='phone-input'
							type='text'
							variant='outlined'
							label={constants.phoneReq}
							name='phone'
							value={inputs.phone}
							onChange={(e) => handleInput('phone', e.target.value)}
							validators={['required']}
							errorMessages={[constants.REQUIRED_FIELD]}
							fullWidth
						/>
					</Grid>
					
					<Grid item xs={12} sm={8}>
						<TextValidator
							variant='outlined'
							label={constants.orienReq}
							name='advisor-name'
							value={inputs.advisorName}
							onChange={(e) => handleInput('advisorName', e.target.value)}
							validators={['required']}
							errorMessages={[constants.REQUIRED_FIELD]}
							fullWidth
						/>
					</Grid>
					<Grid item xs={12} sm={4}>
						<TextValidator
							id='semester-input'
							variant='outlined'
							label={constants.semesterEntryReq}
							name='entry-semester'
							value={inputs.entrySemester}
							onChange={(e) => handleInput('entrySemester', e.target.value)}
							validators={['required']}
							errorMessages={[constants.REQUIRED_FIELD]}
							fullWidth
						/>
					</Grid>
					<Grid item xs={12}>
						<TextValidator
							variant='outlined'
							label={constants.underUnivReq}
							name='undergraduate-university'
							value={inputs.undergraduateUniversity}
							onChange={(e) => handleInput('undergraduateUniversity', e.target.value)}
							validators={['required']}
							errorMessages={[constants.REQUIRED_FIELD]}
							fullWidth
						/>
					</Grid>
					
					<Grid item xs={12}>
						<TextValidator
							variant='outlined'
							label={constants.lattesLinkReq}
							name='lattes-link'
							value={inputs.lattesLink}
							onChange={(e) => handleInput('lattesLink', e.target.value)}
							validators={['required', 'isURL']}
							errorMessages={[constants.REQUIRED_FIELD, constants.URL_INVALID]}
							fullWidth
						/>
					</Grid>
					<Grid item xs={12}>
						<TextValidator
							variant='outlined'
							label={constants.linkEnade}
							name='enade-link'
							value={inputs.enadeLink}
							onChange={(e) => handleInput('enadeLink', e.target.value)}
							validators={['isURL']}
							errorMessages={[constants.URL_INVALID]}
							fullWidth
						/>
					</Grid>
					<Grid item xs={12}>
						<FormControl color='primary'>
							<FormLabel component='p'>{constants.courseReq}</FormLabel>
							<RadioGroup name='degree' value={degree} onChange={e => handleInput('degree', e.target.value)}>
								<FormControlLabel value='masters' label={constants.mestradoLabel} control={<Radio color='primary'/>}/>
								<FormControlLabel value='doctorate' label={constants.doctorLabel} control={<Radio color='primary'/>}/>
							</RadioGroup>
						</FormControl>
					</Grid>
					{
						degree === 'masters' &&
						<>
							<Grid item xs={12}>
								<FormControl>
									<FormControlLabel label={constants.mastersFreshman} control={
										<Checkbox checked={mastersFreshman} onChange={() => handleInput('mastersFreshman', !mastersFreshman)} color='primary'/>
									}/>
								</FormControl>
							</Grid>
							<Grid item xs={12}>
								<FormLabel component='p'>{constants.scoreUndergrad}</FormLabel>
							</Grid>
							<Grid item xs={12}>
								<FormControl color='primary'>
									<FormLabel>{constants.iraLabel}</FormLabel>
									<RadioGroup value={noteType} name='noteType' row onChange={e => handleInput('noteType', e.target.value)}>
										<FormControlLabel value='cr' label={constants.crLabel} control={<Radio color='primary'/>}/>
										<FormControlLabel value='conceito' label={constants.gradeLabel} control={<Radio color='primary'/>}/>
									</RadioGroup>
								</FormControl>
							</Grid>	
							{
								noteType === 'conceito' &&

								<Grid item xs={12} sm={3}>
									<SelectValidator
										variant='outlined'
										label={constants.conceitoReq}
										value={noteRG}
										onChange={(e) => handleInput('noteRG', e.target.value)}
										validators={['required']}
										errorMessages={[constants.REQUIRED_FIELD]}
										fullWidth
									>	
										<MenuItem value='A'>{constants.valueA}</MenuItem>
										<MenuItem value='B'>{constants.valueB}</MenuItem>
										<MenuItem value='C'>{constants.valueC}</MenuItem>
										<MenuItem value='D'>{constants.valueD}</MenuItem>
										<MenuItem value='E'>{constants.valueE}</MenuItem>
									</SelectValidator>	
								</Grid> 
							}
							{
								noteType === 'cr' &&
								<Grid item xs={12} sm={3}>
									<TextValidator
										id='note-rg-input'
										variant='outlined'
										label={constants.noteReq}
										value={noteRG}
										onChange={(e) => handleInput('noteRG', e.target.value)}
										validators={['required']}
										errorMessages={[constants.REQUIRED_FIELD]}
										fullWidth
									/>
								</Grid>
							}
							<Grid item xs={12} sm={6} alignItems='flex-start' alignContent='flex-start'>
								<SelectValidator
									variant='outlined'
									label={constants.enadeReq}
									value={enade}
									onChange={(e) => handleInput('enade', e.target.value)}
									validators={['required']}
									errorMessages={[constants.REQUIRED_FIELD]}
									fullWidth
								>	
									<MenuItem value='1'>{constants.value1}</MenuItem>
									<MenuItem value='2'>{constants.value2}</MenuItem>
									<MenuItem value='3'>{constants.value3}</MenuItem>
									<MenuItem value='4'>{constants.value4}</MenuItem>
									<MenuItem value='5'>{constants.value5}</MenuItem>
								</SelectValidator>	
							</Grid> 
							<Grid item xs={12} alignItems='flex-start' alignContent='flex-start'>
								<SelectValidator
									variant='outlined'
									label={constants.areaReq}
									value={area}
									onChange={(e) => handleInput('area', e.target.value)}
									validators={['required']}
									errorMessages={[constants.REQUIRED_FIELD]}
									fullWidth
								>	
									<MenuItem value='computacao'>
										{constants.compLabel}
									</MenuItem>
									<MenuItem value='matematica'>{constants.matLabel}</MenuItem>
									<MenuItem value='otherExact'>{constants.otherExactLabel}</MenuItem>
									<MenuItem value='other'>{constants.otherLabel}</MenuItem>
								</SelectValidator>	
							</Grid> 
						</>
					}

					<Grid item xs={12}>
						<FormLabel component='p'>{constants.crPos}</FormLabel>
					</Grid>
					<Grid item xs={12} sm={3}>
						<TextValidator
							id='note-crpg-input'
							variant='outlined'
							label={constants.noteCRPG}
							value={noteCRPG}
							onChange={(e) => handleInput('noteCRPG', e.target.value)}
							validators={['required', 'isNote']}
							errorMessages={[constants.REQUIRED_FIELD, constants.NOTE_RANGE]}
							fullWidth
						/>
					</Grid>
					{
						!mastersFreshman &&
						<Grid item xs={12} sm={3}>
							<SelectValidator
								variant='outlined'
								label={constants.capesReq}
								value={capes}
								onChange={(e) => handleInput('capes', e.target.value)}
								validators={['required']}
								errorMessages={[constants.REQUIRED_FIELD]}
								fullWidth
							>	
								<MenuItem value='2'>{constants.value2}</MenuItem>
								<MenuItem value='3'>{constants.value3}</MenuItem>
								<MenuItem value='4'>{constants.value4}</MenuItem>
								<MenuItem value='5'>{constants.value5}</MenuItem>
								<MenuItem value='6'>{constants.value6}</MenuItem>
								<MenuItem value='7'>{constants.value7}</MenuItem>
							</SelectValidator>	
						</Grid>
					}
					<Grid item xs={12}>
						<Grid container spacing={1} alignItems='center'>
							<Grid item xs={true}>
								<FormLabel>{constants.intelectProd}</FormLabel>
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
												<FormLabel>{constants.publiLabel} {i+1}</FormLabel>
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
											variant='outlined'
											label={constants.categLabel}
											value={prod.category}
											onChange={(e) => handleScientifProductions(i, 'category', e.target.value)}
											validators={['required']}
											errorMessages={[constants.REQUIRED_FIELD]}
											fullWidth
										>	
											<ListSubheader>{constants.fullArt}</ListSubheader>
											<MenuItem value='A1'>{constants.valueA1}</MenuItem>
											<MenuItem value='A2'>{constants.valueA2}</MenuItem>
											<MenuItem value='B1'>{constants.valueB1}</MenuItem>
											<MenuItem value='B2'>{constants.valueB2}</MenuItem>
											<MenuItem value='B3'>{constants.valueB3}</MenuItem>
											<MenuItem value='B4'>{constants.valueB4}</MenuItem>
											<MenuItem value='B5'>{constants.valueB5}</MenuItem>
											<MenuItem value='SBC'>{constants.sbc}</MenuItem>
											<ListSubheader>{constants.otherTypes}</ListSubheader>
											<MenuItem value='patente'>{constants.patent}</MenuItem>
											<MenuItem value='livro'>{constants.book}</MenuItem>
											<MenuItem value='capitulo'>{constants.chapter}</MenuItem>
											<MenuItem value='resumo'>{constants.summary}</MenuItem>
											<MenuItem value='minicurso'>{constants.minicurso}</MenuItem>
											<MenuItem value='relatorio'>{constants.relatorio}</MenuItem>
										</SelectValidator>	
									</Grid>
									<Grid item xs={4} alignContent='flex-end'>
										<FormControl color='primary'>
											<FormLabel>{constants.publiLabel}</FormLabel>
											<RadioGroup value={prod.publicationMode} name='noteType' row onChange={e => handleScientifProductions(i, 'publicationMode', e.target.value)}>
												<FormControlLabel value='link' label={constants.linkLabel} control={<Radio color='primary'/>}/>
												<FormControlLabel value='file' label={constants.fileLabel} control={<Radio color='primary'/>}/>
											</RadioGroup>
										</FormControl>
									</Grid>	
									{
										prod.publicationMode === 'link' &&
										<Grid item xs={12}>
											<TextValidator
												variant='outlined'
												label={constants.publiLinkReq}
												value={prod.publicationLink}
												onChange={(e) => handleScientifProductions(i, 'publicationLink', e.target.value)}
												validators={['required', 'isURL']}
												errorMessages={[constants.REQUIRED_FIELD, constants.URL_INVALID]}
												fullWidth
											/>
										</Grid>
									}
									{
										prod.publicationMode === 'file' &&
										<Grid item xs={12}>
											<FormLabel component='p'>{constants.publiFile}</FormLabel>
											<input id={'publication-file'+i} type='file' value='' onChange={e => handleScientifProductions(i, 'publicationFile', e.target.files[0])} hidden/>
											<Button fullWidth={false} variant='outlined' color='primary' size='small' onClick={() => clickFile('#publication-file'+i)}>
												{constants.addFile}
											</Button>
											{
												prod.publicationFile.value.size !== 0 && 
												<Button style={{marginLeft: '5px'}} onClick={e => handleScientifProductions(i, 'publicationFile', new File([], ''))}>
													{constants.remove}
												</Button>
											}
											<Typography variant='subtitle2'>{prod.publicationFile.value.name}</Typography>
											{
												prod.publicationFile.error && 
												<FormHelperText error>{prod.publicationFile.error}</FormHelperText>
											}
										</Grid>
									}
									<Grid item xs={12}>
										<TextValidator
											variant='outlined'
											label={constants.proceedingsLink}
											value={prod.proceedingsLink}
											onChange={(e) => handleScientifProductions(i, 'proceedingsLink', e.target.value)}
											fullWidth
										/>
									</Grid>
									<Grid item xs={12}>
										<TextValidator
											variant='outlined'
											label={constants.eventLink}
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
						<FormLabel component='p'>{constants.graduateTranscript}</FormLabel>
						<input id='graduate-transcript' type='file' value='' onChange={e => handleInput('graduateTranscript', e.target.files[0])} hidden/>
						<Button fullWidth={false} variant='outlined' color='primary' size='small' onClick={() => clickFile('#graduate-transcript')}>
							{constants.addFile}
						</Button>
						{
							graduateTranscript.value.size !== 0 && 
							<Button style={{marginLeft: '5px'}} onClick={e => handleInput('graduateTranscript', new File([], '	'))}>{constants.remove}</Button>
						}
						<Typography variant='subtitle2'>{graduateTranscript.value.name}</Typography>
						{
							graduateTranscript.error && 
							<FormHelperText error>{graduateTranscript.error}</FormHelperText>
						}
					</Grid>
					<Grid item xs={12}>
						<FormLabel component='p'>{constants.undergradTranscript}</FormLabel>
						<input id='undergraduate-transcript' type='file' value='' onChange={e => handleInput('undergraduateTranscript', e.target.files[0])} hidden/>
						<Button fullWidth={false} variant='outlined' color='primary' size='small' onClick={() => clickFile('#undergraduate-transcript')}>
							{constants.addFile}
						</Button>
						{
							undergraduateTranscript.value.size !== 0 && 
							<Button style={{marginLeft: '5px'}} onClick={e => handleInput('undergraduateTranscript', new File([], '	'))}>{constants.remove}</Button>
						}
						<Typography variant='subtitle2'>{undergraduateTranscript.value.name}</Typography>
						{
							undergraduateTranscript.error && 
							<FormHelperText error>{undergraduateTranscript.error}</FormHelperText>
						}
					</Grid>
					
					<Grid item xs={12}>
						<Button disabled={degree === ''} color='primary' variant='contained' type='submit'>
							{isRegistering ? <CircularProgress color='default' size={24}/> : edit ? constants.update : constants.subscribe}
						</Button>
					</Grid>
				</Grid>
			</ValidatorForm>
			<Snackbar
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left',
				}}
				open={snackBar.open}
				autoHideDuration={6000}
				onClose={() => setSnackBar({...snackBar, open: false})}
			>
				<SnackbarContentWrapper
					onClose={() => setSnackBar({...snackBar, open: false})}
					variant="error"
					message={constants.errorServer}
				/>
			</Snackbar>
		</Paper>
	)
}

export default Enrollment
