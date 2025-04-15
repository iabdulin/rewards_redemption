class RewardsController < ApplicationController
  def index
    # Note: pagination is not implemented
    rewards = Reward.where(available: true)
    render json: rewards, status: :ok
  end

  def show
    reward = Reward.find(params[:id])
    render json: reward, status: :ok
  rescue ActiveRecord::RecordNotFound
    render json: { errors: [ "Reward not found" ] }, status: :not_found
  end
end
