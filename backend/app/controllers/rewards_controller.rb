class RewardsController < ApplicationController
  def index
    # Note: pagination is not implemented
    rewards = Reward.where(available: true)
    render json: rewards, status: :ok
  end
end
