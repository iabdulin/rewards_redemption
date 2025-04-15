require "test_helper"

class UsersControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = users(:one)
    UsersController.any_instance.stubs(:current_user).returns(@user)
  end

  test "should get current user" do
    get users_current_path, as: :json
    assert_response :success

    json_response = JSON.parse(response.body)
    assert_equal @user.id, json_response["id"]
    assert_equal @user.name, json_response["name"]
    assert_equal @user.points_balance, json_response["points_balance"]
  end
end
