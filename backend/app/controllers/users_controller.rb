class UsersController < ApplicationController
  def current
    render json: current_user, status: :ok
  end
end
