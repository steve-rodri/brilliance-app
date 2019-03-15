require 'test_helper'

class LinesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @line = lines(:one)
  end

  test "should get index" do
    get lines_url, as: :json
    assert_response :success
  end

  test "should create line" do
    assert_difference('Line.count') do
      post lines_url, params: { line: { discount_adj: @line.discount_adj, inc: @line.inc, inc_in_commission: @line.inc_in_commission, invoice_id: @line.invoice_id, item_id: @line.item_id } }, as: :json
    end

    assert_response 201
  end

  test "should show line" do
    get line_url(@line), as: :json
    assert_response :success
  end

  test "should update line" do
    patch line_url(@line), params: { line: { discount_adj: @line.discount_adj, inc: @line.inc, inc_in_commission: @line.inc_in_commission, invoice_id: @line.invoice_id, item_id: @line.item_id } }, as: :json
    assert_response 200
  end

  test "should destroy line" do
    assert_difference('Line.count', -1) do
      delete line_url(@line), as: :json
    end

    assert_response 204
  end
end
