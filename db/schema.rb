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

ActiveRecord::Schema.define(version: 2019_02_27_170306) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "addresses", force: :cascade do |t|
    t.string "address"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "clients", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "company_id"
    t.bigint "contact_id"
    t.index ["company_id"], name: "index_clients_on_company_id"
    t.index ["contact_id"], name: "index_clients_on_contact_id"
  end

  create_table "companies", force: :cascade do |t|
    t.string "name"
    t.string "logo"
    t.string "website"
    t.string "phone_number"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "contacts", force: :cascade do |t|
    t.string "photo"
    t.string "prefix"
    t.string "first_name"
    t.string "last_name"
    t.string "phone_number"
    t.string "work_email"
    t.string "ss"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "email_addresses", force: :cascade do |t|
    t.string "email_address"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "contact_id"
    t.bigint "company_id"
    t.index ["company_id"], name: "index_email_addresses_on_company_id"
    t.index ["contact_id"], name: "index_email_addresses_on_contact_id"
  end

  create_table "employees", force: :cascade do |t|
    t.boolean "active?"
    t.boolean "labor?"
    t.float "rate_hand_per_job"
    t.float "rate_full_job"
    t.float "rate_on_premise_one_man"
    t.float "rate_on_premise"
    t.float "rate_hourly"
    t.float "rate_hourly_office_shop"
    t.float "rate_demo"
    t.bigint "contact_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["contact_id"], name: "index_employees_on_contact_id"
  end

  create_table "event_employees", force: :cascade do |t|
    t.string "confirmation", default: "needsAction"
    t.boolean "paid?", default: false
    t.string "position"
    t.float "rate", default: 0.0
    t.date "clock_in"
    t.date "clock_out"
    t.integer "break_minutes", default: 0
    t.boolean "break?", default: false
    t.boolean "hourly?", default: false
    t.bigint "employee_id"
    t.bigint "event_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["employee_id"], name: "index_event_employees_on_employee_id"
    t.index ["event_id"], name: "index_event_employees_on_event_id"
  end

  create_table "events", force: :cascade do |t|
    t.string "action"
    t.string "break"
    t.datetime "break_start"
    t.datetime "call_time"
    t.datetime "clock_out"
    t.string "confirmation", default: "Unconfirmed"
    t.string "description"
    t.string "driving_time"
    t.datetime "end"
    t.string "gc_id"
    t.string "html_link"
    t.string "i_cal_UID"
    t.string "kind"
    t.text "notes"
    t.datetime "start"
    t.string "summary"
    t.string "tags"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "client_id"
    t.integer "location_id"
    t.integer "call_location_id"
    t.integer "creator_id"
    t.index ["client_id"], name: "index_events_on_client_id"
  end

  create_table "invoices", force: :cascade do |t|
    t.string "kind"
    t.string "status"
    t.string "payment_status"
    t.string "payment_type"
    t.string "commission_actual"
    t.string "commission_paid"
    t.string "check_info"
    t.float "deposit"
    t.float "discount"
    t.float "tip"
    t.float "refund"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "event_id"
    t.index ["event_id"], name: "index_invoices_on_event_id"
  end

  create_table "places", force: :cascade do |t|
    t.boolean "installation"
    t.string "photo"
    t.string "name"
    t.string "short_name"
    t.string "commission"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "address_id"
    t.bigint "company_id"
    t.index ["address_id"], name: "index_places_on_address_id"
    t.index ["company_id"], name: "index_places_on_company_id"
  end

  add_foreign_key "clients", "companies"
  add_foreign_key "clients", "contacts"
  add_foreign_key "email_addresses", "companies"
  add_foreign_key "email_addresses", "contacts"
  add_foreign_key "employees", "contacts"
  add_foreign_key "event_employees", "employees"
  add_foreign_key "event_employees", "events"
  add_foreign_key "events", "clients"
  add_foreign_key "events", "contacts", column: "creator_id"
  add_foreign_key "events", "places", column: "call_location_id"
  add_foreign_key "events", "places", column: "location_id"
  add_foreign_key "invoices", "events"
  add_foreign_key "places", "addresses"
  add_foreign_key "places", "companies"
end
