module Redemptions
  class CreateService
    def initialize(user:, reward:)
      @user = user
      @reward = reward
      @errors = []
    end

    def call
      return error_result("User not found") unless @user
      return error_result("Reward not found") unless @reward

      @reward.with_lock do
        @user.with_lock do
          unless @reward.available
            return error_result("Reward '#{@reward.name}' is not available for redemption")
          end

          if @user.points_balance < @reward.cost
            return error_result(
              "Insufficient balance: user has #{@user.points_balance} points, reward costs #{@reward.cost} points",
              { available: @user.points_balance, required: @reward.cost }
            )
          end

          redemption = Redemption.new(
            user: @user,
            reward: @reward,
            reward_name: @reward.name,
            reward_description: @reward.description,
            reward_cost: @reward.cost
          )

          @user.points_balance -= @reward.cost

          @user.save!
          redemption.save!

          success_result(redemption)
        end
      end
    rescue ActiveRecord::StatementInvalid => e
      Rails.logger.error("Database error during redemption: #{e.message}")
      Rails.logger.error("SQL State: #{e.sql_state}") if e.respond_to?(:sql_state)
      Rails.logger.error("Error details: #{e.record.errors.full_messages.join(', ')}") if e.respond_to?(:record) && e.record.respond_to?(:errors)
      error_result("Database error occurred")
    rescue StandardError => e
      Rails.logger.error("Unexpected error during redemption: #{e.message}")
      Rails.logger.error("Error class: #{e.class}")
      Rails.logger.error("Backtrace: #{e.backtrace[0..5].join("\n")}") if e.backtrace
      error_result("An unexpected error occurred")
    end

    private

    def success_result(redemption)
      {
        success: true,
        redemption: redemption,
        errors: []
      }
    end

    def error_result(message, details = {})
      {
        success: false,
        redemption: nil,
        errors: [ message ],
        details: details
      }
    end
  end
end
