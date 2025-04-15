class RedemptionsController < ApplicationController
  def index
    # Note: pagination is not implemented
    redemptions = Redemption.where(user: current_user).order(created_at: :desc)
    render json: redemptions, status: :ok
  end

  def create
    result = Redemptions::CreateService.new(
      user: current_user,
      reward: Reward.find_by(id: params[:reward_id])
    ).call

    if result[:success]
      render json: result[:redemption], status: :created
    else
      render json: {
        errors: result[:errors],
        details: result[:details]
      }, status: :unprocessable_entity
    end
  end
end
