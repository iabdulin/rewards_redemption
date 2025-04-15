require "test_helper"

class RewardsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @reward = rewards(:available_reward)
    @unavailable_reward = rewards(:unavailable_reward)
    @user = users(:one)
  end

  test "should get index" do
    get rewards_path, as: :json
    assert_response :success

    json_response = JSON.parse(response.body)
    assert_equal Reward.where(available: true).as_json, json_response
  end

  test "should get show for existing reward" do
    get reward_path(@reward.id), as: :json
    assert_response :success

    json_response = JSON.parse(response.body)
    assert_equal @reward.as_json, json_response
  end

  test "should return not found for non-existent reward" do
    get reward_path(9999), as: :json
    assert_response :not_found

    json_response = JSON.parse(response.body)
    assert_equal [ "Reward not found" ], json_response["errors"]
  end
end
