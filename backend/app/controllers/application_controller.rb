class ApplicationController < ActionController::API
  before_action :authenticate_user!

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
end
