class CreateRedemptions < ActiveRecord::Migration[8.0]
  def change
    create_table :redemptions do |t|
      t.references :user, null: false, foreign_key: true
      t.references :reward, null: false, foreign_key: true
      t.string :reward_name, null: false
      t.text :reward_description
      t.integer :reward_cost, null: false
      t.timestamps

      t.index [:user_id, :created_at], name: 'index_redemptions_on_user_id_and_created_at'
    end
  end
end
