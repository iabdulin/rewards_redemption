class User < ApplicationRecord
  has_many :redemptions, dependent: :destroy

  validates :name, presence: true
  validates :points_balance,
    presence: true,
    numericality: {
      only_integer: true,
      greater_than_or_equal_to: 0
    }
end
