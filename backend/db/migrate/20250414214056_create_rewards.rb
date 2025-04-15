class CreateRewards < ActiveRecord::Migration[8.0]
  def change
    create_table :rewards do |t|
      t.string :name, null: false
      t.text :description
      t.integer :cost, null: false
      t.boolean :available, null: false, default: true
      t.timestamps

      t.index :available
    end
  end
end
