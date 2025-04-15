require "test_helper"

class RedemptionsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = users(:one)
    @reward = rewards(:available_reward)
    @unavailable_reward = rewards(:unavailable_reward)
    @expensive_reward = rewards(:expensive_reward)
    @redemption = redemptions(:one)

    RedemptionsController.any_instance.stubs(:current_user).returns(@user)
  end

  test "should get index" do
    get redemptions_path, as: :json
    assert_response :success

    json_response = JSON.parse(response.body)
    assert_equal @user.redemptions.as_json, json_response
  end

  test "should create redemption when user has enough points" do
    assert_difference("Redemption.count") do
      post redemptions_path, params: { reward_id: @reward.id }, as: :json
    end

    assert_response :created
    json_response = JSON.parse(response.body)
    assert_equal @user.id, json_response["user_id"]
    assert_equal @reward.id, json_response["reward_id"]
    assert_equal @reward.name, json_response["reward_name"]
    assert_equal @reward.description, json_response["reward_description"]
    assert_equal @reward.cost, json_response["reward_cost"]
  end

  test "should not create redemption when reward is unavailable" do
    assert_no_difference("Redemption.count") do
      post redemptions_path, params: { reward_id: @unavailable_reward.id }, as: :json
    end

    assert_response :unprocessable_entity
    json_response = JSON.parse(response.body)
    assert_equal [
      "Reward '#{@unavailable_reward.name}' is not available for redemption"
    ], json_response["errors"]
  end

  test "should not create redemption when user has insufficient points" do
    assert_no_difference("Redemption.count") do
      post redemptions_path, params: { reward_id: @expensive_reward.id }, as: :json
    end

    assert_response :unprocessable_entity
    json_response = JSON.parse(response.body)
    assert_equal [
      "Insufficient balance: user has #{@user.points_balance} points, reward costs #{@expensive_reward.cost} points"
    ], json_response["errors"]
  end

  test "should return error when reward doesn't exist" do
    assert_no_difference("Redemption.count") do
      post redemptions_path, params: { reward_id: 9999 }, as: :json
    end

    assert_response :unprocessable_entity
    json_response = JSON.parse(response.body)
    assert_equal [ "Reward not found" ], json_response["errors"]
  end
end
