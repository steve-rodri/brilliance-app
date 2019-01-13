require 'test_helper'

class EmailAddressesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @email_address = email_addresses(:one)
  end

  test "should get index" do
    get email_addresses_url, as: :json
    assert_response :success
  end

  test "should create email_address" do
    assert_difference('EmailAddress.count') do
      post email_addresses_url, params: { email_address: { address: @email_address.address } }, as: :json
    end

    assert_response 201
  end

  test "should show email_address" do
    get email_address_url(@email_address), as: :json
    assert_response :success
  end

  test "should update email_address" do
    patch email_address_url(@email_address), params: { email_address: { address: @email_address.address } }, as: :json
    assert_response 200
  end

  test "should destroy email_address" do
    assert_difference('EmailAddress.count', -1) do
      delete email_address_url(@email_address), as: :json
    end

    assert_response 204
  end
end
