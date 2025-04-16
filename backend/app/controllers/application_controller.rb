class ApplicationController < ActionController::API
  before_action :authenticate_user!
  before_action :simulate_slow_response, if: -> { Rails.env.development? }

  private

  def authenticate_user!
    unless current_user
      render json: { errors: [ "Unauthorized" ] }, status: :unauthorized
    end
  end

  # Intentionally simplified authentication - just returns the first user
  def current_user
    User.first
  end

  def simulate_slow_response
    sleep 0.2 # to simulate loading
  end
end
