import React from 'react'
import './index.css';
import { LeftSectionLayout } from './LeftSectionLayout'
import { RightSectionLayout } from './RightSectionLayout'

const Layout = ({contentDisplay}) => {
  return (
    <div className="container-fluid min-vh-100">
      <div className="row min-vh-100">
        <LeftSectionLayout contentDisplay={contentDisplay}/>
        <RightSectionLayout />
      </div>
    </div>
  )
}

export default Layout