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
end
