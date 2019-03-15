require 'test_helper'

class InventoriesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @inventory = inventories(:one)
  end

  test "should get index" do
    get inventories_url, as: :json
    assert_response :success
  end

  test "should create inventory" do
    assert_difference('Inventory.count') do
      post inventories_url, params: { inventory: { category: @inventory.category, manufacturer: @inventory.manufacturer, name: @inventory.name, net_cost_per_invoice: @inventory.net_cost_per_invoice, picture: @inventory.picture, purchase_price: @inventory.purchase_price, rental_price: @inventory.rental_price, sell_price: @inventory.sell_price, total_owned: @inventory.total_owned } }, as: :json
    end

    assert_response 201
  end

  test "should show inventory" do
    get inventory_url(@inventory), as: :json
    assert_response :success
  end

  test "should update inventory" do
    patch inventory_url(@inventory), params: { inventory: { category: @inventory.category, manufacturer: @inventory.manufacturer, name: @inventory.name, net_cost_per_invoice: @inventory.net_cost_per_invoice, picture: @inventory.picture, purchase_price: @inventory.purchase_price, rental_price: @inventory.rental_price, sell_price: @inventory.sell_price, total_owned: @inventory.total_owned } }, as: :json
    assert_response 200
  end

  test "should destroy inventory" do
    assert_difference('Inventory.count', -1) do
      delete inventory_url(@inventory), as: :json
    end

    assert_response 204
  end
end
