import React from 'react'

export default function ChooseCompany(props){
  const { search, companies, handleSelect, skip } = props
  return (
    <div className="CreateClient--choose">
      <div className="CreateClient--choose-existing">
        <h2>Choose From Existing:</h2>
        <div>
          <p>{`Found ${companies.count} ${companies.count === 1? 'company' : 'companies'} matching "${search}"`}</p>
          <div>
            {
              companies.data.map( company => (
                <div key={company.id} onClick={(e) => {
                  e.stopPropagation()
                  handleSelect(company.id, 'company')
                }}>
                  <p>{company.name}</p>
                </div>
              ))
            }
          </div>
        </div>
      </div>

      <div className="CreateClient--divider">
        <div></div>
        <h2>OR</h2>
        <div></div>
      </div>

      <div className="CreateClient--skip">
        <button onClick={skip}><h2>Skip</h2></button>
      </div>
    </div>
  )
}
