require "test_helper"

module Redemptions
  class CreateServiceTest < ActiveSupport::TestCase
    setup do
      @user = users(:one) # points_balance: 1000
      @available_reward = rewards(:available_reward) # cost: 100
      @unavailable_reward = rewards(:unavailable_reward) # cost: 500
      @expensive_reward = rewards(:expensive_reward) # cost: 2000
    end

    test "should successfully create a redemption with valid inputs" do
      initial_balance = @user.points_balance # 1000
      service = CreateService.new(user: @user, reward: @available_reward)
      result = service.call

      assert result[:success]
      assert_empty result[:errors]

      redemption = result[:redemption]
      assert_equal @user.id, redemption.user_id
      assert_equal @available_reward.id, redemption.reward_id
      assert_equal @available_reward.name, redemption.reward_name
      assert_equal @available_reward.description, redemption.reward_description
      assert_equal @available_reward.cost, redemption.reward_cost

      # Check that points were deducted
      @user.reload
      assert_equal initial_balance - @available_reward.cost, @user.points_balance # 1000 - 100 = 900
    end

    test "should fail when reward is unavailable" do
      initial_balance = @user.points_balance # 1000
      service = CreateService.new(user: @user, reward: @unavailable_reward)
      result = service.call

      assert_not result[:success]
      assert_nil result[:redemption]
      assert_equal [
        "Reward '#{@unavailable_reward.name}' is not available for redemption"
      ], result[:errors]

      # Check that points were not deducted
      @user.reload
      assert_equal initial_balance, @user.points_balance # 1000
    end

    test "should fail when user has insufficient points" do
      initial_balance = @user.points_balance # 1000

      service = CreateService.new(user: @user, reward: @expensive_reward)
      result = service.call

      assert_not result[:success]
      assert_nil result[:redemption]
      assert_equal [
        "Insufficient balance: user has #{@user.points_balance} points, reward costs #{@expensive_reward.cost} points"
      ], result[:errors]

      # Check details
      assert_equal initial_balance, result[:details][:available]
      assert_equal @expensive_reward.cost, result[:details][:required]

      # Check that points were not deducted
      @user.reload
      assert_equal initial_balance, @user.points_balance
    end

    test "should fail when user is nil" do
      service = CreateService.new(user: nil, reward: @available_reward)
      result = service.call

      assert_not result[:success]
      assert_nil result[:redemption]
      assert_equal [ "User not found" ], result[:errors]
    end

    test "should fail when reward is nil" do
      service = CreateService.new(user: @user, reward: nil)
      result = service.call

      assert_not result[:success]
      assert_nil result[:redemption]
      assert_equal [ "Reward not found" ], result[:errors]
    end
  end
end
