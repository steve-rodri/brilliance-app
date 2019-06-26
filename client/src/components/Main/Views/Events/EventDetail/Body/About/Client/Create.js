import React from 'react'
import Contact from './Contact'
import Company from './Company'
import ChooseContact from './ChooseContact'
import ChooseCompany from './ChooseCompany'
export default function Create(props){
  const { type, view, searchResults: { contacts, companies } } = props
  switch (type) {

    case 'contact':
      switch (view) {

        case 'chooseExisting':
        return <ChooseContact {...props} contacts={contacts}/>

        case 'form':
        return <Contact {...props} />

        case 'createCompany':
        return <Company {...props}/>

        default:
        break;
      }
    break;

    case 'company':
      switch (view) {

        case 'chooseExisting':
        return <ChooseCompany companies={companies}/>

        case 'form':
        return <Company {...props}/>

        case 'createContact':
        return <Contact {...props}/>

        default:
        break;
      }
    break;

    default:
    return (
      <div className="CreateClient--opening">
        <h2>Is this a Person or a Company?</h2>
        <div>
          <button onClick={() => this.setPerson()}><p>Person</p></button>
          <button onClick={() => this.setCompany()}><p>Company</p></button>
        </div>
      </div>
    )
  }
}
