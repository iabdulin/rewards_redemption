Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"

  scope path: "/api/v1" do
    get "users/current", to: "users#current"
    resources :rewards, only: [ :index, :show ]
    resources :redemptions, only: [ :create, :index ]
  end

  unless Rails.env.production?
    scope path: "/test" do
      delete "clear_database", to: "test#clear_database"
      post "fill_database", to: "test#fill_database"
      patch "update_balance", to: "test#update_balance"
      patch "update_reward_availability", to: "test#update_reward_availability"
      delete "delete_reward", to: "test#delete_reward"
    end
  end
end
