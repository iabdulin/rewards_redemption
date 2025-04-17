class RewardsController < ApplicationController
  def index
    # Note: pagination is not implemented for simplicity
    rewards = Reward.where(available: true).order(id: :desc)
    render json: rewards, status: :ok
  end
end
