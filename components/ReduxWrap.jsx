"use client"
import { store } from '@/service/store'
import React from 'react'
import { Provider } from 'react-redux';

function ReduxWrap({children}) {
  return (
    <>
          <Provider store={store}>
            {children}
          </Provider>
    </>
  )
}

export default ReduxWrap