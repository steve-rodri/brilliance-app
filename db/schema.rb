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

ActiveRecord::Schema.define(version: 2019_05_01_163920) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.bigint "byte_size", null: false
    t.string "checksum", null: false
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "addresses", force: :cascade do |t|
    t.string "address"
    t.string "street"
    t.string "city"
    t.string "state"
    t.string "zip"
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

  create_table "contents", force: :cascade do |t|
    t.string "kind"
    t.string "description"
    t.boolean "description_only", default: false
    t.integer "quantity", default: 1
    t.boolean "inc", default: false
    t.boolean "inc_discount_in_opct", default: false
    t.float "discount_adj", default: 0.0
    t.integer "hours_for_labor_only"
    t.boolean "subcontracted", default: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "inventory_id"
    t.index ["inventory_id"], name: "index_contents_on_inventory_id"
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
    t.boolean "active", default: true
    t.boolean "labor", default: true
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

  create_table "expenses", force: :cascade do |t|
    t.string "kind"
    t.float "amount", default: 0.0
    t.string "reimbursement_type"
    t.string "receipt"
    t.boolean "paid", default: false
    t.string "notes"
    t.bigint "employee_id"
    t.bigint "event_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["employee_id"], name: "index_expenses_on_employee_id"
    t.index ["event_id"], name: "index_expenses_on_event_id"
  end

  create_table "inventories", force: :cascade do |t|
    t.string "category"
    t.string "name"
    t.string "manufacturer"
    t.integer "total_owned"
    t.float "sell_price", default: 0.0
    t.float "rental_price", default: 0.0
    t.float "net_cost_per_invoice", default: 0.0
    t.float "purchase_price", default: 0.0
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "invoices", force: :cascade do |t|
    t.string "kind"
    t.string "status"
    t.string "payment_status", default: "Not Paid"
    t.string "payment_type"
    t.float "commission_actual"
    t.boolean "commission_paid", default: false
    t.string "check"
    t.float "deposit", default: 0.0
    t.float "discount", default: 0.0
    t.float "tip", default: 0.0
    t.float "refund", default: 0.0
    t.float "sub_total", default: 0.0
    t.float "total", default: 0.0
    t.float "balance", default: 0.0
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "event_id"
    t.index ["event_id"], name: "index_invoices_on_event_id"
  end

  create_table "item_contents", force: :cascade do |t|
    t.bigint "item_id"
    t.bigint "content_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["content_id"], name: "index_item_contents_on_content_id"
    t.index ["item_id"], name: "index_item_contents_on_item_id"
  end

  create_table "items", force: :cascade do |t|
    t.string "name"
    t.string "kind"
    t.string "install"
    t.string "description"
    t.string "additional_notes"
    t.integer "quantity", default: 1
    t.float "discount_adj", default: 0.0
    t.boolean "use_description", default: false
    t.boolean "use_description_only", default: false
    t.boolean "use_quantity", default: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "lines", force: :cascade do |t|
    t.boolean "inc", default: false
    t.boolean "inc_in_commission", default: false
    t.float "discount_adj", default: 0.0
    t.float "price", default: 0.0
    t.integer "quantity", default: 0
    t.bigint "invoice_id"
    t.bigint "item_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["invoice_id"], name: "index_lines_on_invoice_id"
    t.index ["item_id"], name: "index_lines_on_item_id"
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

  create_table "run_sheets", force: :cascade do |t|
    t.string "guest_of_honor"
    t.string "dj"
    t.string "walls_foundation"
    t.string "dome_foundation"
    t.string "coffer_foundation"
    t.string "columns_foundation"
    t.string "elevator"
    t.string "bar"
    t.string "tier"
    t.string "walls_entrance"
    t.string "intells_entrance"
    t.string "dome_entrance"
    t.string "candle_lighting"
    t.string "logo"
    t.string "montage"
    t.string "screens"
    t.string "bar_screens_adult_cocktail"
    t.string "kids_zeus_room"
    t.string "zapshots"
    t.string "foundation"
    t.string "intro_bridal_party"
    t.string "bride_and_groom"
    t.string "first_dance"
    t.string "toast"
    t.string "dinner"
    t.string "cake_cutting"
    t.string "bride_and_father"
    t.string "groom_and_mother"
    t.string "comments"
    t.bigint "event_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["event_id"], name: "index_run_sheets_on_event_id"
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "clients", "companies"
  add_foreign_key "clients", "contacts"
  add_foreign_key "contents", "inventories"
  add_foreign_key "email_addresses", "companies"
  add_foreign_key "email_addresses", "contacts"
  add_foreign_key "employees", "contacts"
  add_foreign_key "event_employees", "employees"
  add_foreign_key "event_employees", "events"
  add_foreign_key "events", "clients"
  add_foreign_key "events", "contacts", column: "creator_id"
  add_foreign_key "events", "places", column: "call_location_id"
  add_foreign_key "events", "places", column: "location_id"
  add_foreign_key "expenses", "employees"
  add_foreign_key "expenses", "events"
  add_foreign_key "invoices", "events"
  add_foreign_key "item_contents", "contents"
  add_foreign_key "item_contents", "items"
  add_foreign_key "lines", "invoices"
  add_foreign_key "lines", "items"
  add_foreign_key "places", "addresses"
  add_foreign_key "places", "companies"
  add_foreign_key "run_sheets", "events"
end
