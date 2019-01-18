import React             from "react"
import ReactDOM          from "react-dom"
import { BrowserRouter } from "react-router-dom"
import { Provider }      from 'react-redux'

import App               from "./App"

import configureStore    from './state/store/configureStore'

const store = configureStore()


it("renders without crashing", () => {
  const div = document.createElement('div')
  ReactDOM.render(<Provider store = { store }><BrowserRouter><App /></BrowserRouter></Provider>, div)
  ReactDOM.unmountComponentAtNode(div)
})