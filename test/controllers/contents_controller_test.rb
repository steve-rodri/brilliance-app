require 'test_helper'

class ContentsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @content = contents(:one)
  end

  test "should get index" do
    get contents_url, as: :json
    assert_response :success
  end

  test "should create content" do
    assert_difference('Content.count') do
      post contents_url, params: { content: { description: @content.description, description_only: @content.description_only, discount_adj: @content.discount_adj, hours_for_labor_only: @content.hours_for_labor_only, inc: @content.inc, inc_discount_in_opct: @content.inc_discount_in_opct, kind: @content.kind, quantity: @content.quantity } }, as: :json
    end

    assert_response 201
  end

  test "should show content" do
    get content_url(@content), as: :json
    assert_response :success
  end

  test "should update content" do
    patch content_url(@content), params: { content: { description: @content.description, description_only: @content.description_only, discount_adj: @content.discount_adj, hours_for_labor_only: @content.hours_for_labor_only, inc: @content.inc, inc_discount_in_opct: @content.inc_discount_in_opct, kind: @content.kind, quantity: @content.quantity } }, as: :json
    assert_response 200
  end

  test "should destroy content" do
    assert_difference('Content.count', -1) do
      delete content_url(@content), as: :json
    end

    assert_response 204
  end
end
