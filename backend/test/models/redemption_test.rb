require "test_helper"

class RedemptionTest < ActiveSupport::TestCase
  context "validations" do
    should validate_presence_of(:reward_name)
    should validate_presence_of(:reward_cost)
    should validate_numericality_of(:reward_cost).only_integer
  end

  context "associations" do
    should belong_to(:user)
    should belong_to(:reward)
  end
end
