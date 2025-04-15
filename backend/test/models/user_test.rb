require "test_helper"

class UserTest < ActiveSupport::TestCase
  context "validations" do
    should validate_presence_of(:name)
    should validate_presence_of(:points_balance)
    should validate_numericality_of(:points_balance).is_greater_than_or_equal_to(0).only_integer
  end

  context "associations" do
    should have_many(:redemptions)
  end
end
