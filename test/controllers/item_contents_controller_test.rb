require 'test_helper'

class ItemContentsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @item_content = item_contents(:one)
  end

  test "should get index" do
    get item_contents_url, as: :json
    assert_response :success
  end

  test "should create item_content" do
    assert_difference('ItemContent.count') do
      post item_contents_url, params: { item_content: { content_id: @item_content.content_id, item_id: @item_content.item_id } }, as: :json
    end

    assert_response 201
  end

  test "should show item_content" do
    get item_content_url(@item_content), as: :json
    assert_response :success
  end

  test "should update item_content" do
    patch item_content_url(@item_content), params: { item_content: { content_id: @item_content.content_id, item_id: @item_content.item_id } }, as: :json
    assert_response 200
  end

  test "should destroy item_content" do
    assert_difference('ItemContent.count', -1) do
      delete item_content_url(@item_content), as: :json
    end

    assert_response 204
  end
end
