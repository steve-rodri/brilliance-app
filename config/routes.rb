Rails.application.routes.draw do
  scope '/api' do
    resources :companies
    resources :invoices
    resources :clients do
      get 'find', on: :collection, to: 'clients#find'
    end
    resources :contacts
    resources :events do
      put 'sync', to: 'events#bulk_update'
    end
  end
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
