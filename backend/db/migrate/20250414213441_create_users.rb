class CreateUsers < ActiveRecord::Migration[8.0]
  def change
    create_table :users do |t|
      t.string :name, null: false
      t.integer :points_balance, null: false, default: 0
      t.check_constraint "points_balance >= 0", name: "points_balance_non_negative"
      t.timestamps
    end
  end
end
