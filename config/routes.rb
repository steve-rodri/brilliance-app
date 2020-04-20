Rails.application.routes.draw do
  scope '/api' do
    resources :addresses
    resources :clients do
      get 'events', on: :collection, to: 'clients#events'
    end
    resources :events
    resources :contacts
    resources :companies
    resources :email_addresses
    resources :places
    resources :employees
    resources :event_employees
    resources :run_sheets
    resources :invoices
    resources :lines
    resources :items
    resources :item_contents
    resources :contents
    resources :inventories
    resources :expenses
    put 'google/events', to: 'google_events#update'
  end
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
