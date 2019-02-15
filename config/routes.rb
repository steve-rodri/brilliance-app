Rails.application.routes.draw do
  scope '/api' do
    resources :addresses
    resources :clients do
      get 'find', on: :collection, to: 'clients#find'
      get 'events', on: :collection, to: 'clients#events'
    end
    resources :events do
      put 'sync', to: 'events#bulk_update'
    end
    resources :contacts do
      get 'find', on: :collection, to: 'contacts#find'
    end
    resources :companies do
      get 'find', on: :collection, to: 'companies#find'
    end
    resources :email_addresses
    resources :invoices
    resources :places do
      get 'find', on: :collection, to: 'places#find'
    end
  end
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
