import React, { Children } from 'react'

import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';

export const Form = (props) => {
    const formRef = React.useRef(null);
    
    return(
        <ValidatorForm
                ref={formRef}
                onSubmit={props.onSubmit}
                onError={errors => console.log(errors)}
                variant='outlined'
            >
            {props.children}
        </ValidatorForm>
    )
}

export const Input = (props) => {
	const [value, setValue] = props.stateValue;
    const validators = (props.validators) ? props.validators.concat(['validateField']) : ['validateField']
  
    ValidatorForm.addValidationRule('validateField', (value) => {
        return (props.validateField) ? props.validateField() : true
    });
  
	const handleChange = event => {
	  setValue(event.target.value);
    };
    
    return(
        <TextValidator
            fullWidth={true}
            type={props.type}
            label={props.label}
            variant='outlined'
            onChange={handleChange}
            name={props.label}
            value={value}
            validators={validators}
            errorMessages={props.errorMessages}
        />
    )
}