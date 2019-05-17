class Item < ApplicationRecord
  has_many :lines, dependent: :nullify
  has_many :item_contents, inverse_of: :item, autosave: true, dependent: :destroy
  has_many :contents, through: :item_contents

  accepts_nested_attributes_for :item_contents, allow_destroy: :true
end
