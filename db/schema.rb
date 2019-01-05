# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2019_01_05_205114) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "clients", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "events", force: :cascade do |t|
    t.string "Confirmation"
    t.string "Action"
    t.string "Kind"
    t.string "Staff_Status"
    t.datetime "Event_Start"
    t.datetime "Event_End"
    t.datetime "Call_Time"
    t.datetime "Clock_Out"
    t.datetime "Break_Start"
    t.string "Driving_Time"
    t.string "Break"
    t.string "Description"
    t.string "Summary"
    t.text "Notes"
    t.string "Tags"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "client_id"
    t.index ["client_id"], name: "index_events_on_client_id"
  end

  create_table "invoices", force: :cascade do |t|
    t.string "Type"
    t.string "Status"
    t.string "Payment_Status"
    t.string "Payment_Type"
    t.string "Commission_Paid"
    t.string "Check_Info"
    t.float "Discount"
    t.float "Tip"
    t.float "Refund"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "event_id"
    t.index ["event_id"], name: "index_invoices_on_event_id"
  end

  add_foreign_key "events", "clients"
  add_foreign_key "invoices", "events"
end
