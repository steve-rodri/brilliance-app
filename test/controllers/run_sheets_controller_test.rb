require 'test_helper'

class RunSheetsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @run_sheet = run_sheets(:one)
  end

  test "should get index" do
    get run_sheets_url, as: :json
    assert_response :success
  end

  test "should create run_sheet" do
    assert_difference('RunSheet.count') do
      post run_sheets_url, params: { run_sheet: { bar: @run_sheet.bar, bar_screens_adult_cocktail: @run_sheet.bar_screens_adult_cocktail, bride_and_father: @run_sheet.bride_and_father, bride_and_groom: @run_sheet.bride_and_groom, cake_cutting: @run_sheet.cake_cutting, candle_lighting: @run_sheet.candle_lighting, coffer_foundation: @run_sheet.coffer_foundation, columns_foundation: @run_sheet.columns_foundation, comments: @run_sheet.comments, dinner: @run_sheet.dinner, dj: @run_sheet.dj, dome_entrance: @run_sheet.dome_entrance, dome_foundation: @run_sheet.dome_foundation, elevator: @run_sheet.elevator, event_id: @run_sheet.event_id, first_dance: @run_sheet.first_dance, foundation: @run_sheet.foundation, groom_and_mother: @run_sheet.groom_and_mother, guest_of_honor: @run_sheet.guest_of_honor, intells_entrance: @run_sheet.intells_entrance, intro_bridal_party: @run_sheet.intro_bridal_party, kids_zeus_room: @run_sheet.kids_zeus_room, logo: @run_sheet.logo, montage: @run_sheet.montage, screens: @run_sheet.screens, tier: @run_sheet.tier, toast: @run_sheet.toast, walls_entrance: @run_sheet.walls_entrance, walls_foundation: @run_sheet.walls_foundation, zapshots: @run_sheet.zapshots } }, as: :json
    end

    assert_response 201
  end

  test "should show run_sheet" do
    get run_sheet_url(@run_sheet), as: :json
    assert_response :success
  end

  test "should update run_sheet" do
    patch run_sheet_url(@run_sheet), params: { run_sheet: { bar: @run_sheet.bar, bar_screens_adult_cocktail: @run_sheet.bar_screens_adult_cocktail, bride_and_father: @run_sheet.bride_and_father, bride_and_groom: @run_sheet.bride_and_groom, cake_cutting: @run_sheet.cake_cutting, candle_lighting: @run_sheet.candle_lighting, coffer_foundation: @run_sheet.coffer_foundation, columns_foundation: @run_sheet.columns_foundation, comments: @run_sheet.comments, dinner: @run_sheet.dinner, dj: @run_sheet.dj, dome_entrance: @run_sheet.dome_entrance, dome_foundation: @run_sheet.dome_foundation, elevator: @run_sheet.elevator, event_id: @run_sheet.event_id, first_dance: @run_sheet.first_dance, foundation: @run_sheet.foundation, groom_and_mother: @run_sheet.groom_and_mother, guest_of_honor: @run_sheet.guest_of_honor, intells_entrance: @run_sheet.intells_entrance, intro_bridal_party: @run_sheet.intro_bridal_party, kids_zeus_room: @run_sheet.kids_zeus_room, logo: @run_sheet.logo, montage: @run_sheet.montage, screens: @run_sheet.screens, tier: @run_sheet.tier, toast: @run_sheet.toast, walls_entrance: @run_sheet.walls_entrance, walls_foundation: @run_sheet.walls_foundation, zapshots: @run_sheet.zapshots } }, as: :json
    assert_response 200
  end

  test "should destroy run_sheet" do
    assert_difference('RunSheet.count', -1) do
      delete run_sheet_url(@run_sheet), as: :json
    end

    assert_response 204
  end
end
