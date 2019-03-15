class RunSheetSerializer < ActiveModel::Serializer
  attributes :id, :guest_of_honor, :dj, :walls_foundation, :dome_foundation, :coffer_foundation, :columns_foundation, :elevator, :bar, :tier, :walls_entrance, :intells_entrance, :dome_entrance, :candle_lighting, :logo, :montage, :screens, :bar_screens_adult_cocktail, :kids_zeus_room, :zapshots, :foundation, :intro_bridal_party, :bride_and_groom, :first_dance, :toast, :dinner, :cake_cutting, :bride_and_father, :groom_and_mother, :comments
  has_one :event
end
