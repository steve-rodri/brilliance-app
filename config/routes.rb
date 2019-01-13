Rails.application.routes.draw do
  scope '/api' do
    resources :clients do
      get 'find', on: :collection, to: 'clients#find'
    end
    resources :events do
      put 'sync', to: 'events#bulk_update'
    end
    resources :contacts
    resources :companies
    resources :email_addresses
    resources :invoices
  end
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
