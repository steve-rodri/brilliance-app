require 'test_helper'

class EventsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @event = events(:one)
  end

  test "should get index" do
    get events_url, as: :json
    assert_response :success
  end

  test "should create event" do
    assert_difference('Event.count') do
      post events_url, params: { event: { Action: @event.Action, Break: @event.Break, Break_Start: @event.Break_Start, Call_Time: @event.Call_Time, Clock_Out: @event.Clock_Out, Confirmation: @event.Confirmation, Description: @event.Description, Driving_Time: @event.Driving_Time, Event_End: @event.Event_End, Event_Start: @event.Event_Start, Kind: @event.Kind, Notes: @event.Notes, Staff_Status: @event.Staff_Status, Summary: @event.Summary, Tags: @event.Tags, client_id: @event.client_id } }, as: :json
    end

    assert_response 201
  end

  test "should show event" do
    get event_url(@event), as: :json
    assert_response :success
  end

  test "should update event" do
    patch event_url(@event), params: { event: { Action: @event.Action, Break: @event.Break, Break_Start: @event.Break_Start, Call_Time: @event.Call_Time, Clock_Out: @event.Clock_Out, Confirmation: @event.Confirmation, Description: @event.Description, Driving_Time: @event.Driving_Time, Event_End: @event.Event_End, Event_Start: @event.Event_Start, Kind: @event.Kind, Notes: @event.Notes, Staff_Status: @event.Staff_Status, Summary: @event.Summary, Tags: @event.Tags, client_id: @event.client_id } }, as: :json
    assert_response 200
  end

  test "should destroy event" do
    assert_difference('Event.count', -1) do
      delete event_url(@event), as: :json
    end

    assert_response 204
  end
end
