Rails.application.routes.draw do
  resources :invoices
  resources :clients
  resources :events
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
