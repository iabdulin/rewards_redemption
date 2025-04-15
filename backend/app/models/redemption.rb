class Redemption < ApplicationRecord
  belongs_to :user
  belongs_to :reward

  validates :reward_name, presence: true
  validates :reward_cost,
    presence: true,
    numericality: { only_integer: true }
end
