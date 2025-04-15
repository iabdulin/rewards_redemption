require "test_helper"

class RewardTest < ActiveSupport::TestCase
  context "validations" do
    should validate_presence_of(:name)
    should validate_presence_of(:cost)
    should validate_numericality_of(:cost).only_integer
    should validate_presence_of(:available)
  end

  context "associations" do
    should have_many(:redemptions)
  end
end
