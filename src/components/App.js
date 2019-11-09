import React from 'react'

import { ThemeProvider } from '@material-ui/styles'
import { createMuiTheme } from '@material-ui/core';

import Routes from '../routes'

const theme = createMuiTheme({
	palette: {
		primary: {
			main: '#2ed573',
			contrastText: '#fff'

		}
	}
})

function App() {
	return (
		<ThemeProvider theme={theme}>
			<Routes/>
		</ThemeProvider>
	)
}

export default App
