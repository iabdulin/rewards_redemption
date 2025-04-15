# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_04_14_214700) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "redemptions", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "reward_id", null: false
    t.string "reward_name", null: false
    t.text "reward_description"
    t.integer "reward_cost", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["reward_id"], name: "index_redemptions_on_reward_id"
    t.index ["user_id"], name: "index_redemptions_on_user_id"
  end

  create_table "rewards", force: :cascade do |t|
    t.string "name", null: false
    t.text "description"
    t.integer "cost", null: false
    t.boolean "available", default: true, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "users", force: :cascade do |t|
    t.string "name", null: false
    t.integer "points_balance", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.check_constraint "points_balance >= 0", name: "points_balance_non_negative"
  end

  add_foreign_key "redemptions", "rewards"
  add_foreign_key "redemptions", "users"
end
