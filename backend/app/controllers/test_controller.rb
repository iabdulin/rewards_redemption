class TestController < ApplicationController
  before_action :ensure_non_production_environment
  skip_before_action :authenticate_user!

  def clear_database
    delete_all_records
    render json: { message: "Database cleared" }
  end

  def fill_database
    delete_all_records
    load_fixtures(params[:fixtures])
    render json: { message: "Fixtures loaded" }
  end

  def update_balance
    user = User.first
    raise "User not found" unless user
    user.update!(points_balance: params[:points_balance])
    render json: { message: "Balance updated" }
  end

  def update_reward_availability
    reward = Reward.find(params[:reward_id])
    reward.update!(available: params[:available])
    render json: { message: "Reward availability updated" }
  end

  def delete_reward
    reward = Reward.find(params[:reward_id])
    reward.destroy!
    render json: { message: "Reward deleted" }
  end

  private

  def ensure_non_production_environment
    if Rails.env.production?
      raise ActionController::RoutingError.new("Not Found")
    end
  end

  def delete_all_records
    User.destroy_all
    Reward.destroy_all
    Redemption.destroy_all
  end

  def load_fixtures(fixtures)
    fixtures ||= %w[users rewards redemptions]
    ActiveRecord::FixtureSet.reset_cache

    fixtures.each do |fixture_name|
      ActiveRecord::FixtureSet.create_fixtures(
        Rails.root.join("test", "fixtures"),
        fixture_name
      )
    end
  end
end
