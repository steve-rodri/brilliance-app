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

ActiveRecord::Schema.define(version: 2019_01_13_202849) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

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
    t.string "address"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "contact_id"
    t.bigint "company_id"
    t.index ["company_id"], name: "index_email_addresses_on_company_id"
    t.index ["contact_id"], name: "index_email_addresses_on_contact_id"
  end

  create_table "events", force: :cascade do |t|
    t.string "action"
    t.string "break"
    t.datetime "break_start"
    t.datetime "call_time"
    t.datetime "clock_out"
    t.string "confirmation"
    t.string "creator"
    t.string "description"
    t.string "driving_time"
    t.datetime "end"
    t.string "gc_id"
    t.string "html_link"
    t.string "kind"
    t.text "notes"
    t.datetime "start"
    t.string "summary"
    t.string "tags"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "client_id"
    t.index ["client_id"], name: "index_events_on_client_id"
  end

  create_table "invoices", force: :cascade do |t|
    t.string "kind"
    t.string "status"
    t.string "payment_status"
    t.string "payment_type"
    t.string "commission_paid"
    t.string "check_info"
    t.float "discount"
    t.float "tip"
    t.float "refund"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "event_id"
    t.index ["event_id"], name: "index_invoices_on_event_id"
  end

  add_foreign_key "clients", "companies"
  add_foreign_key "clients", "contacts"
  add_foreign_key "email_addresses", "companies"
  add_foreign_key "email_addresses", "contacts"
  add_foreign_key "events", "clients"
  add_foreign_key "invoices", "events"
end
