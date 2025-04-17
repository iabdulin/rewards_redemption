require "test_helper"

class TestControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = users(:one)
    @reward = rewards(:available_reward)
  end

  test "should have ensure_non_production_environment as a before_action for all actions" do
    before_actions = TestController._process_action_callbacks
                      .select { |callback| callback.kind == :before }
                      .map(&:filter)

    assert_includes before_actions, :ensure_non_production_environment,
                   "ensure_non_production_environment should be a before_action"

    callback = TestController._process_action_callbacks
                        .select { |callback| callback.filter == :ensure_non_production_environment }
                        .first
    options = callback.instance_variable_get(:@options) || {}
    assert_not options.key?(:only), "ensure_non_production_environment should apply to all actions, not just specific ones"
    assert_not options.key?(:except), "ensure_non_production_environment should apply to all actions without exceptions"
  end

  test "should block test endpoints in production environment" do
    controller = TestController.new

    assert_nothing_raised do # In test environment, should not raise error
      controller.send(:ensure_non_production_environment)
    end

    original_method = Rails.env.method(:production?)
    Rails.env.define_singleton_method(:production?) { true }
    begin
      assert_raises(ActionController::RoutingError) do
        controller.send(:ensure_non_production_environment)
      end
    ensure
      Rails.env.define_singleton_method(:production?, original_method)
    end
  end

  test "should clear database" do
    assert User.count > 0
    assert Reward.count > 0
    assert Redemption.count > 0

    delete clear_database_path

    assert_response :success
    assert_equal 0, User.count
    assert_equal 0, Reward.count
    assert_equal 0, Redemption.count
    assert_equal "Database cleared", JSON.parse(response.body)["message"]
  end

  test "should fill database with default fixtures" do
    User.destroy_all
    Reward.destroy_all
    Redemption.destroy_all

    assert_equal 0, User.count

    post fill_database_path

    assert_response :success
    assert User.count > 0
    assert Reward.count > 0
    assert Redemption.count > 0
    assert_equal "Fixtures loaded", JSON.parse(response.body)["message"]
  end

  test "should fill database with specific fixtures" do
    User.destroy_all
    Reward.destroy_all
    Redemption.destroy_all

    post fill_database_path, params: { fixtures: [ "users" ] }

    assert_response :success
    assert User.count > 0
    assert_equal 0, Reward.count
    assert_equal 0, Redemption.count
    assert_equal "Fixtures loaded", JSON.parse(response.body)["message"]
  end

  test "should update user balance" do
    new_balance = 1000

    patch update_balance_path, params: { points_balance: new_balance }

    assert_response :success
    assert_equal new_balance, User.first.points_balance
    assert_equal "Balance updated", JSON.parse(response.body)["message"]
  end

  test "should update reward availability" do
    original_availability = @reward.available

    patch update_reward_availability_path, params: { reward_id: @reward.id, available: !original_availability }

    assert_response :success
    @reward.reload
    assert_equal !original_availability, @reward.available
    assert_equal "Reward availability updated", JSON.parse(response.body)["message"]
  end

  test "should delete reward" do
    assert_difference("Reward.count", -1) do
      delete delete_reward_path, params: { reward_id: @reward.id }
    end

    assert_response :success
    assert_equal "Reward deleted", JSON.parse(response.body)["message"]
  end
end
