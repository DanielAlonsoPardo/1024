import React from 'react';

export const Page = ({ children, hidden }) => {
  return hidden ? (<></>) : (
    <div className="page">
      {children}
    </div>
  )
}

export const Marker = ({ children, hidden, invis, onClick }) => {
  return hidden ? (<></>) : (
    <div className={`page-marker ${invis ? 'invis' : ''}`} onClick={onClick}>
      <div className="page-marker-transparent">
      </div>
      <div className="page-marker-name">
        {children}
      </div>
    </div>
  )
}

export const Separator = ({ children, tabName }) => {
  return (
    <div className="separator">
      <div className="separator-body">
        {children}
      </div>
      <SeparatorTab tabName={ tabName }/>
    </div>
  )
}

export const SeparatorTab = ({ tabName }) => {
  return (
    <div className="separator-tab">
      <div className="separator-tab-name">{ tabName }</div>
      <div className="separator-tab-detail"></div>
    </div>
  )
}