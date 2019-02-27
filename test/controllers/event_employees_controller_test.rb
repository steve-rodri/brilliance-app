require 'test_helper'

class EventEmployeesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @event_employee = event_employees(:one)
  end

  test "should get index" do
    get event_employees_url, as: :json
    assert_response :success
  end

  test "should create event_employee" do
    assert_difference('EventEmployee.count') do
      post event_employees_url, params: { event_employee: { break(minutes): @event_employee.break(minutes), break?: @event_employee.break?, clock_in: @event_employee.clock_in, clock_out: @event_employee.clock_out, confirmation: @event_employee.confirmation, employee_id: @event_employee.employee_id, event_id: @event_employee.event_id, hourly?: @event_employee.hourly?, paid?: @event_employee.paid?, position: @event_employee.position, rate_override: @event_employee.rate_override } }, as: :json
    end

    assert_response 201
  end

  test "should show event_employee" do
    get event_employee_url(@event_employee), as: :json
    assert_response :success
  end

  test "should update event_employee" do
    patch event_employee_url(@event_employee), params: { event_employee: { break(minutes): @event_employee.break(minutes), break?: @event_employee.break?, clock_in: @event_employee.clock_in, clock_out: @event_employee.clock_out, confirmation: @event_employee.confirmation, employee_id: @event_employee.employee_id, event_id: @event_employee.event_id, hourly?: @event_employee.hourly?, paid?: @event_employee.paid?, position: @event_employee.position, rate_override: @event_employee.rate_override } }, as: :json
    assert_response 200
  end

  test "should destroy event_employee" do
    assert_difference('EventEmployee.count', -1) do
      delete event_employee_url(@event_employee), as: :json
    end

    assert_response 204
  end
end
