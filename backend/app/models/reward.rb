class Reward < ApplicationRecord
  has_many :redemptions, dependent: :destroy

  validates :name, presence: true
  validates :cost,
    presence: true,
    numericality: { only_integer: true }
  validates :available, inclusion: { in: [ true, false ] }
end
