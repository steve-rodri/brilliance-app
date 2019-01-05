Rails.application.routes.draw do
  scope '/api' do
    resources :companies
    resources :contacts
    resources :invoices
    resources :clients
    resources :events
  end
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
