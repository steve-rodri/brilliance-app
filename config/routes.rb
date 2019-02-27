Rails.application.routes.draw do
  resources :event_employees
  scope '/api' do
    resources :addresses
    resources :clients do
      get 'find', on: :collection, to: 'clients#find'
      get 'events', on: :collection, to: 'clients#events'
    end
    resources :events do
      get 'find', on: :collection, to: 'events#find'
      put 'sync', on: :collection, to: 'events#sync'
    end
    resources :contacts do
      get 'find', on: :collection, to: 'contacts#find'
    end
    resources :companies do
      get 'find', on: :collection, to: 'companies#find'
    end
    resources :email_addresses do
      get 'find', on: :collection, to: 'email_addresses#find'
    end
    resources :invoices
    resources :places do
      get 'find', on: :collection, to: 'places#find'
    end
    resources :employees
  end
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
