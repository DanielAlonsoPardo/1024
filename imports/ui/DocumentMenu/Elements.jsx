import React from 'react';

export const Page = ({children}) => {
  return (
    <div className="page">
      {children}
    </div>
  )
}

export const Marker = ({children}) => {
  return (
    <div className="page-marker">
      <div className="page-marker-transparent">
      </div>
      <div className="page-marker-name">
      {children}
      </div>
    </div>
  )
}

export const Separator = ({children}) => {
  return (
    <div className="separator">
      <div className="separator-body">
        {children}
      </div>
      <SeparatorTab />
    </div>
  )
}

export const SeparatorTab = (props) => {
  return (
    <div className="separator-tab">
      <div className="separator-tab-name">separator name</div>
      <div className="separator-tab-detail"></div>
    </div>
  )
}