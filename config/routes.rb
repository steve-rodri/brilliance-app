Rails.application.routes.draw do
  scope '/api' do
    resources :companies
    resources :invoices
    resources :clients
    resources :contacts
    resources :events
    put '/events', to: 'events#bulk_update'
  end
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
