import React from 'react';
import { clientName } from '../Helpers/clientName'
import './Modal.css';

export default function Show(props){
  const { modalData } = props
  const client = clientName(modalData)
  return (
    <div>
      <h2 className="Modal--Title">{client}</h2>
      <div className="Modal--Fields">
        
      </div>
    </div>
  )
}
