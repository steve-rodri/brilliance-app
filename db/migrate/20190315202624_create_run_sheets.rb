class CreateRunSheets < ActiveRecord::Migration[5.2]
  def change
    create_table :run_sheets do |t|
      t.string :guest_of_honor
      t.string :dj
      t.string :walls_foundation
      t.string :dome_foundation
      t.string :coffer_foundation
      t.string :columns_foundation
      t.string :elevator
      t.string :bar
      t.string :tier
      t.string :walls_entrance
      t.string :intells_entrance
      t.string :dome_entrance
      t.string :candle_lighting
      t.string :logo
      t.string :montage
      t.string :screens
      t.string :bar_screens_adult_cocktail
      t.string :kids_zeus_room
      t.string :zapshots
      t.string :foundation
      t.string :intro_bridal_party
      t.string :bride_and_groom
      t.string :first_dance
      t.string :toast
      t.string :dinner
      t.string :cake_cutting
      t.string :bride_and_father
      t.string :groom_and_mother
      t.string :comments
      t.references :event, foreign_key: true

      t.timestamps
    end
  end
end
