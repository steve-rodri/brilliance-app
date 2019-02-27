require 'test_helper'

class EmployeesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @employee = employees(:one)
  end

  test "should get index" do
    get employees_url, as: :json
    assert_response :success
  end

  test "should create employee" do
    assert_difference('Employee.count') do
      post employees_url, params: { employee: { active?: @employee.active?, contact_id: @employee.contact_id, labor?: @employee.labor?, rate_demo: @employee.rate_demo, rate_full_job: @employee.rate_full_job, rate_hand_per_job: @employee.rate_hand_per_job, rate_hourly: @employee.rate_hourly, rate_hourly_office_shop: @employee.rate_hourly_office_shop, rate_on_premise: @employee.rate_on_premise, rate_on_premise_one_man: @employee.rate_on_premise_one_man } }, as: :json
    end

    assert_response 201
  end

  test "should show employee" do
    get employee_url(@employee), as: :json
    assert_response :success
  end

  test "should update employee" do
    patch employee_url(@employee), params: { employee: { active?: @employee.active?, contact_id: @employee.contact_id, labor?: @employee.labor?, rate_demo: @employee.rate_demo, rate_full_job: @employee.rate_full_job, rate_hand_per_job: @employee.rate_hand_per_job, rate_hourly: @employee.rate_hourly, rate_hourly_office_shop: @employee.rate_hourly_office_shop, rate_on_premise: @employee.rate_on_premise, rate_on_premise_one_man: @employee.rate_on_premise_one_man } }, as: :json
    assert_response 200
  end

  test "should destroy employee" do
    assert_difference('Employee.count', -1) do
      delete employee_url(@employee), as: :json
    end

    assert_response 204
  end
end
